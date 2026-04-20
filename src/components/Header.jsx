import { Link } from 'react-router-dom';
import { ShoppingCart, PawPrint } from 'lucide-react';

export default function Header() {
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

          {/* Right */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative" aria-label="Cart">
              <ShoppingCart size={20} className="text-gray-700" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
