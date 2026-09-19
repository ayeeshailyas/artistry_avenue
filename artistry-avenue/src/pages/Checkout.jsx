import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Truck, MessageCircle, ShieldCheck } from "lucide-react";
import PageTransition from "../components/PageTransition";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api, ApiError } from "../lib/api";
import { formatPrice } from "../lib/format";
import { whatsAppLink } from "../components/WhatsAppButton";

const SHIPPING_FLAT = 250;
const FREE_SHIPPING_THRESHOLD = 5000;

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });
  const [payment, setPayment] = useState(location.state?.preferredPayment || "whatsapp");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function validate() {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Please share your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!/^[0-9+\-\s]{7,}$/.test(form.phone)) next.phone = "Enter a valid phone number.";
    if (!form.address.trim()) next.address = "Please add your delivery address.";
    if (!form.city.trim()) next.city = "Please add your city.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function buildWhatsAppMessage(order) {
    const lines = items.map(
      (i) => `• ${i.name} (${i.color}) x${i.quantity} — ${formatPrice(i.price * i.quantity)}`
    );
    return [
      `Hello Artistry Avenue! I'd like to place an order (${order.id}).`,
      ``,
      ...lines,
      ``,
      `Subtotal: ${formatPrice(order.subtotal)}`,
      `Shipping: ${order.shipping === 0 ? "Free" : formatPrice(order.shipping)}`,
      `Total: ${formatPrice(order.total)}`,
      ``,
      `Name: ${form.fullName}`,
      `Phone: ${form.phone}`,
      `Address: ${form.address}, ${form.city} ${form.postalCode}`.trim(),
      form.notes ? `Notes: ${form.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { order } = await api.createOrder({
        items: items.map((i) => ({ productId: i.id, color: i.color, quantity: i.quantity })),
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        notes: form.notes,
        paymentMethod: payment,
      });

      if (payment === "whatsapp") {
        window.open(whatsAppLink(buildWhatsAppMessage(order)), "_blank");
      }

      clearCart();
      navigate("/order-confirmation", { state: { order } });
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Something went wrong placing your order.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageTransition>
      <div className="max-w-container mx-auto px-5 md:px-10 py-14">
        <p className="text-xs tracking-widest2 text-wine uppercase mb-2">Checkout</p>
        <h1 className="font-display text-4xl text-plum mb-10">Complete Your Order</h1>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-[1fr_380px] gap-12">
          <div className="flex flex-col gap-10">
            <section>
              <h2 className="font-display text-xl text-plum mb-5">Shipping Details</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} />
                <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
                <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="03xx xxxxxxx" />
                <Field label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} />
                <Field label="Address" name="address" value={form.address} onChange={handleChange} error={errors.address} className="sm:col-span-2" />
                <Field label="Postal Code (optional)" name="postalCode" value={form.postalCode} onChange={handleChange} />
                <Field label="Delivery notes (optional)" name="notes" value={form.notes} onChange={handleChange} className="sm:col-span-2" />
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl text-plum mb-5">How would you like to order?</h2>
              <div className="flex flex-col gap-3">
                <PaymentOption
                  active={payment === "whatsapp"}
                  onClick={() => setPayment("whatsapp")}
                  icon={<MessageCircle size={18} className="text-[#25D366]" />}
                  title="Order via WhatsApp"
                  subtitle="We save your order, then open WhatsApp with everything filled in — just hit send and our studio confirms the rest with you directly."
                  recommended
                />
                <PaymentOption
                  active={payment === "cod"}
                  onClick={() => setPayment("cod")}
                  icon={<Truck size={18} />}
                  title="Cash on Delivery"
                  subtitle="Pay in cash when your order arrives at your door."
                />
              </div>
            </section>
          </div>

          <aside className="h-fit border border-hairline rounded-soft p-6">
            <h2 className="font-display text-xl text-plum mb-5">Order Summary</h2>
            <ul className="flex flex-col gap-3 mb-5 max-h-64 overflow-y-auto thin-scroll pr-1">
              {items.map((item) => (
                <li key={`${item.id}-${item.color}`} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-soft bg-paper-dim" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-plum truncate">{item.name}</p>
                    <p className="text-xs text-stone">{item.color} · x{item.quantity}</p>
                  </div>
                  <span className="text-sm text-wine shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="h-px bg-hairline mb-4" />
            <div className="flex items-center justify-between text-sm text-stone mb-2">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-stone mb-4">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="h-px bg-hairline mb-4" />
            <div className="flex items-center justify-between mb-6">
              <span className="text-plum">Total</span>
              <span className="text-xl text-wine font-display">{formatPrice(total)}</span>
            </div>

            {submitError && <p className="text-xs text-red-500 mb-3">{submitError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-plum text-paper text-sm tracking-wide py-4 rounded-pill hover:bg-wine transition-colors duration-300 disabled:opacity-60"
            >
              {submitting
                ? "Placing order…"
                : payment === "whatsapp"
                ? "Continue on WhatsApp"
                : "Place Order"}
            </button>
            <p className="flex items-center gap-1.5 justify-center text-xs text-stone mt-4">
              <ShieldCheck size={13} /> Your information stays with our studio only.
            </p>
          </aside>
        </form>
      </div>
    </PageTransition>
  );
}

function Field({ label, name, value, onChange, error, type = "text", className = "", placeholder }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs text-stone">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`bg-transparent border-b py-2 text-sm text-plum outline-none transition-colors ${
          error ? "border-red-400" : "border-plum/30 focus:border-wine"
        }`}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}

function PaymentOption({ active, onClick, icon, title, subtitle, recommended }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-4 text-left border rounded-soft px-5 py-4 transition-colors relative ${
        active ? "border-wine bg-blush" : "border-hairline hover:border-plum/40"
      }`}
    >
      {recommended && (
        <span className="absolute -top-2.5 left-4 bg-wine text-paper text-[9px] tracking-widest2 uppercase px-2.5 py-0.5 rounded-pill">
          Easiest
        </span>
      )}
      <span className={`mt-0.5 ${active ? "text-wine" : "text-plum"}`}>{icon}</span>
      <span>
        <span className="block text-sm text-plum">{title}</span>
        <span className="block text-xs text-stone mt-0.5">{subtitle}</span>
      </span>
    </button>
  );
}
