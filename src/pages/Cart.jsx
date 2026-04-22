import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, Tag, Truck, Shield, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

export default function Cart() {
  const { cart, removeFromCart, updateQty } = useCart();

  const items = cart
    .map(i => { const p = products.find(p => p.id === i.id); return p ? { ...p, qty: i.qty } : null; })
    .filter(Boolean);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 0 && subtotal < 50 ? 4.99 : 0;
  const total = subtotal + shipping;
  const totalQty = items.reduce((s, i) => s + i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ShoppingBag size={48} className="text-orange-400" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Discover amazing products for your furry friends!</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
            >
              Start Shopping <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Your Cart
            </h1>
            <p className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span>{totalQty} item{totalQty !== 1 ? 's' : ''}</span>
            </p>
          </div>
          <Link to="/" className="text-sm text-orange-500 hover:underline font-medium">← Continue Shopping</Link>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {['Cart', 'Checkout', 'Confirmation'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                i === 0 ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-500'
              }`}>{i + 1}</div>
              <span className={`text-sm font-medium ${i === 0 ? 'text-gray-900' : 'text-gray-400'}`}>{step}</span>
              {i < 2 && <ChevronRight size={14} className="text-gray-300" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
                <div className="p-4 sm:p-6 flex items-center gap-4">
                  <Link to={`/product/${item.id}`} className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </Link>
                  <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div className="sm:col-span-2">
                      <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide mb-1">{item.category}</p>
                      <Link to={`/product/${item.id}`} className="font-semibold text-gray-900 hover:text-orange-500 line-clamp-2 text-sm sm:text-base">
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-full px-2 py-1 border border-gray-200">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-7 h-7 rounded-full hover:bg-orange-100 transition-colors flex items-center justify-center text-gray-600"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center font-semibold text-sm">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-7 h-7 rounded-full hover:bg-orange-100 transition-colors flex items-center justify-center text-gray-600"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="font-bold text-gray-900 text-sm sm:text-base min-w-[60px] text-right">
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-9 h-9 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center"
                        aria-label="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white">
                <h2 className="text-lg font-bold">Order Summary</h2>
                <p className="text-orange-100 text-sm mt-1">{totalQty} item{totalQty !== 1 ? 's' : ''}</p>
              </div>
              <div className="p-6">
                {/* Promo */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                    <Tag size={14} className="text-orange-500" /> Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                    <button className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Free shipping notice */}
                {subtotal < 50 && (
                  <div className="flex items-center justify-between bg-green-50 border-2 border-green-200 rounded-xl p-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Truck size={14} className="text-white" />
                      </div>
                      <span className="text-sm text-green-700 font-medium">
                        Add ${(50 - subtotal).toFixed(2)} for free shipping!
                      </span>
                    </div>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-3 py-4 border-t-2 border-dashed border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-gray-900">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-2xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Trust badges */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <Truck size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-blue-900">Free shipping over $50</p>
                      <p className="text-xs text-blue-600">Delivered in 3-5 business days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <Shield size={18} className="text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-purple-900">30-day return policy</p>
                      <p className="text-xs text-purple-600">No questions asked</p>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold text-lg flex items-center justify-center gap-2 mt-4">
                  Checkout <ArrowRight size={18} />
                </button>
                <Link to="/" className="block text-center text-sm text-gray-600 hover:text-orange-500 transition-colors font-medium mt-3">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
