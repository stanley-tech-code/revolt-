import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  // Redirect if missing params
  useEffect(() => {
    if (!email || !token) {
      navigate('/login');
    }
  }, [email, token, navigate]);

  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length > 5) score += 1;
    if (pass.length > 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    
    if (pass.length === 0) return { label: '', color: 'bg-transparent', score: 0 };
    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', score };
    if (score <= 4) return { label: 'Medium', color: 'bg-yellow-500', score };
    return { label: 'Strong', color: 'bg-green-500', score };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      return setErrorMsg('Passwords do not match');
    }

    if (password.length < 6) {
      return setErrorMsg('Password must be at least 6 characters');
    }

    setStatus('loading');

    try {
      const res = await resetPassword(email, token, password);
      if (res.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(res.error || 'Failed to reset password.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  if (!email || !token) return null;

  return (
    <main className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-canvas px-6 py-12">
      <div className="w-full max-w-[400px]">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2 text-center">New Password</h1>
        
        {status === 'success' ? (
          <div className="text-center">
            <div className="mb-6 p-6 bg-green-50 border border-green-200">
              <h2 className="text-sm font-bold uppercase tracking-widest text-green-800 mb-2">Password Reset Successful</h2>
              <p className="text-xs text-green-700 leading-relaxed">
                Your password has been successfully updated. You can now sign in with your new credentials.
              </p>
            </div>
            <Link to="/login" className="text-[11px] font-bold uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-gray-600 transition-colors">
              Sign In Now
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 tracking-wide text-center mb-8">
              Create a new, strong password for your account.
            </p>

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-[11px] tracking-widest uppercase font-semibold border border-red-100">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] mb-2">New Password *</label>
                <input
                  type="password"
                  required
                  className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  placeholder="Create new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password && (
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex gap-1 w-full mr-4">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div key={level} className={`h-1 flex-1 ${strength.score >= level ? strength.color : 'bg-gray-200'}`}></div>
                      ))}
                    </div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${strength.color.replace('bg-', 'text-')}`}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] mb-2">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#1a1a1a] text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors disabled:opacity-50 mt-4"
              >
                {status === 'loading' ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
