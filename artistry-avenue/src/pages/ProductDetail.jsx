import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, Minus, Plus, Star, MessageCircle } from "lucide-react";
import PageTransition from "../components/PageTransition";
import ProductCard from "../components/ProductCard";
import { api } from "../lib/api";
import { formatPrice } from "../lib/format";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { whatsAppLink } from "../components/WhatsAppButton";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("details");

  useEffect(() => {
    setProduct(null);
    setNotFound(false);
    setActiveImage(0);
    setQuantity(1);
    api
      .getProduct(id)
      .then(({ product }) => {
        setProduct(product);
        setColor(product.colors?.[0]);
      })
      .catch(() => setNotFound(true));
    api.getRelated(id).then(({ products }) => setRelated(products)).catch(() => setRelated([]));
  }, [id]);

  if (notFound) {
    navigate("/shop", { replace: true });
    return null;
  }
  if (!product) {
    return (
      <PageTransition>
        <div className="max-w-container mx-auto px-5 py-32 text-center text-stone">Loading…</div>
      </PageTransition>
    );
  }

  const wished = has(product.id);

  async function handleAddToCart() {
    addItem(product, { color, quantity });
    showToast(`${product.name} added to bag`);
  }

  async function handleWishlistToggle() {
    const result = await toggle(product.id);
    if (result?.requiresAuth) {
      showToast("Sign in to save items to your wishlist");
      navigate("/login", { state: { from: { pathname: `/product/${product.id}` } } });
      return;
    }
    showToast(wished ? "Removed from wishlist" : "Saved to wishlist");
  }

  const whatsAppHref = whatsAppLink(
    `Hello! I'd like to ask about the ${product.name} (${color}) — ${formatPrice(product.price)}.`
  );

  return (
    <PageTransition>
      <div className="max-w-container mx-auto px-5 md:px-10 py-10">
        <nav className="text-xs text-stone mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-wine">Home</Link>
          <span>/</span>
          <Link to={`/shop/${product.category}`} className="hover:text-wine capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-plum">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <div className="rounded-soft overflow-hidden bg-paper-dim aspect-[4/5] mb-4">
              <img
                key={activeImage}
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-soft overflow-hidden border ${
                      activeImage === i ? "border-wine" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.badge && (
              <span className="inline-block text-[10px] tracking-widest2 uppercase text-wine border border-wine/40 px-3 py-1 rounded-pill mb-4">
                {product.badge}
              </span>
            )}
            <h1 className="font-display text-3xl md:text-4xl text-plum mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.round(product.rating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-xs text-stone">{product.rating} ({product.reviews} reviews)</span>
              {product.stock <= 10 && (
                <span className="text-xs text-wine ml-2">Only {product.stock} left</span>
              )}
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl text-wine font-display">{formatPrice(product.price)}</span>
              {product.compareAt && (
                <span className="text-base text-stone line-through">{formatPrice(product.compareAt)}</span>
              )}
            </div>

            <p className="text-stone leading-relaxed mb-8">{product.description}</p>

            {product.colors?.length > 0 && (
              <div className="mb-7">
                <h3 className="text-xs tracking-widest2 text-plum uppercase mb-3">
                  {product.colors.length > 1 ? "Colour" : "Option"} — <span className="text-stone normal-case tracking-normal">{color}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`text-xs px-4 py-2 rounded-pill border transition-colors ${
                        color === c ? "border-wine text-wine bg-blush" : "border-hairline text-stone hover:border-plum/50"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-7">
              <div className="flex items-center gap-4 border border-hairline rounded-pill px-4 py-2.5">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  <Minus size={14} className="text-plum" />
                </button>
                <span className="text-sm text-plum w-4 text-center">{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} aria-label="Increase quantity">
                  <Plus size={14} className="text-plum" />
                </button>
              </div>
              <button
                onClick={handleWishlistToggle}
                aria-label="Toggle wishlist"
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors ${
                  wished ? "border-wine text-wine bg-blush" : "border-hairline text-plum hover:border-wine hover:text-wine"
                }`}
              >
                <Heart size={17} className={wished ? "fill-wine" : ""} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-plum text-paper text-sm tracking-wide py-4 rounded-pill hover:bg-wine transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? "Out of Stock" : `Add to Bag — ${formatPrice(product.price * quantity)}`}
              </button>
            </div>
            <a
              href={whatsAppHref}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 border border-hairline text-plum text-sm tracking-wide py-4 rounded-pill hover:border-[#25D366] hover:text-[#128C4A] transition-colors duration-300"
            >
              <MessageCircle size={16} /> Ask about this on WhatsApp
            </a>

            <div className="mt-10 border-t border-hairline pt-6">
              <div className="flex gap-8 mb-5">
                {["details", "shipping"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`text-sm pb-2 border-b capitalize ${
                      tab === t ? "text-plum border-plum" : "text-stone border-transparent"
                    }`}
                  >
                    {t === "details" ? "The Details" : "Shipping & Care"}
                  </button>
                ))}
              </div>
              {tab === "details" ? (
                <ul className="flex flex-col gap-2">
                  {product.details.map((d) => (
                    <li key={d} className="text-sm text-stone flex gap-2">
                      <span className="text-gold">✦</span> {d}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-stone leading-relaxed">
                  Dispatched within 2–3 working days, hand-wrapped in tissue and sealed with wax.
                  Store away from direct sunlight and moisture to keep colours and gilding at
                  their best. Returns accepted within 7 days on unused items.
                </p>
              )}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="font-display text-2xl text-plum mb-8">You may also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  );
}
