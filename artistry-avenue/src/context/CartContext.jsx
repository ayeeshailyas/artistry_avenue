import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

function keyFor(user) {
  return user ? `aa_cart_${user.id}` : "aa_cart_guest";
}

function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(() => load(keyFor(null)));
  const [isOpen, setIsOpen] = useState(false);

  // reload cart when the active user changes (login/logout)
  useEffect(() => {
    setItems(load(keyFor(user)));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(keyFor(user), JSON.stringify(items));
  }, [items, user]);

  function addItem(product, { color, quantity = 1 } = {}) {
    const variantColor = color || product.colors?.[0];
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.id === product.id && i.color === variantColor
      );
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          color: variantColor,
          quantity,
        },
      ];
    });
    setIsOpen(true);
  }

  function removeItem(id, color) {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.color === color)));
  }

  function updateQuantity(id, color, quantity) {
    if (quantity < 1) return removeItem(id, color);
    setItems((prev) =>
      prev.map((i) => (i.id === id && i.color === color ? { ...i, quantity } : i))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        count,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
