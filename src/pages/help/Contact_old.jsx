import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';

export default function Contact() {
  const { db } = useCms();
  const content = db?.pages?.contact || {};
  const [formState, setFormState] = useState('idle');
  
  // Extract contact info, handling backward compatibility with older string fields
  const rawLoc = db?.settings?.localization || {};
  const emails = rawLoc.supportEmails || (rawLoc.supportEmail ? [rawLoc.supportEmail] : []);
  const phones = rawLoc.supportPhones || (rawLoc.supportPhone ? [rawLoc.supportPhone] : []);
  const address = rawLoc.address || '';
  const mapsLink = rawLoc.mapsLink || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Honeypot check
    if (formData.get('_honeypot')) {
      console.warn('Spam detected');
      return;
    }

    setFormState('submitting');
    
    const payload = {
      name: `${formData.get('firstName')} ${formData.get('lastName')}`.trim(),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setFormState('success');
        e.target.reset();
      } else {
        alert('Failed to send message. Please try again.');
        setFormState('idle');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
      setFormState('idle');
    }
  };

  return (
    <main className="bg-canvas min-h-screen text-ink pb-20 pt-10">
      <section className="max-w-7xl mx-auto px-6">
        
        <div className="space-y-12 pr-0 lg:pr-12 mb-16">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-widest text-[#000000] mb-4">{content.title || 'Contact Support'}</h1>
            <p className="text-sm text-[#000000]/70 leading-relaxed whitespace-pre-wrap">
              {content.subtitle || 'Need help with an order, fit advice, or just want to say hi? Fill out the form below or reach us directly. Our team typically responds within 24-48 hours.'}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="text-xl pt-1">Ô£ë´©Å</div>
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/50 mb-1">Email</h3>
                <a href={`mailto:${content.email || 'hello@revolt.com'}`} className="text-sm font-medium hover:underline">{content.email || 'hello@revolt.com'}</a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="text-xl pt-1">­ƒô▒</div>
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/50 mb-1">Phone / WhatsApp</h3>
                <a href={`tel:${content.phone || '+254700000000'}`} className="text-sm font-medium hover:underline">{content.phone || '+254 700 000 000'}</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-xl pt-1">ÔÅ░</div>
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/50 mb-1">Hours of Operation</h3>
                <p className="text-sm font-medium">{content.hours || 'Mon - Fri, 9am - 6pm EAT'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          
          <div className="space-y-10 animate-fade-in" style={{ animationDelay: '100ms' }}>
            {emails.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-cocoa mb-4 flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-cocoa/30"></span> Email Inquiries
                </h3>
                <div className="space-y-2">
                  {emails.map((email, idx) => (
                    <a key={idx} href={`mailto:${email}`} className="block text-xl md:text-2xl font-light hover:text-cocoa transition-colors">
                      {email}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {phones.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-cocoa mb-4 flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-cocoa/30"></span> Phone Support
                </h3>
                <div className="space-y-2">
                  {phones.map((phone, idx) => (
                    <a key={idx} href={`tel:${phone.replace(/\s+/g, '')}`} className="block text-xl md:text-2xl font-light hover:text-cocoa transition-colors">
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Address Section */}
            {address && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-cocoa mb-4 flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-cocoa/30"></span> Headquarters
                </h3>
                <p className="text-base leading-relaxed whitespace-pre-wrap font-light max-w-xs">
                  {address}
                </p>
                {mapsLink && (
                  <a href={mapsLink} target="_blank" rel="noreferrer" className="inline-block mt-4 text-xs font-bold uppercase tracking-[0.2em] border-b border-ink pb-1 hover:text-cocoa transition-colors">
                    Get Directions
                  </a>
                )}
              </div>
            )}
            

          </div>

          {/* CONTACT FORM */}
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="bg-white p-8 md:p-12 shadow-sm rounded-sm">
              <h2 className="text-2xl font-bold uppercase tracking-tight mb-8">Send a Message</h2>
              
              {formState === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wider mb-2">Message Sent</h3>
                  <p className="text-ink/70 text-sm mb-8">Thank you for contacting us. We have received your message and will get back to you shortly.</p>
                  <button onClick={() => setFormState('idle')} className="text-xs font-bold uppercase tracking-[0.2em] border-b border-ink pb-1 hover:text-cocoa transition-colors">
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative">
                  {formState === 'submitting' && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                      <div className="w-8 h-8 border-2 border-ink/20 border-t-ink rounded-full animate-spin"></div>
                    </div>
                  )}

                  {/* HONEYPOT FIELD FOR SPAM PROTECTION */}
                  <div className="hidden" aria-hidden="true">
                    <input type="text" name="_honeypot" tabIndex="-1" autoComplete="off" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-ink/70">First Name</label>
                      <input name="firstName" required type="text" className="w-full bg-sand border-b border-ink/20 px-0 py-3 text-sm outline-none focus:border-ink transition-colors bg-transparent" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-ink/70">Last Name</label>
                      <input name="lastName" required type="text" className="w-full bg-sand border-b border-ink/20 px-0 py-3 text-sm outline-none focus:border-ink transition-colors bg-transparent" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-ink/70">Email Address</label>
                      <input name="email" required type="email" className="w-full bg-sand border-b border-ink/20 px-0 py-3 text-sm outline-none focus:border-ink transition-colors bg-transparent" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-ink/70">Phone Number</label>
                      <input name="phone" required type="tel" pattern="[+0-9\s\-()]+" title="Valid phone number" className="w-full bg-sand border-b border-ink/20 px-0 py-3 text-sm outline-none focus:border-ink transition-colors bg-transparent" />
                      <p className="text-[9px] text-ink/50 mt-1">Please include country code (e.g. +1)</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-ink/70">Subject (Optional)</label>
                    <input name="subject" type="text" className="w-full bg-sand border-b border-ink/20 px-0 py-3 text-sm outline-none focus:border-ink transition-colors bg-transparent" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-ink/70">Message</label>
                    <textarea name="message" required rows="4" className="w-full bg-sand border border-ink/20 p-4 text-sm outline-none focus:border-ink transition-colors resize-y bg-transparent"></textarea>
                  </div>

                  <button type="submit" className="w-full bg-ink text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-ink/80 transition-colors">
                    Submit Message
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
