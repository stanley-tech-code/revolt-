import React, { useState, useEffect } from 'react';
import { useCms } from '../../context/CmsContext';

export default function AnnouncementBar() {
  const { db } = useCms();
  const seo = db.seo;
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!seo?.promoEndDate) return;
    
    const target = new Date(seo.promoEndDate).getTime();
    if (isNaN(target)) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft('');
        return;
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(` — Ends in ${d}d ${h}h ${m}m ${s}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [seo?.promoEndDate]);

  if (!seo?.promoBannerActive) return null;

  return (
    <div className="bg-canvas text-ink text-center py-1.5 md:py-2 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] relative z-[70] px-4 border-b border-clay/30">
      {seo.promoBannerText} <span className="text-cocoa font-bold">{timeLeft}</span>
    </div>
  );
}
