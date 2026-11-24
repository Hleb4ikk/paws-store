import { api } from './client';

export const fetchCart = () => api('/cart', { auth: true });

export const addCartItem = (productId, quantity = 1) =>
  api('/cart/items', { method: 'POST', auth: true, body: { productId, quantity } });

export const updateCartItem = (itemId, quantity) =>
  api(`/cart/items/${itemId}`, { method: 'PATCH', auth: true, body: { quantity } });

export const deleteCartItem = (itemId) =>
  api(`/cart/items/${itemId}`, { method: 'DELETE', auth: true });

export const applyPromo = (code) =>
  api('/cart/apply-promo', { method: 'POST', auth: true, body: { code } });
