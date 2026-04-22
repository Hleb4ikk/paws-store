import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
  });

  const save = (updated) => {
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const addToCart = (id, qty = 1) => {
    const existing = cart.find(i => i.id === id);
    if (existing) {
      save(cart.map(i => i.id === id ? { ...i, qty: i.qty + qty } : i));
    } else {
      save([...cart, { id, qty }]);
    }
  };

  const removeFromCart = (id) => save(cart.filter(i => i.id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    save(cart.map(i => i.id === id ? { ...i, qty } : i));
  };

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.qty * (i.price || 0), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
