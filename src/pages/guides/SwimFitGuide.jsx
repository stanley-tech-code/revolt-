import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function SwimFitGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="animate-fade-in pb-32">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] bg-ink flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/editorial-wide.webp" 
            alt="Swim Fit Guide" 
            className="w-full h-full object-cover opacity-40 mix-blend-screen grayscale"
          />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-canvas/80 mb-6 block border border-canvas/20 px-4 py-2">The Resort Edit</span>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-canvas mb-6">
            Swim Fit Guide
          </h1>
          <p className="text-sm text-canvas/80 max-w-xl mx-auto leading-relaxed">
            Finding swimwear that flatters, supports, and stays put. Dive into our sizing guidelines and care instructions.
          </p>
        </div>
      </section>

      {/* Sizing & Tops */}
      <section className="py-24 px-6 max-w-6xl mx-auto border-b border-[#000000]/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] bg-sand overflow-hidden">
             <img src="/images/product-2.webp" alt="Swim Tops" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-8">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-ink">Top Fits & Support</h2>
            <p className="text-sm text-cocoa leading-relaxed">
              Our swim tops are designed to accommodate a range of bust sizes. We categorize them by support level so you can find exactly what you need for lounging or active swimming.
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 space-y-8">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-ink">Bottom Coverage</h2>
            <p className="text-sm text-cocoa leading-relaxed">
              From high-waisted to minimal coverage, choose the cut that makes you feel most confident.
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
             <img src="/images/product-1.webp" alt="Swim Bottoms" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Swim Care */}
      <section className="py-24 bg-[#f5f5f5] px-6 text-center">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-ink mb-6">Swim Care 101</h2>
        <p className="text-sm text-cocoa max-w-2xl mx-auto mb-12">
          Chlorine, salt water, and sunscreen can degrade spandex. Follow these rules to keep your swimwear looking new season after season.
        </p>
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
