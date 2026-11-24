import { api } from './client';

// Maps backend product shape to the shape the UI components expect
export const mapProduct = (p) => ({
  id: p.id,
  name: p.title,
  description: p.description,
  price: Number(p.price),
  rating: p.rating,
  category: p.category,
  stockQuantity: p.stock_quantity,
  image: p.images?.[0]?.url || '',
  images: (p.images || []).map((img) => img.url),
  reviewCount: p.review_count ?? 0,
});

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });
  const data = await api(`/products?${query.toString()}`);
  return {
    items: data.items.map(mapProduct),
    meta: data.meta,
  };
}

export async function fetchProduct(id) {
  const data = await api(`/products/${id}`);
  return mapProduct(data);
}

export async function fetchCategories() {
  const data = await api('/products/categories');
  return data.categories;
}
