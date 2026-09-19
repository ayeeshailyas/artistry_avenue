import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated, ready } = useAuth();
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  async function refresh() {
    if (!isAuthenticated) {
      setProducts([]);
      setLoaded(true);
      return;
    }
    try {
      const { products } = await api.getWishlist();
      setProducts(products);
    } catch {
      setProducts([]);
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    if (!ready) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, isAuthenticated]);

  const ids = products.map((p) => p.id);

  function has(id) {
    return ids.includes(id);
  }

  async function toggle(id) {
    if (!isAuthenticated) {
      return { ok: false, requiresAuth: true };
    }
    if (has(id)) {
      await api.removeFromWishlist(id);
    } else {
      await api.addToWishlist(id);
    }
    await refresh();
    return { ok: true };
  }

  async function remove(id) {
    if (!isAuthenticated) return;
    await api.removeFromWishlist(id);
    await refresh();
  }

  return (
    <WishlistContext.Provider
      value={{ products, ids, has, toggle, remove, refresh, count: ids.length, loaded }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
