import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const CART_KEY = 'ecomm_cart_v1';

function readStorage() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStorage);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const id = product.id;
      const max = product.stock ?? 999;
      const idx = prev.findIndex((i) => i.productId === id);
      if (idx >= 0) {
        const next = [...prev];
        const merged = Math.min(max, next[idx].qty + qty);
        next[idx] = { ...next[idx], qty: merged };
        return next;
      }
      return [
        ...prev,
        {
          productId: id,
          qty: Math.min(max, qty),
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const setQty = useCallback((productId, qty) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.productId !== productId);
      return prev.map((i) => {
        if (i.productId !== productId) return i;
        const max = i.stock ?? 999;
        return { ...i, qty: Math.min(max, qty) };
      });
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const cartCount = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      setQty,
      clearCart,
      cartCount,
      subtotal,
    }),
    [items, addItem, removeItem, setQty, clearCart, cartCount, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
