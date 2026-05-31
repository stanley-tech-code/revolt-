import React, { useState, useEffect } from 'react';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    // Check if user has already seen or subscribed to the popup
    const hasSeenPopup = localStorage.getItem('revolt_newsletter_seen');
    if (!hasSeenPopup) {
      // Delay popup by 4 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('revolt_newsletter_seen', 'true');
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (honeypot) return; // Silent reject for bots
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'popup' })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setStatus('success');
        localStorage.setItem('revolt_newsletter_seen', 'true');
        // Auto-close after 3 seconds on success
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Network error. Please try again later.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in transition-opacity duration-500"
        onClick={handleClose}
      />
      
      {/* Popup Card */}
      <div className="relative bg-white/95 backdrop-blur-md w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-slide-up border border-[#000000]/10">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#000000]/50 hover:text-[#000000] transition-colors p-1"
          aria-label="Close popup"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="p-10 md:p-12 text-center">
          {status === 'success' ? (
            <div className="animate-fade-in py-8">
              <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2 className="text-2xl font-bold uppercase tracking-widest text-[#000000] mb-2">You're in.</h2>
              <p className="text-sm text-[#000000]/70 font-light">Welcome to Revolt.</p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#000000] mb-4">
                Join the World of Revolt
              </h2>
              <p className="text-sm md:text-base text-[#000000]/70 font-light leading-relaxed mb-8 px-2">
                Get early access to new drops, exclusive releases, and members-only updates before anyone else.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-4">
                {/* Honeypot */}
                <input 
                  type="text" 
                  name="_hp_popup" 
                  value={honeypot} 
                  onChange={(e) => setHoneypot(e.target.value)} 
                  className="hidden" 
                  tabIndex="-1" 
                  autoComplete="off" 
                />

                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                    required
                    className="w-full bg-sand/30 border border-clay/50 px-4 py-3.5 text-sm focus:outline-none focus:border-[#000000] transition-colors rounded-sm placeholder:text-[#000000]/40 text-[#000000]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-ink text-white px-4 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-cocoa transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? 'SUBSCRIBING...' : 'Subscribe'}
                </button>

                {status === 'error' && (
                  <p className="text-red-600 text-xs mt-2 text-left px-1">{errorMessage}</p>
                )}

                <p className="text-[10px] text-[#000000]/40 font-light mt-6 px-4">
                  By subscribing, you agree to receive marketing emails. You can unsubscribe anytime.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
