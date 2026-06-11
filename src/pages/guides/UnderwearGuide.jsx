import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function UnderwearGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="animate-fade-in pb-32">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] bg-sand flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/campaign-1.webp" 
            alt="Underwear Guide" 
            className="w-full h-full object-cover opacity-50 mix-blend-multiply"
          />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-ink mb-6 bg-canvas/90 px-6 py-2">
            Underwear Guide
          </h1>
          <p className="text-sm text-ink max-w-xl mx-auto leading-relaxed bg-canvas/90 px-6 py-4 font-medium">
            From seamless invisibility to cotton comfort. Find the cuts and fabrics that form the foundation of your daily wardrobe.
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
          <div className="space-y-4">
            <div className="aspect-square bg-sand mb-4 overflow-hidden">
               <img src="/images/product-1.webp" alt="Thong" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-ink border-b border-ink/10 pb-2">Thong</h3>
            <p className="text-xs text-cocoa">Zero back coverage. The ultimate solution for preventing visible panty lines under tight clothing.</p>
            <Link to="/underwear/thongs" className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink hover:text-cocoa">Shop Thongs &rarr;</Link>
          </div>
          <div className="space-y-4">
            <div className="aspect-square bg-[#ececec] mb-4 overflow-hidden">
               <img src="/images/product-2.webp" alt="Cheeky" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-ink border-b border-ink/10 pb-2">Cheeky</h3>
            <p className="text-xs text-cocoa">Minimal back coverage that flatters the glutes while providing slightly more fabric than a thong.</p>
            <Link to="/underwear/cheeky" className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink hover:text-cocoa">Shop Cheeky &rarr;</Link>
          </div>
          <div className="space-y-4">
            <div className="aspect-square bg-sand mb-4 overflow-hidden">
               <img src="/images/product-3.webp" alt="Bikini" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-ink border-b border-ink/10 pb-2">Bikini</h3>
            <p className="text-xs text-cocoa">Moderate coverage with a slightly higher cut on the leg. A classic everyday essential.</p>
            <Link to="/underwear/all-underwear" className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink hover:text-cocoa">Shop Bikinis &rarr;</Link>
          </div>
          <div className="space-y-4">
            <div className="aspect-square bg-[#ececec] mb-4 overflow-hidden">
               <img src="/images/editorial-wide.webp" alt="Brief" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-ink border-b border-ink/10 pb-2">Brief / Boyshort</h3>
            <p className="text-xs text-cocoa">Full coverage and maximum comfort. Perfect for lounging, sleeping, or under flowy skirts.</p>
            <Link to="/underwear/all-underwear" className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink hover:text-cocoa">Shop Briefs &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Fabrication */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-ink mb-4">Material Matters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-[#f9f9f9] p-8 md:p-12 border border-[#000000]/10">
            <h3 className="text-lg font-bold uppercase tracking-widest text-ink mb-4">Seamless Microfiber</h3>
            <p className="text-sm text-cocoa leading-relaxed mb-6">
              Our seamless fabric is laser-cut and engineered with high-stretch elastane. It melts into the skin, preventing digging or rolling, making it completely invisible under leggings and tailored pants.
            </p>
            <Link to="/underwear/seamless" className="inline-block border border-ink text-ink px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-ink hover:text-canvas transition-colors">
              Explore Seamless
            </Link>
          </div>
          <div className="bg-[#f9f9f9] p-8 md:p-12 border border-[#000000]/10">
            <h3 className="text-lg font-bold uppercase tracking-widest text-ink mb-4">Breathable Cotton</h3>
            <p className="text-sm text-cocoa leading-relaxed mb-6">
              Premium, ethically sourced cotton blended with just enough stretch for shape retention. Highly breathable, hypoallergenic, and ideal for everyday wear, sleeping, or high-humidity days.
            </p>
            <Link to="/underwear/all-underwear" className="inline-block border border-ink text-ink px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-ink hover:text-canvas transition-colors">
              Explore Cotton
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
