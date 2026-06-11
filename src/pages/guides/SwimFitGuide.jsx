import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCms } from '../../context/CmsContext';

export default function SwimFitGuide() {
  const { db } = useCms();
  const content = db?.pages?.swimFitGuide || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="animate-fade-in pb-32">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] bg-sand flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={content.heroImage || "/images/editorial-wide.webp"} 
            alt="Swim Fit Guide Hero" 
            className="w-full h-full object-cover opacity-80 mix-blend-multiply"
          />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-ink/80 mb-6 block bg-canvas/90 px-4 py-2">{content.heroEyebrow || 'The Resort Edit'}</span>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-ink mb-6 bg-canvas/90 px-6 py-2">
            {content.heroTitle || 'Swim Fit Guide'}
          </h1>
          <p className="text-sm md:text-base text-ink font-medium max-w-2xl bg-canvas/90 px-6 py-4 leading-relaxed whitespace-pre-wrap">
            {content.heroDesc || 'Finding swimwear that flatters and supports. Explore our core silhouettes designed for the sun.'}
          </p>
        </div>
      </section>

      {/* Sizing & Tops */}
      <section className="py-24 px-6 max-w-6xl mx-auto border-b border-[#000000]/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="aspect-[4/5] bg-sand overflow-hidden">
            <img src={content.topImage || "/images/product-2.webp"} alt="Tops" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-6 md:pl-8">
            <h3 className="text-2xl font-bold uppercase tracking-widest text-ink mb-6">{content.topTitle || 'Top Fits & Support'}</h3>
            <p className="text-sm text-cocoa leading-relaxed whitespace-pre-wrap">
              {content.topDesc || 'Our swim tops are designed with diverse support levels in mind. From structured underwire tops for maximum lift to minimalist triangle tops for minimal tan lines.'}
            </p>
            <ul className="space-y-6">
              <li className="p-4 border border-[#000000]/10 bg-[#f9f9f9]">
                <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-1">Triangle Tops (Light Support)</h3>
                <p className="text-xs text-cocoa">Fully adjustable ties. Best for A-C cups or minimal tan lines.</p>
              </li>
              <li className="p-4 border border-[#000000]/10 bg-[#f9f9f9]">
                <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-1">Bandeau / Strapless (Medium Support)</h3>
                <p className="text-xs text-cocoa">Features hidden grip tape. Best for B-D cups. Excellent for preventing tan lines.</p>
              </li>
              <li className="p-4 border border-[#000000]/10 bg-[#f9f9f9]">
                <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-1">Underwire / Balconette (Maximum Support)</h3>
                <p className="text-xs text-cocoa">Constructed like your favorite bra. Thick, adjustable straps and encased wire. Best for C-DD+ cups.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bottoms Coverage */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 space-y-6 md:pr-8">
            <h3 className="text-2xl font-bold uppercase tracking-widest text-ink mb-6">{content.bottomTitle || 'Bottom Coverage'}</h3>
            <p className="text-sm text-cocoa leading-relaxed whitespace-pre-wrap">
              {content.bottomDesc || 'From high-waisted to minimal coverage, choose the cut that gives you confidence on the beach.'}
            </p>
            <div className="space-y-4">
              <div className="border-l-2 border-ink pl-4 py-1">
                <h3 className="text-sm font-bold uppercase tracking-widest text-ink mb-1">High-Waist / Full Coverage</h3>
                <p className="text-xs text-cocoa">Sits at or above the belly button. Full coverage across the glutes. Flattering core compression.</p>
              </div>
              <div className="border-l-2 border-[#000000]/20 pl-4 py-1">
                <h3 className="text-sm font-bold uppercase tracking-widest text-ink mb-1">Cheeky / Mid-Rise</h3>
                <p className="text-xs text-cocoa">Sits just below the belly button. Moderate back coverage that subtly lifts the glutes.</p>
              </div>
              <div className="border-l-2 border-[#000000]/20 pl-4 py-1">
                <h3 className="text-sm font-bold uppercase tracking-widest text-ink mb-1">Thong / High-Cut</h3>
                <p className="text-xs text-cocoa">Designed to sit high on the hips to elongate the legs. Minimal back coverage.</p>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 aspect-[4/5] bg-[#ececec] overflow-hidden">
            <img src={content.bottomImage || "/images/product-1.webp"} alt="Bottoms" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Care */}
      <section className="py-24 bg-ink text-canvas px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-widest mb-8">{content.careTitle || 'Swim Care 101'}</h2>
            <p className="text-sm text-canvas/70 leading-relaxed mb-6 whitespace-pre-wrap">
              {content.careDesc || 'Chlorine, salt water, and sunscreen can break down swim fabrics over time. Follow these steps to preserve the color and elasticity of your swimwear.'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 shadow-sm">
            <div className="text-2xl mb-4">🚿</div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink mb-2">Rinse Immediately</h3>
            <p className="text-xs text-cocoa">Rinse your suit in cool, fresh water immediately after leaving the pool or ocean.</p>
          </div>
          <div className="bg-white p-8 shadow-sm">
            <div className="text-2xl mb-4">🧼</div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink mb-2">Hand Wash Cold</h3>
            <p className="text-xs text-cocoa">Wash with a mild detergent designed for delicates. Never machine wash.</p>
          </div>
          <div className="bg-white p-8 shadow-sm">
            <div className="text-2xl mb-4">☀️</div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink mb-2">Dry Flat in Shade</h3>
            <p className="text-xs text-cocoa">Direct sunlight fades colors. Lay flat to dry to prevent stretching the straps.</p>
          </div>
        </div>
      </section>

      <div className="text-center py-12">
        <Link to="/swimwear/swimsuits" className="inline-block bg-ink text-canvas px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-ink/80 transition-colors">
          Shop Swimwear
        </Link>
      </div>

    </main>
  );
}
