import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";

const FREE_SHIPPING_THRESHOLD = 5000;

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal } = useCart();
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 bg-plum/40 z-[70]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-paper z-[80] flex flex-col shadow-lift"
          >
            <div className="flex items-center justify-between px-6 h-20 border-b border-hairline shrink-0">
              <h2 className="font-display text-xl text-plum">
                Shopping Bag <span className="text-stone text-base">({items.length})</span>
              </h2>
              <button onClick={closeCart} aria-label="Close cart">
                <X size={20} className="text-plum" />
              </button>
            </div>

            {items.length > 0 && (
              <div className="px-6 py-4 border-b border-hairline shrink-0">
                <p className="text-xs text-stone mb-2">
                  {remaining > 0 ? (
                    <>You're <span className="text-wine">{formatPrice(remaining)}</span> away from free shipping</>
                  ) : (
                    <>You've unlocked free shipping ✦</>
                  )}
                </p>
                <div className="h-1 bg-hairline rounded-pill overflow-hidden">
                  <div
                    className="h-full bg-gold transition-all duration-500 ease-silk"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto thin-scroll px-6 py-2">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-16">
                  <div className="w-16 h-16 seal-ring flex items-center justify-center">
                    <span className="text-2xl">✦</span>
                  </div>
                  <p className="text-stone text-sm max-w-[220px]">
                    Your bag is empty. Let's find something worth writing home about.
                  </p>
                  <Link
                    to="/shop"
                    onClick={closeCart}
                    className="text-sm text-wine link-grow"
                  >
                    Browse the shop
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col divide-y divide-hairline">
                  {items.map((item) => (
                    <li key={`${item.id}-${item.color}`} className="py-5 flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-24 object-cover rounded-soft bg-paper-dim shrink-0"
                      />
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm text-plum leading-snug">{item.name}</h4>
                          <button
                            onClick={() => removeItem(item.id, item.color)}
                            aria-label="Remove item"
                            className="text-stone hover:text-wine shrink-0"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <p className="text-xs text-stone mt-0.5">{item.color}</p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center gap-3 border border-hairline rounded-pill px-2 py-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.color, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="text-plum hover:text-wine"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="text-xs text-plum w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.color, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="text-plum hover:text-wine"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <span className="text-sm text-wine">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-hairline shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-plum">Subtotal</span>
                  <span className="text-base text-wine font-display">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-stone mb-4">Taxes and shipping calculated at checkout.</p>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="w-full block text-center bg-plum text-paper text-sm tracking-wide py-3.5 rounded-pill hover:bg-wine transition-colors duration-300"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  to="/checkout"
                  state={{ preferredPayment: "whatsapp" }}
                  onClick={closeCart}
                  className="w-full mt-2.5 flex items-center justify-center gap-2 border border-hairline text-plum text-sm tracking-wide py-3.5 rounded-pill hover:border-[#25D366] hover:text-[#128C4A] transition-colors duration-300"
                >
                  Order via WhatsApp
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
