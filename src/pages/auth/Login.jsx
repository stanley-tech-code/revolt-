import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await login(email, password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Failed to login');
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-canvas px-6 py-12">
      <div className="w-full max-w-[400px]">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2 text-center">Sign In</h1>
        <p className="text-sm text-gray-600 tracking-wide text-center mb-8">
          Welcome back to Revolt.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-[11px] tracking-widest uppercase font-semibold border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a]">Password</label>
              <Link to="/forgot-password" className="text-[10px] text-gray-500 hover:text-black transition-colors tracking-wider uppercase">Forgot?</Link>
            </div>
            <input
              type="password"
              required
              className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="remember" className="accent-black w-3.5 h-3.5 cursor-pointer" />
            <label htmlFor="remember" className="text-[11px] tracking-wide text-gray-600 cursor-pointer">Remember me</label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1a1a1a] text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-[12px] text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-black font-semibold uppercase tracking-wider text-[11px] hover:underline ml-2">
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}
