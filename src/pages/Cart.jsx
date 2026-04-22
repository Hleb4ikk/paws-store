import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Minus, Plus, Tag, Truck, MapPin, ChevronRight, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

export default function Cart() {
  const { cart, removeFromCart, updateQty } = useCart();

  const items = cart
    .map(i => { const p = products.find(p => p.id === i.id); return p ? { ...p, qty: i.qty } : null; })
    .filter(Boolean);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const freeShippingThreshold = 50;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <ShoppingBag size={40} className="sm:w-12 sm:h-12 text-orange-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">Discover amazing products for your furry friends!</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 sm:px-8 py-3 rounded-full hover:opacity-90 transition-opacity font-semibold text-sm sm:text-base"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header and Banner Section with bottom shadow */}
      <div className="shadow-md pb-8 z-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12 ">
          {/* Header with Steps */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
                <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  Shopping Bag
                </span>
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">{totalQty} item{totalQty !== 1 ? 's' : ''} ready for checkout</p>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                  1
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Cart</span>
              </div>
              <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                  2
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap">Checkout</span>
              </div>
              <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                  3
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap">Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Free shipping banner */}
        <div className="bg-orange-50 max-w-[1216px] bg-gradient-to-r from-orange-50 to-pink-50 mx-auto px-4 sm:px-6 lg:px-8 py-4 rounded-xl border border-orange-100">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-orange-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-700">
                Free shipping on orders over <span className="font-bold text-orange-600">${freeShippingThreshold}</span>
              </span>
            </div>
            {amountToFreeShipping > 0 ? (
              <span className="text-xs sm:text-sm font-bold text-orange-600 whitespace-nowrap">
                ${amountToFreeShipping.toFixed(2)} away
              </span>
            ) : (
              <span className="text-xs sm:text-sm font-bold text-green-600 flex items-center gap-1 whitespace-nowrap">
                <Check size={14} />
                Qualified!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='bg-gradient-to-br from-orange-50 via-white to-pink-50 px-4 sm:px-6 lg:px-8 pb-8 pt-8'>
            
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Items List */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {items.map(item => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
                <div className="flex gap-3 sm:gap-6">
                  {/* Product Image */}
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-100">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                  </Link>
                  
                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/product/${item.id}`} 
                            className="font-bold text-sm sm:text-base text-gray-900 hover:text-orange-500 transition-colors block mb-1 line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs sm:text-sm text-gray-500">{item.category}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} className="sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between mt-3 sm:mt-4 gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 sm:gap-3 bg-gray-100 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="text-gray-600 hover:text-orange-500 transition-colors"
                        >
                          <Minus size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                        <span className="font-bold text-gray-900 min-w-[1.5rem] text-center text-sm sm:text-base">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="text-gray-600 hover:text-orange-500 transition-colors"
                        >
                          <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </div>
                      
                      {/* Price */}
                      <div className="text-right">
                        <p className="text-lg sm:text-2xl font-bold text-orange-500">
                          ${(item.price * item.qty).toFixed(2)}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden lg:sticky lg:top-24 shadow-lg">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 px-4 sm:px-6 py-4 sm:py-6">
                <h2 className="text-lg sm:text-xl font-bold text-white">Order Summary</h2>
                <p className="text-white/90 text-xs sm:text-sm mt-1">
                  {totalQty} item{totalQty !== 1 ? 's' : ''} in your bag
                </p>
              </div>
              
              {/* Content */}
              <div className="p-4 sm:p-6">
                {/* Promo Code */}
                <div className="mb-4 sm:mb-6">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3">
                    <Tag size={14} className="sm:w-4 sm:h-4 text-orange-500" />
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-xs sm:text-sm"
                    />
                    <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-bold text-xs sm:text-sm whitespace-nowrap">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 sm:space-y-3 pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-gray-200">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Total */}
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <span className="font-bold text-gray-900 text-base sm:text-lg">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-orange-500">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Delivery Info Cards */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {/* Delivery Time */}
                  <div className="flex items-center gap-2 sm:gap-3 bg-blue-50 rounded-xl p-3 sm:p-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Truck size={16} className="sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-blue-900">Delivery Time</p>
                      <p className="text-[10px] sm:text-xs text-blue-700">3-5 business days</p>
                    </div>
                  </div>
                  
                  {/* Shipping Address */}
                  <div className="flex items-center gap-2 sm:gap-3 bg-purple-50 rounded-xl p-3 sm:p-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} className="sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-purple-900">Shipping To</p>
                      <p className="text-[10px] sm:text-xs text-purple-700">123 Main Street, NY 10001</p>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 sm:py-4 rounded-xl hover:opacity-90 transition-opacity font-bold text-sm sm:text-base flex items-center justify-center gap-2 mb-3 sm:mb-4">
                  <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
                  Proceed to Checkout
                </button>
                
                {/* Continue Shopping Link */}
                <Link 
                  to="/" 
                  className="block text-center text-xs sm:text-sm text-gray-600 hover:text-orange-500 transition-colors font-medium"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
