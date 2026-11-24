import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../api/products';
import { useToast } from '../context/ToastContext';

const PAGE_SIZE = 10;

const EMPTY_FORM = {
  title: '',
  description: '',
  price: '',
  rating: '',
  category: '',
  stock_quantity: '',
  images: ['', '', ''],
};

function ProductForm({ initial, onSubmit, onClose, saving }) {
  const [form, setForm] = useState(initial);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setImage = (index, value) =>
    setForm((f) => ({ ...f, images: f.images.map((img, i) => (i === index ? value : img)) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const images = form.images.map((u) => u.trim()).filter(Boolean);
    if (images.length < 3) return;
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      ...(form.rating !== '' ? { rating: Number(form.rating) } : {}),
      ...(form.category.trim() ? { category: form.category.trim() } : {}),
      ...(form.stock_quantity !== '' ? { stock_quantity: Number(form.stock_quantity) } : {}),
      images,
    });
  };

  const inputCls =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent';

  return (
    <div className="fixed inset-0 bg-black/50 z-[300] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            {initial.id ? 'Edit product' : 'New product'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full" aria-label="Close">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input required value={form.title} onChange={(e) => setField('title', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(e) => setField('price', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0–5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(e) => setField('rating', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input value={form.category} onChange={(e) => setField('category', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock quantity</label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.stock_quantity}
                onChange={(e) => setField('stock_quantity', e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (min. 3) *</label>
            {form.images.map((url, i) => (
              <input
                key={i}
                type="url"
                value={url}
                onChange={(e) => setImage(i, e.target.value)}
                placeholder={`https://… (image ${i + 1})`}
                className={`${inputCls} mb-2`}
              />
            ))}
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, images: [...f.images, ''] }))}
              className="text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              + Add another image
            </button>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={saving || form.images.filter((u) => u.trim()).length < 3}
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-medium py-2.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? 'Saving…' : initial.id ? 'Save changes' : 'Create product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 border border-gray-300 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Admin() {
  const { addToast } = useToast();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total_items: 0, total_pages: 1, current_page: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | product
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchProducts({ page, limit: PAGE_SIZE, sort_by: 'title', order: 'asc' })
      .then((data) => {
        setItems(data.items);
        setMeta(data.meta);
      })
      .catch((err) => addToast(err.message || 'Failed to load products', 'error'))
      .finally(() => setLoading(false));
  }, [page, addToast]);

  useEffect(load, [load]);

  const openEdit = (product) =>
    setEditing({
      ...product,
      title: product.name,
      price: String(product.price),
      rating: product.rating != null ? String(product.rating) : '',
      category: product.category || '',
      stock_quantity: product.stockQuantity != null ? String(product.stockQuantity) : '',
      images: [...product.images, '', '', ''].slice(0, Math.max(3, product.images.length)),
    });

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editing.id) {
        await updateProduct(editing.id, payload);
        addToast('Product updated', 'success');
      } else {
        await createProduct(payload);
        addToast('Product created', 'success');
      }
      setEditing(null);
      load();
    } catch (err) {
      addToast(err.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeletingId(product.id);
    try {
      await deleteProduct(product.id);
      addToast('Product deleted', 'success');
      if (items.length === 1 && page > 1) setPage((p) => p - 1);
      else load();
    } catch (err) {
      addToast(err.message || 'Delete failed', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin — Products</h1>
          <p className="text-sm text-gray-500 mt-1">{meta.total_items} products total</p>
        </div>
        <button
          onClick={() => setEditing(EMPTY_FORM)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Add product
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-sm">No products yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Category</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Price</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Stock</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.image && (
                        <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      )}
                      <span className="font-medium text-gray-900 line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{p.category || '—'}</td>
                  <td className="px-4 py-3 text-right text-gray-900 font-medium">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-gray-600 hidden sm:table-cell">
                    {p.stockQuantity ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 hover:bg-orange-50 rounded-full transition-colors"
                        aria-label="Edit"
                        title="Edit"
                      >
                        <Pencil size={16} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        disabled={deletingId === p.id}
                        className="p-2 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                        aria-label="Delete"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2 border border-gray-300 rounded-full disabled:opacity-40 hover:bg-gray-50"
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-gray-600">
            Page {meta.current_page} of {meta.total_pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))}
            disabled={page >= meta.total_pages}
            className="p-2 border border-gray-300 rounded-full disabled:opacity-40 hover:bg-gray-50"
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {editing && (
        <ProductForm
          initial={editing}
          onSubmit={handleSubmit}
          onClose={() => setEditing(null)}
          saving={saving}
        />
      )}
    </div>
  );
}
