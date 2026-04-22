import { useState } from 'react';
import { products } from '../data/products';

const MAX_PRICE = Math.max(...products.map(p => p.price));

export default function FilterPanel({ category, setCategory, ratings, setRatings, priceRange, setPriceRange }) {
  const categories = ['All', ...new Set(products.map(p => p.category))];

  const toggleRating = (r) => {
    setRatings(prev =>
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    );
  };

  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Category</h3>
        <div className="space-y-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                category === cat
                  ? 'bg-orange-50 text-orange-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Rating</h3>
        <div className="space-y-3">
          {[5, 4, 3].map(r => (
            <div key={r} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`rating-${r}`}
                checked={ratings?.includes(r) ?? false}
                onChange={() => toggleRating(r)}
                className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
              />
              <label htmlFor={`rating-${r}`} className="text-sm text-gray-700 cursor-pointer">
                {r}+ Stars
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label htmlFor="min-price" className="block text-xs text-gray-600 mb-1">Min</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  id="min-price"
                  type="number"
                  min="0"
                  max={MAX_PRICE}
                  value={priceRange?.[0] ?? 0}
                  onChange={e => setPriceRange?.([Number(e.target.value), priceRange?.[1] ?? MAX_PRICE])}
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div className="pt-6 text-gray-400">-</div>
            <div className="flex-1">
              <label htmlFor="max-price" className="block text-xs text-gray-600 mb-1">Max</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  id="max-price"
                  type="number"
                  min="0"
                  max={MAX_PRICE}
                  value={priceRange?.[1] ?? MAX_PRICE}
                  onChange={e => setPriceRange?.([priceRange?.[0] ?? 0, Number(e.target.value)])}
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
