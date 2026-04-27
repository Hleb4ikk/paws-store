import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, PawPrint, Menu, Search, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-101">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <PawPrint className="text-white" size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-semibold text-gray-900 hidden sm:block">PawsStore</span>
            </Link>

            {/* Nav — Desktop */}
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
              <button 
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors" 
                aria-label="Menu"
              >
                <Menu size={20} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[150] lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[200] lg:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <PawPrint className="text-white" size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-semibold text-gray-900">PawsStore</span>
          </div>
          <button 
            onClick={closeMobileMenu}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X size={24} className="text-gray-700" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col p-6">
          <NavLink 
            to="/" 
            onClick={closeMobileMenu}
            className="py-4 px-4 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors text-base font-medium border-b border-gray-100"
          >
            Shop All
          </NavLink>
          <a 
            href="#" 
            onClick={closeMobileMenu}
            className="py-4 px-4 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors text-base font-medium border-b border-gray-100"
          >
            New Arrivals
          </a>
          <a 
            href="#" 
            onClick={closeMobileMenu}
            className="py-4 px-4 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors text-base font-medium border-b border-gray-100"
          >
            Best Sellers
          </a>
          <a 
            href="#" 
            onClick={closeMobileMenu}
            className="py-4 px-4 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors text-base font-medium"
          >
            Sale
          </a>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            © 2026 PawsStore. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
