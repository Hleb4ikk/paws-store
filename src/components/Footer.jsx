import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Send } from 'lucide-react';

const Facebook = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const Instagram = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
);
const Twitter = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <PawPrint className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <span className="text-white font-semibold text-lg">PawsStore</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted source for premium pet supplies and accessories.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><Facebook size={18} /></a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><Instagram size={18} /></a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><Twitter size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2">
              {['Shop All', 'New Arrivals', 'Best Sellers', 'Sale Items'].map(l => (
                <li key={l}><a href="#" className="text-sm hover:text-orange-500 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Customer Service</h4>
            <ul className="space-y-2">
              {['Contact Us', 'Shipping Info', 'Returns Policy', 'FAQ'].map(l => (
                <li key={l}><a href="#" className="text-sm hover:text-orange-500 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-3">Subscribe to get special offers and updates.</p>
            <form onSubmit={e => e.preventDefault()} className="flex">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:border-orange-500 text-white placeholder-gray-500"
              />
              <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors ml-1">
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2026 PawsStore. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-500 text-sm hover:text-orange-500 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 text-sm hover:text-orange-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
