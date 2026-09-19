import { Link, Navigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import PageTransition from "../components/PageTransition";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../lib/format";

export default function Wishlist() {
  const { isAuthenticated, ready } = useAuth();
  const { products, remove, loaded } = useWishlist();
  const { addItem } = useCart();
  const { showToast } = useToast();

  if (ready && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: { pathname: "/wishlist" } }} replace />;
  }

  async function moveToCart(product) {
    addItem(product);
    await remove(product.id);
    showToast(`${product.name} moved to bag`);
  }

  async function moveAll() {
    for (const p of products) {
      addItem(p);
      await remove(p.id);
    }
    showToast("All items moved to bag");
  }

  return (
    <PageTransition>
      <div className="max-w-container mx-auto px-5 md:px-10 py-14 min-h-[60vh]">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-widest2 text-wine uppercase mb-2">Saved</p>
            <h1 className="font-display text-4xl text-plum">My Wishlist</h1>
            <p className="text-stone text-sm mt-2">{products.length} item{products.length !== 1 && "s"}</p>
          </div>
          {products.length > 0 && (
            <button
              onClick={moveAll}
              className="text-sm text-paper bg-plum px-6 py-3 rounded-pill hover:bg-wine transition-colors"
            >
              Move all to bag
            </button>
          )}
        </div>

        {!loaded ? (
          <p className="text-stone text-sm">Loading…</p>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 gap-4">
            <div className="w-20 h-20 seal-ring rounded-full flex items-center justify-center">
              <span className="text-3xl">✦</span>
            </div>
            <p className="text-stone max-w-xs">
              Nothing saved yet. Tap the heart on anything that catches your eye.
            </p>
            <Link to="/shop" className="text-sm text-wine link-grow">Browse the shop</Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-5 border border-hairline rounded-soft p-4"
              >
                <Link to={`/product/${p.id}`} className="shrink-0">
                  <img src={p.images[0]} alt={p.name} className="w-24 h-28 object-cover rounded-soft bg-paper-dim" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${p.id}`}>
                    <h3 className="font-display text-lg text-plum truncate">{p.name}</h3>
                  </Link>
                  <p className="text-xs text-stone mt-1">{p.colors?.[0]}</p>
                  <p className="text-sm text-wine mt-2">{formatPrice(p.price)}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => remove(p.id)}
                    aria-label="Remove from wishlist"
                    className="text-stone hover:text-wine"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => moveToCart(p)}
                    className="text-xs border border-plum text-plum px-4 py-2 rounded-pill hover:bg-plum hover:text-paper transition-colors whitespace-nowrap"
                  >
                    Move to bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
