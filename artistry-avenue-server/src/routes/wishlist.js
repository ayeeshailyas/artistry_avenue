import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

function parseProduct(row) {
  return {
    ...row,
    compareAt: row.compare_at,
    colors: JSON.parse(row.colors),
    details: JSON.parse(row.details),
    images: JSON.parse(row.images),
  };
}

router.get("/", (req, res) => {
  const rows = db
    .prepare(
      `SELECT p.* FROM wishlist w JOIN products p ON p.id = w.product_id
       WHERE w.user_id = ? ORDER BY w.created_at DESC`
    )
    .all(req.userId);
  res.json({ products: rows.map(parseProduct) });
});

router.post("/:productId", (req, res) => {
  const product = db.prepare("SELECT id FROM products WHERE id = ?").get(req.params.productId);
  if (!product) return res.status(404).json({ error: "Product not found." });

  db.prepare(
    "INSERT OR IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)"
  ).run(req.userId, req.params.productId);

  res.status(201).json({ ok: true });
});

router.delete("/:productId", (req, res) => {
  db.prepare("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?").run(
    req.userId,
    req.params.productId
  );
  res.json({ ok: true });
});

export default router;
