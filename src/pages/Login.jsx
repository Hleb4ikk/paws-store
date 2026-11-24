import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email.trim(), password);
      addToast('Welcome back!', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
        <div className="flex items-center gap-2 justify-center mb-6">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <PawPrint className="text-white" size={20} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-semibold text-gray-900">PawsStore</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Log in to your account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl hover:opacity-90 transition-opacity font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn size={16} />
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          No account yet?{' '}
          <Link to="/register" className="text-orange-500 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
