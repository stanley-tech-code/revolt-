import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCms } from '../../context/CmsContext';
import { GUIDE_DEFAULTS } from '../../data/guideDefaults';

export default function MagazineGuide({ pageKey }) {
  const { db } = useCms();
  const content = db?.pages?.[pageKey] || {};
  const defaults = GUIDE_DEFAULTS[pageKey] || GUIDE_DEFAULTS.trendGuide;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageKey]);

  return (
    <main className="animate-fade-in pb-32">
      {/* Hero Section */}
      {content.heroVisible !== false && (
        <section className="relative w-full h-[60vh] md:h-[80vh] bg-sand flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={content.heroImage || defaults.heroImage} 
              alt="Hero" 
              className="w-full h-full object-cover opacity-80 mix-blend-multiply"
            />
          </div>
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-ink/80 mb-6 block bg-canvas/90 px-4 py-2 inline-block">{content.heroEyebrow || defaults.heroEyebrow}</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter text-ink mb-6 bg-canvas/90 px-6 py-2">
              {content.heroTitle || defaults.heroTitle}
            </h1>
            <p className="text-sm md:text-base text-ink font-medium max-w-2xl bg-canvas/90 px-6 py-4 leading-relaxed">
              {content.heroDesc || defaults.heroDesc}
            </p>
          </div>
        </section>
      )}

      {/* Intro Text */}
      {content.introVisible !== false && (
        <section className="py-24 px-6 max-w-3xl mx-auto text-center border-b border-[#000000]/10">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-ink mb-8">{content.introTitle || defaults.introTitle}</h2>
          <p className="text-cocoa text-sm md:text-base leading-loose mb-12 whitespace-pre-wrap">
            {content.introText || defaults.introText}
          </p>
          <Link to={content.introBtnLink || defaults.introBtnLink} className="inline-block bg-ink text-canvas px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-ink/80 transition-colors">
            {content.introBtnText || defaults.introBtnText}
          </Link>
        </section>
      )}

      {/* Breakdowns */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-32">
        
        {/* Section 1 */}
        {content.section1Visible !== false && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 aspect-[4/5] bg-sand overflow-hidden group">
              <img src={content.section1Image || defaults.section1Image} alt="Section 1" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            </div>
            <div className="order-1 md:order-2 space-y-6 md:pl-12">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cocoa">{content.section1Eyebrow || defaults.section1Eyebrow}</span>
              <h3 className="text-3xl font-bold uppercase tracking-tight text-ink">{content.section1Title || defaults.section1Title}</h3>
              <p className="text-sm text-cocoa leading-relaxed whitespace-pre-wrap">
                {content.section1Desc || defaults.section1Desc}
              </p>
              <div className="pt-6">
                <Link to={content.section1BtnLink || defaults.section1BtnLink} className="text-xs font-bold uppercase tracking-[0.1em] border-b border-ink pb-1 hover:text-cocoa transition-colors">
                  {content.section1BtnText || defaults.section1BtnText}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Section 2 */}
        {content.section2Visible !== false && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 md:pr-12">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cocoa">{content.section2Eyebrow || defaults.section2Eyebrow}</span>
              <h3 className="text-3xl font-bold uppercase tracking-tight text-ink">{content.section2Title || defaults.section2Title}</h3>
              <p className="text-sm text-cocoa leading-relaxed whitespace-pre-wrap">
                {content.section2Desc || defaults.section2Desc}
              </p>
              <div className="pt-6">
                <Link to={content.section2BtnLink || defaults.section2BtnLink} className="text-xs font-bold uppercase tracking-[0.1em] border-b border-ink pb-1 hover:text-cocoa transition-colors">
                  {content.section2BtnText || defaults.section2BtnText}
                </Link>
              </div>
            </div>
            <div className="aspect-[4/5] bg-sand overflow-hidden group">
              <img src={content.section2Image || defaults.section2Image} alt="Section 2" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            </div>
          </div>
        )}

      </section>

      {/* Footer CTA */}
      {content.ctaVisible !== false && (
        <section className="py-24 bg-ink text-canvas text-center px-6">
          <h2 className="text-3xl font-bold uppercase tracking-widest mb-6">{content.ctaTitle || defaults.ctaTitle}</h2>
          <p className="text-sm text-canvas/70 max-w-xl mx-auto mb-10 whitespace-pre-wrap">
            {content.ctaDesc || defaults.ctaDesc}
          </p>
          <Link to={content.ctaBtnLink || defaults.ctaBtnLink} className="inline-block bg-canvas text-ink px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-canvas/90 transition-colors">
            {content.ctaBtnText || defaults.ctaBtnText}
          </Link>
        </section>
      )}
    </main>
  );
}
