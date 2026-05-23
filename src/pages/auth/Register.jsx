import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: ''
  });
  
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Simple password strength calculation
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

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setIsLoading(true);

    const { confirmPassword, ...registerData } = formData;
    const res = await register(registerData);
    
    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/account');
      }, 2000);
    } else {
      setError(res.error || 'Registration failed');
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full min-h-[90vh] flex flex-col items-center justify-center bg-canvas px-6 py-12">
      <div className="w-full max-w-[500px]">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2 text-center">Create Account</h1>
        <p className="text-sm text-gray-600 tracking-wide text-center mb-8">
          Join Revolt for early access, order tracking, and seamless checkout.
        </p>

        {isSuccess && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 text-[11px] tracking-widest uppercase font-bold border border-green-200 text-center animate-pulse">
            Account created successfully! Redirecting to your dashboard...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-[11px] tracking-widest uppercase font-semibold border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] mb-2">Full Name *</label>
              <input
                type="text"
                name="fullName"
                required
                className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="First & Last Name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] mb-2">Password *</label>
              <input
                type="password"
                name="password"
                required
                className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
              />
              {formData.password && (
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
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] mb-2">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                required
                className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="Phone (optional)"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-6">
              <div className="flex-1">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors text-gray-500"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              <div className="w-1/3">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] mb-2">Gender</label>
                <select 
                  name="gender" 
                  className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors text-gray-500"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1a1a1a] text-white py-4 mt-8 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-[12px] text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-black font-semibold uppercase tracking-wider text-[11px] hover:underline ml-2">
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
