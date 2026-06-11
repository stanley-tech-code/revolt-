import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await forgotPassword(email);
      if (res.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(res.error || 'Failed to send reset link.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  return (
    <main className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-canvas px-6 py-12">
      <div className="w-full max-w-[400px]">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2 text-center">Reset Password</h1>
        
        {status === 'success' ? (
          <div className="text-center">
            <div className="mb-6 p-6 bg-green-50 border border-green-200">
              <h2 className="text-sm font-bold uppercase tracking-widest text-green-800 mb-2">Check Your Email</h2>
              <p className="text-xs text-green-700 leading-relaxed">
                If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly. Please check your spam folder if you don't see it.
              </p>
            </div>
            <Link to="/login" className="text-[11px] font-bold uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-gray-600 transition-colors">
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 tracking-wide text-center mb-8">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-[11px] tracking-widest uppercase font-semibold border border-red-100">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#1a1a1a] text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors disabled:opacity-50 mt-4"
              >
                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="mt-8 text-center text-[12px] text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="text-black font-semibold uppercase tracking-wider text-[11px] hover:underline ml-2">
                Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
