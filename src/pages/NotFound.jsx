import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center grow px-4 py-20 text-center">
      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
        <PawPrint size={40} className="text-orange-500" strokeWidth={2} />
      </div>
      <h1 className="text-6xl font-bold text-gray-900 mb-3">404</h1>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Page not found</h2>
      <p className="text-gray-500 text-sm max-w-md mb-8">
        Looks like this page ran off with the leash. The page you're looking for
        doesn't exist or was moved.
      </p>
      <div className="flex gap-3">
        <Link
          to="/"
          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
        >
          Back to Shop
        </Link>
        <Link
          to="/cart"
          className="border border-gray-300 text-gray-700 text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors"
        >
          Go to Cart
        </Link>
      </div>
    </div>
  );
}
