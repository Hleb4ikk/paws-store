import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Minus, Plus, ShoppingCart, ArrowLeft, ArrowRight, Check, Tag, ChevronLeft } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import Stars from '../components/Stars';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === Number(id));
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500 text-lg mb-4">Product not found</p>
        <Link to="/" className="text-orange-500 hover:underline">← Back to shop</Link>
      </div>
    </div>
  );

  const handleAdd = () => {
    addToCart(product.id, qty, product.name);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const idx = products.findIndex(p => p.id === product.id);
  const prev = products[idx - 1];
  const next = products[idx + 1];

  const images = product.images || [];
  const hasMultipleImages = images.length > 1;

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="hover:text-orange-500 cursor-pointer transition-colors">{product.category}</span>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Gallery */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 overflow-hidden relative">
              {images.length > 0 ? (
                <>
                  {/* Main Image */}
                  <div className="relative overflow-hidden rounded-lg">
                    <div className="relative w-full aspect-square">
                      {images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`${product.name} - Image ${index + 1}`}
                          className={`absolute inset-0 w-full h-full object-cover rounded-lg transition-all duration-500 ease-in-out ${
                            index === currentImageIndex
                              ? 'opacity-100 translate-x-0'
                              : index < currentImageIndex
                              ? 'opacity-0 -translate-x-full'
                              : 'opacity-0 translate-x-full'
                          }`}
                        />
                      ))}
                    </div>
                    
                    {/* Navigation Arrows */}
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={goToPrevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10 hover:scale-110"
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={24} className="text-gray-800" />
                        </button>
                        <button
                          onClick={goToNextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10 hover:scale-110"
                          aria-label="Next image"
                        >
                          <ChevronRight size={24} className="text-gray-800" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Dots Indicator */}
                  {hasMultipleImages && (
                    <div className="flex justify-center gap-2 mt-4">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentImageIndex
                              ? 'bg-orange-500 w-6'
                              : 'bg-gray-300 hover:bg-gray-400 w-2'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">No images available</p>
                </div>
              )}
            </div>
            {/* Prev/Next nav */}
            <div className="flex items-center justify-between mt-4">
              {prev ? (
                <button
                  onClick={() => navigate(`/product/${prev.id}`)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors"
                >
                  <ArrowLeft size={14} /> Previous
                </button>
              ) : <span />}
              {next ? (
                <button
                  onClick={() => navigate(`/product/${next.id}`)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors"
                >
                  Next <ArrowRight size={14} />
                </button>
              ) : <span />}
            </div>
          </div>

          {/* Info */}
          <div>
            {/* Category badge */}
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full mb-3">
              {product.category}
            </span>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <Stars rating={product.rating} size={18} />
              <span className="text-sm text-gray-500">{product.rating} out of 5 stars</span>
              <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold text-orange-500 mb-6">${product.price.toFixed(2)}</div>

            {/* Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-100 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag size={16} className="text-orange-500" />
                  Key Highlights
                </h3>
                <ul className="space-y-2">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAdd}
              className={`w-full py-4 rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold text-white ${
                added
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {added ? (
                <><Check size={18} /> Added to Cart!</>
              ) : (
                <><ShoppingCart size={18} /> Add to Cart</>
              )}
            </button>

            {/* Technical Specifications */}
            {product.specs && product.specs.length > 0 && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <span className="text-white text-xl">📦</span>
                  </div>
                  Technical Specifications
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.specs.map((spec, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-orange-50 p-2 rounded-lg group-hover:bg-orange-100 transition-colors flex-shrink-0">
                          <span className="text-xl">{spec.icon}</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{spec.label}</p>
                          <p className="font-semibold text-gray-900 text-sm">{spec.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.filter(p => p.id !== product.id).slice(0, 4).map(p => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-base font-medium text-gray-900 mb-2 line-clamp-2 text-sm">{p.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-orange-500">${p.price.toFixed(2)}</span>
                    <Stars rating={p.rating} size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
