import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../lib/format";

export default function ProductCard({ product }) {
  const { has, toggle } = useWishlist();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const wished = has(product.id);

  async function handleWishlist(e) {
    e.preventDefault();
    const result = await toggle(product.id);
    if (result?.requiresAuth) {
      showToast("Sign in to save items to your wishlist");
      navigate("/login", { state: { from: { pathname: window.location.pathname } } });
      return;
    }
    showToast(wished ? "Removed from wishlist" : "Saved to wishlist");
  }

  function handleQuickAdd(e) {
    e.preventDefault();
    addItem(product);
    showToast(`${product.name} added to bag`);
  }

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-soft bg-paper-dim aspect-[4/5]">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-silk group-hover:scale-[1.06]"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-paper/90 backdrop-blur-sm text-wine text-[10px] tracking-widest2 uppercase px-3 py-1.5 rounded-pill">
            {product.badge}
          </span>
        )}
        <button
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-paper/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Heart size={15} className={wished ? "fill-wine text-wine" : "text-plum"} />
        </button>
        <button
          onClick={handleQuickAdd}
          className="absolute left-3 right-3 bottom-3 bg-plum/90 backdrop-blur-sm text-paper text-xs tracking-wide py-2.5 rounded-pill opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-silk"
        >
          Quick Add
        </button>
      </div>
      <div className="mt-3.5 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm text-plum font-body">{product.name}</h3>
          <p className="text-xs text-stone mt-0.5">{product.colors?.[0]}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-sm text-wine">{formatPrice(product.price)}</span>
          {product.compareAt && (
            <div className="text-xs text-stone line-through">{formatPrice(product.compareAt)}</div>
          )}
        </div>
      </div>
    </Link>
  );
}
