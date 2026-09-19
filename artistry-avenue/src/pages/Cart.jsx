import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import PageTransition from "../components/PageTransition";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="max-w-container mx-auto px-5 md:px-10 py-24 min-h-[50vh] flex flex-col items-center justify-center text-center gap-4">
          <div className="w-20 h-20 seal-ring rounded-full flex items-center justify-center">
            <span className="text-3xl">✦</span>
          </div>
          <h1 className="font-display text-2xl text-plum">Your bag is empty</h1>
          <p className="text-stone max-w-xs">Let's find something worth writing home about.</p>
          <Link to="/shop" className="bg-plum text-paper text-sm px-7 py-3.5 rounded-pill hover:bg-wine transition-colors">
            Browse the shop
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-container mx-auto px-5 md:px-10 py-14">
        <p className="text-xs tracking-widest2 text-wine uppercase mb-2">Your Selection</p>
        <h1 className="font-display text-4xl text-plum mb-10">Shopping Bag</h1>

        <div className="grid md:grid-cols-[1fr_360px] gap-12">
          <ul className="flex flex-col divide-y divide-hairline">
            {items.map((item) => (
              <li key={`${item.id}-${item.color}`} className="py-6 flex gap-5">
                <img src={item.image} alt={item.name} className="w-28 h-32 object-cover rounded-soft bg-paper-dim shrink-0" />
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-lg text-plum">{item.name}</h3>
                      <p className="text-xs text-stone mt-1">{item.color}</p>
                    </div>
                    <button onClick={() => removeItem(item.id, item.color)} aria-label="Remove item" className="text-stone hover:text-wine">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center gap-4 border border-hairline rounded-pill px-3 py-2">
                      <button onClick={() => updateQuantity(item.id, item.color, item.quantity - 1)} aria-label="Decrease quantity">
                        <Minus size={14} className="text-plum" />
                      </button>
                      <span className="text-sm text-plum w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.color, item.quantity + 1)} aria-label="Increase quantity">
                        <Plus size={14} className="text-plum" />
                      </button>
                    </div>
                    <span className="text-base text-wine font-display">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit border border-hairline rounded-soft p-6">
            <h2 className="font-display text-xl text-plum mb-5">Order Summary</h2>
            <div className="flex items-center justify-between text-sm text-stone mb-2">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-stone mb-4">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="h-px bg-hairline mb-4" />
            <div className="flex items-center justify-between mb-6">
              <span className="text-plum">Total</span>
              <span className="text-xl text-wine font-display">{formatPrice(subtotal)}</span>
            </div>
            <Link
              to="/checkout"
              className="w-full block text-center bg-plum text-paper text-sm tracking-wide py-4 rounded-pill hover:bg-wine transition-colors duration-300 mb-3"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/checkout"
              state={{ preferredPayment: "whatsapp" }}
              className="w-full block text-center border border-hairline text-plum text-sm tracking-wide py-4 rounded-pill hover:border-[#25D366] hover:text-[#128C4A] transition-colors duration-300"
            >
              Order via WhatsApp instead
            </Link>
          </aside>
        </div>
      </div>
    </PageTransition>
  );
}
