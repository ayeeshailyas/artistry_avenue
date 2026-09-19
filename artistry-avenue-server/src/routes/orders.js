import { Router } from "express";
import { randomUUID } from "crypto";
import { z } from "zod";
import { db } from "../db/index.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = Router();

const SHIPPING_FLAT = 250;
const FREE_SHIPPING_THRESHOLD = 5000;

const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        color: z.string().optional(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, "Your bag is empty."),
  fullName: z.string().trim().min(2, "Please share your name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().min(7, "Enter a valid phone number."),
  address: z.string().trim().min(4, "Please add your delivery address."),
  city: z.string().trim().min(2, "Please add your city."),
  postalCode: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  // "cod" = pay on delivery, reserved & recorded immediately.
  // "whatsapp" = order is recorded and the studio confirms details/payment over WhatsApp.
  paymentMethod: z.enum(["cod", "whatsapp"]),
});

function priceOrder(items) {
  let subtotal = 0;
  const resolved = [];
  for (const item of items) {
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(item.productId);
    if (!product) {
      throw Object.assign(new Error("One of the items in your bag is no longer available."), { status: 400 });
    }
    if (product.stock < item.quantity) {
      throw Object.assign(new Error(`"${product.name}" only has ${product.stock} left in stock.`), { status: 400 });
    }
    subtotal += product.price * item.quantity;
    resolved.push({
      product_id: product.id,
      name: product.name,
      color: item.color || JSON.parse(product.colors)[0] || null,
      price: product.price,
      quantity: item.quantity,
    });
  }
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  return { resolved, subtotal, shipping, total: subtotal + shipping };
}

function serializeOrder(order) {
  const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(order.id);
  return { ...order, items };
}

// Creates an order in the database, reserves stock, and (for WhatsApp orders)
// leaves the order awaiting the studio's confirmation once the customer
// sends the pre-filled WhatsApp message. No payment gateway is involved —
// COD is settled in person, WhatsApp orders are settled directly with the studio.
router.post("/", optionalAuth, (req, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const data = parsed.data;

  let priced;
  try {
    priced = priceOrder(data.items);
  } catch (err) {
    return res.status(err.status || 400).json({ error: err.message });
  }

  const orderId = `AA-${randomUUID().slice(0, 8).toUpperCase()}`;
  const paymentStatus = data.paymentMethod === "cod" ? "pending" : "awaiting_confirmation";

  const insertOrder = db.prepare(`
    INSERT INTO orders
      (id, user_id, full_name, email, phone, address, city, postal_code, notes,
       payment_method, payment_status, subtotal, shipping, total)
    VALUES
      (@id, @user_id, @full_name, @email, @phone, @address, @city, @postal_code, @notes,
       @payment_method, @payment_status, @subtotal, @shipping, @total)
  `);
  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, name, color, price, quantity)
    VALUES (@order_id, @product_id, @name, @color, @price, @quantity)
  `);
  const decrementStock = db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?");

  const run = db.transaction(() => {
    insertOrder.run({
      id: orderId,
      user_id: req.userId || null,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      postal_code: data.postalCode || null,
      notes: data.notes || null,
      payment_method: data.paymentMethod,
      payment_status: paymentStatus,
      subtotal: priced.subtotal,
      shipping: priced.shipping,
      total: priced.total,
    });
    for (const item of priced.resolved) {
      insertItem.run({ order_id: orderId, ...item });
      decrementStock.run(item.quantity, item.product_id);
    }
  });
  run();

  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
  res.status(201).json({ order: serializeOrder(order) });
});

router.get("/", requireAuth, (req, res) => {
  const orders = db
    .prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.userId);
  res.json({ orders: orders.map(serializeOrder) });
});

router.get("/:id", optionalAuth, (req, res) => {
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found." });
  if (order.user_id && order.user_id !== req.userId) {
    return res.status(403).json({ error: "You don't have access to this order." });
  }
  res.json({ order: serializeOrder(order) });
});

export default router;
