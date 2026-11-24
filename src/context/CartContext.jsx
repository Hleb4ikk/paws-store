import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import {
  fetchCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  applyPromo,
} from '../api/cart';

const CartContext = createContext();

const normalize = (data) => ({
  items: data.items.map((item) => ({
    cartItemId: item.id,
    id: item.product.id,
    name: item.product.title,
    price: Number(item.product.price),
    image: item.product.images?.[0]?.url || '',
    category: item.product.category,
    qty: item.quantity,
  })),
  subtotal: data.subtotal,
});

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setCart({ items: [], subtotal: 0 });
      return;
    }
    setLoading(true);
    fetchCart()
      .then((data) => setCart(normalize(data)))
      .catch(() => addToast('Failed to load the cart', 'error'))
      .finally(() => setLoading(false));
  }, [user]);

  const addToCart = useCallback(async (productId, qty = 1, productName) => {
    if (!user) {
      addToast('Log in to add products to the cart', 'error');
      return;
    }
    try {
      const data = await addCartItem(productId, qty);
      setCart(normalize(data));
      addToast(`${productName || 'Product'} added to cart!`, 'success');
    } catch (err) {
      addToast(err.message || 'Failed to add to cart', 'error');
    }
  }, [user, addToast]);

  const removeFromCart = useCallback(async (cartItemId, productName) => {
    try {
      const data = await deleteCartItem(cartItemId);
      setCart(normalize(data));
      addToast(`${productName || 'Product'} removed from cart`, 'remove');
    } catch (err) {
      addToast(err.message || 'Failed to remove item', 'error');
    }
  }, [addToast]);

  const updateQty = useCallback(async (cartItemId, qty, productName) => {
    if (qty < 1) return removeFromCart(cartItemId, productName);
    try {
      const data = await updateCartItem(cartItemId, qty);
      setCart(normalize(data));
    } catch (err) {
      addToast(err.message || 'Failed to update quantity', 'error');
    }
  }, [removeFromCart, addToast]);

  const clearCart = useCallback(async () => {
    try {
      for (const item of cart.items) {
        await deleteCartItem(item.cartItemId);
      }
      setCart({ items: [], subtotal: 0 });
      addToast('Cart cleared', 'remove');
    } catch (err) {
      addToast(err.message || 'Failed to clear the cart', 'error');
    }
  }, [cart.items, addToast]);

  const applyPromoCode = useCallback(async (code) => {
    return applyPromo(code);
  }, []);

  const totalItems = cart.items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart.items,
        subtotal: cart.subtotal,
        loading,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        applyPromoCode,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
