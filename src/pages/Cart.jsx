import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Minus, Plus, Tag, Truck, MapPin, ChevronRight, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { products } from '../data/products';
import { useState, useEffect } from 'react';

// Компонент для шагов прогресса
const ProgressStep = ({ number, label, isActive }) => (
  <div className="flex items-center gap-1.5 sm:gap-2">
    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 ${
      isActive 
        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' 
        : 'bg-gray-200 text-gray-500'
    }`}>
      {number}
    </div>
    <span className={`text-xs sm:text-sm whitespace-nowrap ${
      isActive ? 'font-semibold text-gray-900' : 'font-medium text-gray-400'
    }`}>
      {label}
    </span>
  </div>
);

// Компонент для карточки товара в корзине
const CartItem = ({ item, updateQty, removeFromCart }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
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
              onClick={() => removeFromCart(item.id, item.name)}
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
);

// Компонент для информационной карточки
const InfoCard = ({ icon: Icon, iconBg, textBg, title, subtitle }) => (
  <div className={`flex items-center gap-2 sm:gap-3 ${textBg} rounded-xl p-3 sm:p-4`}>
    <div className={`w-8 h-8 sm:w-10 sm:h-10 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
      <Icon size={16} className="sm:w-5 sm:h-5 text-white" />
    </div>
    <div>
      <p className={`text-xs sm:text-sm font-bold ${iconBg.replace('bg-', 'text-').replace('-500', '-900')}`}>
        {title}
      </p>
      <p className={`text-[10px] sm:text-xs ${iconBg.replace('bg-', 'text-').replace('-500', '-700')}`}>
        {subtitle}
      </p>
    </div>
  </div>
);

// Компонент для строки расчета
const PriceRow = ({ label, value, isDiscount = false, isTotal = false }) => (
  <div className={`flex justify-between ${isTotal ? 'items-center' : 'text-xs sm:text-sm'}`}>
    <span className={
      isTotal 
        ? 'font-bold text-gray-900 text-base sm:text-lg'
        : isDiscount 
        ? 'text-green-600 font-medium' 
        : 'text-gray-600'
    }>
      {label}
    </span>
    <span className={
      isTotal 
        ? 'text-xl sm:text-2xl font-bold text-orange-500'
        : isDiscount 
        ? 'font-semibold text-green-600' 
        : 'font-semibold text-gray-900'
    }>
      {value}
    </span>
  </div>
);

export default function Cart() {
  const { cart, removeFromCart, updateQty } = useCart();
  const { addToast } = useToast();

  const items = cart
    .map(i => { const p = products.find(p => p.id === i.id); return p ? { ...p, qty: i.qty } : null; })
    .filter(Boolean);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Загружаем примененный промокод из localStorage при монтировании
  useEffect(() => {
    try {
      const savedPromo = localStorage.getItem('appliedPromo');
      if (savedPromo) {
        setAppliedPromo(JSON.parse(savedPromo));
      }
    } catch (error) {
      console.error('Error loading promo from localStorage:', error);
    }
  }, []);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  
  // Применяем скидку если есть промокод
  const discount = appliedPromo ? subtotal * (appliedPromo.discount / 100) : 0;
  const subtotalAfterDiscount = subtotal - discount;
  
  const tax = subtotalAfterDiscount * 0.08; // 8% tax
  const total = subtotalAfterDiscount + tax;
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const freeShippingThreshold = 50;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    
    if (!code) {
      addToast('Please enter a promo code', 'error');
      return;
    }

    // Проверяем, не применен ли уже промокод
    if (appliedPromo) {
      addToast(`Promo code "${appliedPromo.code}" is already applied!`, 'error');
      return;
    }

    // Проверяем валидность промокода
    if (code === 'SAVE10') {
      const promoData = {
        code: 'SAVE10',
        discount: 10,
        appliedAt: new Date().toISOString()
      };
      
      setAppliedPromo(promoData);
      localStorage.setItem('appliedPromo', JSON.stringify(promoData));
      addToast('Promo code SAVE10 applied! You saved 10%', 'promo');
      setPromoCode('');
    } else {
      addToast('Invalid promo code', 'error');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    localStorage.removeItem('appliedPromo');
    addToast('Promo code removed', 'remove');
  };

  // Данные для шагов прогресса
  const progressSteps = [
    { number: 1, label: 'Cart', isActive: true },
    { number: 2, label: 'Checkout', isActive: false },
    { number: 3, label: 'Complete', isActive: false }
  ];

  // Данные для информационных карточек
  const infoCards = [
    {
      icon: Truck,
      iconBg: 'bg-blue-500',
      textBg: 'bg-blue-50',
      title: 'Delivery Time',
      subtitle: '3-5 business days'
    },
    {
      icon: MapPin,
      iconBg: 'bg-purple-500',
      textBg: 'bg-purple-50',
      title: 'Shipping To',
      subtitle: '123 Main Street, NY 10001'
    }
  ];

  // Данные для расчетов
  const priceBreakdown = [
    { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
    ...(appliedPromo ? [{ 
      label: `Discount (${appliedPromo.discount}%)`, 
      value: `-$${discount.toFixed(2)}`,
      isDiscount: true 
    }] : []),
    { label: 'Tax (8%)', value: `$${tax.toFixed(2)}` }
  ];

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
    <div className="flex flex-col grow bg-white">
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
              {progressSteps.map((step, index) => (
                <div key={step.number} className="flex items-center gap-1.5 sm:gap-2">
                  <ProgressStep {...step} />
                  {index < progressSteps.length - 1 && (
                    <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Free shipping banner */}
        <div className="bg-orange-50 max-w-7xl bg-gradient-to-r from-orange-50 to-pink-50 mx-auto px-4 sm:px-6 lg:px-8 py-4 rounded-xl border border-orange-100">
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
      <div className='grow bg-gradient-to-br from-orange-50 via-white to-pink-50 px-4 sm:px-6 lg:px-8 pb-8 pt-8'>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Items List */}
            <div className="lg:col-span-3 space-y-4 sm:space-y-6">
              {items.map(item => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  updateQty={updateQty} 
                  removeFromCart={removeFromCart} 
                />
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
                    
                    {appliedPromo ? (
                      // Показываем примененный промокод
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <Check size={16} className="text-white" />
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-bold text-green-900">
                                {appliedPromo.code}
                              </p>
                              <p className="text-[10px] sm:text-xs text-green-700">
                                {appliedPromo.discount}% discount applied
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={handleRemovePromo}
                            className="text-green-700 hover:text-red-600 transition-colors text-xs sm:text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Показываем поле ввода
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter code (e.g., SAVE10)"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
                          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-xs sm:text-sm uppercase"
                        />
                        <button 
                          onClick={handleApplyPromo}
                          className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-bold text-xs sm:text-sm whitespace-nowrap"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 sm:space-y-3 pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-gray-200">
                    {priceBreakdown.map((row, index) => (
                      <PriceRow key={index} {...row} />
                    ))}
                  </div>
                  
                  {/* Total */}
                  <div className="mb-4 sm:mb-6">
                    <PriceRow 
                      label="Total" 
                      value={`$${total.toFixed(2)}`} 
                      isTotal 
                    />
                  </div>

                  {/* Delivery Info Cards */}
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {infoCards.map((card, index) => (
                      <InfoCard key={index} {...card} />
                    ))}
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
