import React, { useEffect } from 'react';
import { useCms } from '../../context/CmsContext';

export default function UnderwearGuide() {
  const { db } = useCms();
  const content = db?.pages?.underwearGuide || {};
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="animate-fade-in pb-32">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] bg-sand flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={content.heroImage || "/images/campaign-1.webp"} 
            alt="Underwear Guide Hero" 
            className="w-full h-full object-cover opacity-80 mix-blend-multiply"
          />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-ink mb-6 bg-canvas/90 px-6 py-2">
            {content.heroTitle || 'Underwear Guide'}
          </h1>
          <p className="text-sm md:text-base text-ink font-medium max-w-2xl bg-canvas/90 px-6 py-4 leading-relaxed whitespace-pre-wrap">
            {content.heroDesc || 'From seamless invisibility to cotton comfort. Find the cut and fabric that suits your daily rotation.'}
          </p>
        </div>
      </section>

      {/* Styles & Cuts */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-b border-[#000000]/10">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-ink mb-4">Coverage & Cuts</h2>
          <p className="text-sm text-cocoa max-w-2xl mx-auto">
            Choose your preferred level of coverage. Our styles are engineered to sit smoothly under clothing without digging in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4 text-center">
            <div className="aspect-[3/4] bg-sand overflow-hidden">
              <img src={content.cut1Image || "/images/product-1.webp"} alt="Thong" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-widest text-ink">{content.cut1Title || 'Thong'}</h3>
            <p className="text-xs text-cocoa leading-relaxed whitespace-pre-wrap">
              {content.cut1Desc || 'Zero back coverage. The ultimate solution for no visible panty lines under tight or form-fitting clothing.'}
            </p>
          </div>
          <div className="space-y-4 text-center">
            <div className="aspect-[3/4] bg-[#ececec] overflow-hidden">
              <img src={content.cut2Image || "/images/product-2.webp"} alt="Cheeky" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-widest text-ink">{content.cut2Title || 'Cheeky'}</h3>
            <p className="text-xs text-cocoa leading-relaxed whitespace-pre-wrap">
              {content.cut2Desc || 'Minimal back coverage that flatters the glutes while offering slightly more material than a thong.'}
            </p>
          </div>
          <div className="space-y-4 text-center">
            <div className="aspect-[3/4] bg-sand overflow-hidden">
              <img src={content.cut3Image || "/images/product-3.webp"} alt="Bikini" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-widest text-ink">{content.cut3Title || 'Bikini'}</h3>
            <p className="text-xs text-cocoa leading-relaxed whitespace-pre-wrap">
              {content.cut3Desc || 'Moderate coverage with a slightly higher cut on the leg. A classic, everyday silhouette.'}
            </p>
          </div>
          <div className="space-y-4 text-center">
            <div className="aspect-[3/4] bg-[#ececec] overflow-hidden">
              <img src={content.cut4Image || "/images/editorial-wide.webp"} alt="Brief" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-widest text-ink">{content.cut4Title || 'Brief / Boyshort'}</h3>
            <p className="text-xs text-cocoa leading-relaxed whitespace-pre-wrap">
              {content.cut4Desc || 'Full coverage and maximum comfort. Perfect for lounging, sleeping, or wearing under relaxed fits.'}
            </p>
          </div>
        </div>
      </section>

      {/* Fabrication */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-ink mb-4">Material Matters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-[#f9f9f9] p-8 md:p-12 border border-[#000000]/10 space-y-6">
            <h3 className="text-2xl font-bold uppercase tracking-widest text-ink">{content.fabric1Title || 'Seamless Microfiber'}</h3>
            <p className="text-sm text-cocoa leading-relaxed whitespace-pre-wrap">
              {content.fabric1Desc || 'Our seamless fabric is laser-cut and bonded to lay perfectly flat against the skin. It feels like a second skin, stretching to adapt to your body without digging or rolling. The ultimate choice for wearing under slip dresses, leggings, or tailored trousers.'}
            </p>
          </div>
          <div className="bg-[#f9f9f9] p-8 md:p-12 border border-[#000000]/10 space-y-6">
            <h3 className="text-2xl font-bold uppercase tracking-widest text-ink">{content.fabric2Title || 'Breathable Cotton'}</h3>
            <p className="text-sm text-cocoa leading-relaxed whitespace-pre-wrap">
              {content.fabric2Desc || 'Premium, ethically sourced cotton blended with a touch of elastane for shape retention. Naturally breathable and hypoallergenic, cotton is ideal for daily wear, lounging, and sleeping.'}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
