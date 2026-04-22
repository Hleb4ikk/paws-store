import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, PawPrint, Menu, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { totalItems } = useCart();
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <PawPrint className="text-white" size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-semibold text-gray-900 hidden sm:block">PawsStore</span>
          </Link>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <NavLink to="/" className="text-gray-700 hover:text-orange-500 transition-colors text-sm font-medium">Shop All</NavLink>
            <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors text-sm font-medium">New Arrivals</a>
            <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors text-sm font-medium">Best Sellers</a>
            <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors text-sm font-medium">Sale</a>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Search">
              <Search size={20} className="text-gray-700" />
            </button>
            <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative" aria-label="Cart">
              <ShoppingCart size={20} className="text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </Link>
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Menu">
              <Menu size={20} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
