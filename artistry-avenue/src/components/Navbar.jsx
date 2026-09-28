import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { formatPrice } from "../lib/format";

const navLinks = [
  { to: "/shop", label: "All" },
  { to: "/shop/journals", label: "Journals" },
  { to: "/shop/writing", label: "Writing" },
  { to: "/shop/cards", label: "Cards" },
  { to: "/shop/desk", label: "Desk Edit" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { count, openCart } = useCart();
  const { count: wishCount } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [navigate]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const { products } = await api.getProducts({ search: query.trim() });
        setResults(products.slice(0, 5));
      } catch {
        setResults([]);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ease-silk ${
        scrolled
          ? "bg-paper/80 backdrop-blur-md border-b border-hairline"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-container mx-auto px-5 md:px-10 h-20 flex items-center justify-between">
        <button
          className="md:hidden text-plum"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src="/logo.png" alt="Artistry Avenue" className="w-11 h-11 rounded-full object-cover" />
          <span className="hidden sm:flex flex-col leading-none">
            <span className="font-display text-lg text-plum tracking-wide">Artistry Avenue</span>
            <span className="text-[10px] tracking-widest2 text-stone uppercase">Sparkle Stationery</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm tracking-wide link-grow ${
                  isActive ? "text-wine" : "text-plum/80 hover:text-wine"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-5 text-plum">
         
          <Link to="/wishlist" aria-label="Wishlist" className="relative hover:text-wine transition-colors">
            <Heart size={19} />
            {wishCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-wine text-paper text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishCount}
              </span>
            )}
          </Link>
          <button aria-label="Cart" onClick={openCart} className="relative hover:text-wine transition-colors">
            <ShoppingBag size={19} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-wine text-paper text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
          <Link
            to={isAuthenticated ? "/account" : "/login"}
            aria-label="Account"
            className="hover:text-wine transition-colors flex items-center gap-2"
          >
            {isAuthenticated ? (
              <span className="w-8 h-8 rounded-full bg-wine text-paper flex items-center justify-center text-xs font-body">
                {user.name?.[0]?.toUpperCase() || "A"}
              </span>
            ) : (
              <User size={19} />
            )}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-hairline bg-paper/95 backdrop-blur-md">
          <div className="max-w-container mx-auto px-5 md:px-10 py-4">
            <div className="flex items-center gap-3 border-b border-plum/30 pb-2">
              <Search size={16} className="text-stone" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search journals, pens, seals…"
                className="w-full bg-transparent outline-none text-plum placeholder:text-stone font-body text-sm"
              />
              <button onClick={() => setSearchOpen(false)} aria-label="Close search">
                <X size={16} className="text-stone" />
              </button>
            </div>
            {results.length > 0 && (
              <div className="mt-3 flex flex-col divide-y divide-hairline">
                {results.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    onClick={() => setSearchOpen(false)}
                    className="py-2.5 flex items-center justify-between text-sm text-plum hover:text-wine"
                  >
                    <span>{p.name}</span>
                    <span className="text-stone">{formatPrice(p.price)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-visibility ${
          mobileOpen ? "visible" : "invisible"
        }`}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-plum/40 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute left-0 top-0 h-full w-[78%] max-w-xs bg-paper shadow-lift transition-transform duration-400 ease-silk ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 h-20 border-b border-hairline">
            <span className="font-display text-lg text-plum">Menu</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={20} className="text-plum" />
            </button>
          </div>
          <nav className="flex flex-col px-6 py-6 gap-5">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className="text-plum text-base"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            <div className="h-px bg-hairline my-2" />
            <Link to={isAuthenticated ? "/account" : "/login"} className="text-plum text-base">
              {isAuthenticated ? "My Account" : "Sign In"}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
