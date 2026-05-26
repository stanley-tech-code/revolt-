import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';

export default function Preferences() {
  const { db } = useCms();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLookup = (e) => {
    e.preventDefault();
    if (!email && !phone) return setMessage('Please enter an email or phone number.');
    
    setLoading(true);
    // Simulate lookup delay
    setTimeout(() => {
      setLoading(false);
      setPreferences({
        emailOptIn: true,
        smsOptIn: false,
        whatsappOptIn: false
      });
      setMessage('');
    }, 1000);
  };

  const handleSave = () => {
    setLoading(true);
    // Simulate saving preferences to backend
    setTimeout(() => {
      setLoading(false);
      setMessage('Your preferences have been successfully updated.');
    }, 1000);
  };

  return (
    <div className="min-h-[60vh] max-w-2xl mx-auto px-6 py-16 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight uppercase">Communication Preferences</h1>
        <p className="text-sm text-[#000000]/60 mt-4 max-w-lg mx-auto">Manage how you hear from {db?.seo?.title || 'Revolt Elite'}. Update your subscription settings for emails, SMS, and exclusive offers.</p>
      </div>

      {!preferences ? (
        <form onSubmit={handleLookup} className="border border-[#000000]/10 p-8 bg-[#f9f9f9] space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-[#000000]/10 pb-4">Find your profile</h2>
          
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-white border border-[#000000]/20 px-4 py-3 text-sm outline-none focus:border-[#000000] transition-colors"
            />
          </div>

          <div className="text-center text-[10px] font-bold uppercase tracking-wider text-[#000000]/40">OR</div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Phone Number</label>
            <input 
              type="tel" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full bg-white border border-[#000000]/20 px-4 py-3 text-sm outline-none focus:border-[#000000] transition-colors"
            />
          </div>

          {message && <p className="text-red-500 text-xs font-bold">{message}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#000000] text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#000000]/80 transition-colors disabled:opacity-50"
          >
            {loading ? 'Looking up...' : 'Manage Preferences'}
          </button>
        </form>
      ) : (
        <div className="border border-[#000000]/10 p-8 bg-[#f9f9f9] space-y-8">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider">Your Subscriptions</h2>
            <p className="text-[10px] uppercase tracking-wider text-[#000000]/50 mt-1">Found profile for {email || phone}</p>
          </div>

          <div className="space-y-6">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="mt-0.5">
                <input 
                  type="checkbox" 
                  checked={preferences.emailOptIn} 
                  onChange={e => setPreferences({...preferences, emailOptIn: e.target.checked})}
                  className="w-5 h-5 border-[#000000]/20 checked:bg-[#000000] transition-colors"
                />
              </div>
              <div>
                <span className="block text-sm font-bold tracking-tight">Email Notifications</span>
                <span className="block text-xs text-[#000000]/60 mt-1">Receive order updates, exclusive sales, and our weekly editorial newsletter.</span>
              </div>
            </label>

            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="mt-0.5">
                <input 
                  type="checkbox" 
                  checked={preferences.smsOptIn} 
                  onChange={e => setPreferences({...preferences, smsOptIn: e.target.checked})}
                  className="w-5 h-5 border-[#000000]/20 checked:bg-[#000000] transition-colors"
                />
              </div>
              <div>
                <span className="block text-sm font-bold tracking-tight">SMS Alerts</span>
                <span className="block text-xs text-[#000000]/60 mt-1">Get immediate text alerts for drops, flash sales, and delivery tracking updates.</span>
              </div>
            </label>

            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="mt-0.5">
                <input 
                  type="checkbox" 
                  checked={preferences.whatsappOptIn} 
                  onChange={e => setPreferences({...preferences, whatsappOptIn: e.target.checked})}
                  className="w-5 h-5 border-[#000000]/20 checked:bg-[#000000] transition-colors"
                />
              </div>
              <div>
                <span className="block text-sm font-bold tracking-tight">WhatsApp Updates</span>
                <span className="block text-xs text-[#000000]/60 mt-1">Receive order receipts and support messages directly via WhatsApp.</span>
              </div>
            </label>
          </div>

          {message && <p className="text-green-600 text-xs font-bold uppercase tracking-wider bg-green-50 p-3 border border-green-200">{message}</p>}

          <div className="flex gap-4 pt-4 border-t border-[#000000]/10">
            <button 
              onClick={() => setPreferences(null)}
              className="px-6 py-3 border border-[#000000]/20 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#000000]/5 transition-colors"
            >
              Back
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-[#000000] text-white py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#000000]/80 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
