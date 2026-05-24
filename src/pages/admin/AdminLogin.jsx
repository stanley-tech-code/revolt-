import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCms } from '../../context/CmsContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { loginAdmin, isLoading } = useCms();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    const res = await loginAdmin(username, password);
    if (res.success) {
      const origin = location.state?.from?.pathname || '/admin/dashboard';
      navigate(origin, { replace: true });
    } else {
      setErrorMsg(res.error || 'Authentication failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-6 text-[#000000]">
      <div className="w-full max-w-md bg-white border border-[#000000]/10 p-10 md:p-14 shadow-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight uppercase mb-2">Revolt</h1>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#000000]/60 font-medium">Administration Portal</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-semibold uppercase tracking-wider text-center border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm focus:border-[#000000] focus:outline-none transition-colors"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm focus:border-[#000000] focus:outline-none transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#000000] text-white py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#000000]/80 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-[#000000]/40 text-[9px] uppercase tracking-[0.1em]">
          Restricted Access. Authorized Personnel Only.
        </div>
      </div>
    </div>
  );
}
