import React, { useState, useEffect } from 'react';
import { useCms } from '../../context/CmsContext';

export default function CookieBanner() {
  const { db } = useCms();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if enabled in CMS AND not already dismissed locally
    const isDismissed = localStorage.getItem('REVOLT_COOKIE_CONSENT');
    if (db?.settings?.legal?.cookieBannerEnabled && !isDismissed) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [db?.settings?.legal?.cookieBannerEnabled]);

  const acceptCookies = () => {
    localStorage.setItem('REVOLT_COOKIE_CONSENT', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#f9f9f9] border-t border-[#000000]/10 p-4 md:p-6 z-[9999] shadow-2xl animate-fade-in flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-sm text-[#000000]/80 flex-1 max-w-4xl">
        <p className="font-bold mb-1 uppercase tracking-wider text-[10px]">Cookie Notice</p>
        We use cookies to improve your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies. Read our <a href="/policies/privacy" className="underline font-bold">Privacy Policy</a>.
      </div>
      <div className="flex gap-3 w-full md:w-auto">
        <button onClick={acceptCookies} className="flex-1 md:flex-none border border-[#000000]/20 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#e0e0e0] transition-colors">
          Manage
        </button>
        <button onClick={acceptCookies} className="flex-1 md:flex-none bg-[#000000] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#000000]/80 transition-colors">
          Accept All
        </button>
      </div>
    </div>
  );
}
