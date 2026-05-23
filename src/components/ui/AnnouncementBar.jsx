import React from 'react';
import { useCms } from '../../context/CmsContext';

export default function AnnouncementBar() {
  const { db } = useCms();
  const seo = db.seo;

  if (!seo.promoBannerActive) return null;

  return (
    <div className="bg-canvas text-ink text-center py-1.5 md:py-2 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] relative z-[70] px-4 border-b border-clay/30">
      {seo.promoBannerText}
    </div>
  );
}
