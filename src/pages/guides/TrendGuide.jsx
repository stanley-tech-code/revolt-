import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function TrendGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="animate-fade-in pb-32">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh] bg-sand flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/campaign-1.webp" 
            alt="Trend Guide Hero" 
            className="w-full h-full object-cover opacity-80 mix-blend-multiply"
          />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-ink/80 mb-6 block bg-canvas/90 px-4 py-2 inline-block">The Editorial Edit</span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter text-ink mb-6 bg-canvas/90 px-6 py-2">
            The Trend Guide
          </h1>
          <p className="text-sm md:text-base text-ink font-medium max-w-2xl bg-canvas/90 px-6 py-4 leading-relaxed">
            Discover the season's definitive silhouettes, color palettes, and styling directions. From conceptual layering to minimal essentials.
          </p>
        </div>
      </section>

      {/* Intro Text */}
      <section className="py-24 px-6 max-w-3xl mx-auto text-center border-b border-[#000000]/10">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-ink mb-8">The Shift in Proportions</h2>
        <p className="text-cocoa text-sm md:text-base leading-loose mb-12">
          This season is defined by a distinct shift towards relaxed architectural forms and hyper-tactile materials. We are moving away from restrictive fits into an era of confident, oversized silhouettes that don't compromise on tailoring. It's about how garments interact with the body in motion.
        </p>
        <Link to="/new-in/all-new-arrivals" className="inline-block bg-ink text-canvas px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-ink/80 transition-colors">
          Shop New Arrivals
        </Link>
      </section>

      {/* Trend Breakdowns */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-32">
        
        {/* Trend 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 aspect-[4/5] bg-sand overflow-hidden group">
            <img src="/images/editorial-wide.webp" alt="Oversized Tailoring" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          </div>
          <div className="order-1 md:order-2 space-y-6 md:pl-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cocoa">Trend 01</span>
            <h3 className="text-3xl font-bold uppercase tracking-tight text-ink">Volume & Drape</h3>
            <p className="text-sm text-cocoa leading-relaxed">
              Exaggerated proportions are grounded by precision cuts. Look for drop-shoulder hoodies, pooling trousers, and outerwear that cocoons the body. The key to mastering volume is contrasting it—pair a voluminous top with a structured bottom, or vice versa.
            </p>
            <div className="pt-6">
              <Link to="/clothing/two-piece-matching-sets" className="text-xs font-bold uppercase tracking-[0.1em] border-b border-ink pb-1 hover:text-cocoa transition-colors">
                Explore Matching Sets
              </Link>
            </div>
          </div>
        </div>

        {/* Trend 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 md:pr-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cocoa">Trend 02</span>
            <h3 className="text-3xl font-bold uppercase tracking-tight text-ink">Earthy Neutrals</h3>
            <p className="text-sm text-cocoa leading-relaxed">
              The color palette is rooted in nature. Opt for shades of slate, moss, oat, and deep cocoa. Monochromatic dressing in these hues creates an instantly elevated, expensive look without requiring loud logos or aggressive styling.
            </p>
            <ul className="space-y-3 pt-4 border-t border-[#000000]/10 mt-6">
              <li className="flex items-center gap-3 text-xs uppercase tracking-wider font-bold">
                <span className="w-4 h-4 bg-[#e8e6e1] rounded-full border border-black/10"></span> Oat
              </li>
              <li className="flex items-center gap-3 text-xs uppercase tracking-wider font-bold">
                <span className="w-4 h-4 bg-[#4a4238] rounded-full border border-black/10"></span> Cocoa
              </li>
              <li className="flex items-center gap-3 text-xs uppercase tracking-wider font-bold">
                <span className="w-4 h-4 bg-[#707571] rounded-full border border-black/10"></span> Slate
              </li>
            </ul>
          </div>
          <div className="aspect-[4/5] bg-sand overflow-hidden group">
            <img src="/images/product-3.webp" alt="Neutral Palette" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          </div>
        </div>

      </section>

      {/* Footer CTA */}
      <section className="py-24 bg-ink text-canvas text-center px-6">
        <h2 className="text-3xl font-bold uppercase tracking-widest mb-6">Ready to Update Your Wardrobe?</h2>
        <p className="text-sm text-canvas/70 max-w-xl mx-auto mb-10">
          Shop the pieces featured in this guide and explore our curated selection of seasonal essentials.
        </p>
        <Link to="/new-in/all-new-arrivals" className="inline-block bg-canvas text-ink px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-canvas/90 transition-colors">
          Shop The Collection
        </Link>
      </section>
    </main>
  );
}
