import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, ShoppingCart, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchProducts, fetchCategories } from '../api/products';
import Stars from '../components/Stars';
import { Select, SelectTrigger, SelectContent, SelectItem } from '../components/Select';
import FilterPanel from '../components/FilterPanel';

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'price-asc', label: 'Price (Low to High)' },
  { value: 'price-desc', label: 'Price (High to Low)' },
];

const SORT_MAP = {
  'name-asc': { sort_by: 'title', order: 'asc' },
  'name-desc': { sort_by: 'title', order: 'desc' },
  'price-asc': { sort_by: 'price', order: 'asc' },
  'price-desc': { sort_by: 'price', order: 'desc' },
};

const PAGE_SIZE = 9;

export default function Shop() {
  const { addToCart } = useCart();
  const [sort, setSort] = useState('name-asc');
  const [category, setCategory] = useState('All');
  const [ratings, setRatings] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [added, setAdded] = useState(null);

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total_items: 0, total_pages: 1, current_page: 1, limit: PAGE_SIZE });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debounceRef = useRef(null);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [sort, category, ratings, priceRange, search]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: PAGE_SIZE,
        ...SORT_MAP[sort],
      };
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (ratings.length > 0) params.min_rating = Math.min(...ratings);
      if (priceRange[0] > 0) params.min_price = priceRange[0];
      if (priceRange[1] > 0) params.max_price = priceRange[1];

      fetchProducts(params)
        .then((data) => {
          setItems(data.items);
          setMeta(data.meta);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [sort, category, ratings, priceRange, search, page]);

  const handleAdd = (e, product) => {
    e.preventDefault();
    addToCart(product.id, 1, product.name);
    setAdded(product.id);
    setTimeout(() => setAdded(null), 1200);
  };

  const filterProps = { category, setCategory, ratings, setRatings, priceRange, setPriceRange, categories };

  const pageNumbers = Array.from({ length: meta.total_pages }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Shop All Products</h1>
          <p className="text-lg text-orange-50">Discover the best products for your furry friends</p>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Filters</h2>
              <FilterPanel {...filterProps} />
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                </button>
                <p className="text-sm text-gray-600">{meta.total_items} products</p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="sort" className="text-sm text-gray-700">Sort by:</label>
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-full sm:w-48">
                    {SORT_OPTIONS.find(o => o.value === sort)?.label}
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map(o => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mobile filters */}
            {showFilters && (
              <div className="lg:hidden bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterPanel {...filterProps} />
              </div>
            )}

            {/* States */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-500">Failed to load products: {error}</p>
              </div>
            )}

            {loading && !error && (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading products...</p>
              </div>
            )}

            {/* Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(p => (
                  <Link
                    to={`/product/${p.id}`}
                    key={p.id}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-orange-300"
                  >
                    {/* Image — aspect-[4/5] */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* Hover card — выезжает снизу */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">{p.name}</h3>
                          <div className="flex items-center gap-1 mb-3">
                            <Stars rating={p.rating} size={14} />
                            <span className="text-xs text-gray-600 ml-1">({p.reviewCount})</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-orange-500">${p.price.toFixed(2)}</p>
                            <button
                              onClick={e => handleAdd(e, p)}
                              className="bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-full shadow-md transition-all duration-200 hover:scale-110"
                              aria-label="Add to cart"
                            >
                              {added === p.id
                                ? <span className="text-xs font-bold w-5 h-5 flex items-center justify-center">✓</span>
                                : <ShoppingCart className="w-5 h-5" />
                              }
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* Price badge */}
                      <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1.5 rounded-full shadow-lg group-hover:opacity-0 transition-opacity duration-300">
                        <span className="text-sm font-bold">${p.price.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Card footer — тускнеет при hover */}
                    <div className="p-4 group-hover:opacity-50 transition-opacity duration-300">
                      <h3 className="text-sm font-medium text-gray-900 mb-1.5 line-clamp-2 min-h-[2.5rem]">{p.name}</h3>
                      <div className="flex items-center gap-1">
                        <Stars rating={p.rating} size={14} />
                        <span className="text-xs text-gray-500 ml-1">({p.reviewCount})</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!loading && !error && items.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No products match your filters.</p>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && meta.total_pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={meta.current_page <= 1}
                  className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                {pageNumbers.map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      n === meta.current_page
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(meta.total_pages, p + 1))}
                  disabled={meta.current_page >= meta.total_pages}
                  className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
