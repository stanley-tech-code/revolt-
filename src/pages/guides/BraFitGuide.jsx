import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function BraFitGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="animate-fade-in pb-32">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] bg-sand flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/editorial-wide.webp" 
            alt="Bra Fit Guide" 
            className="w-full h-full object-cover opacity-60 mix-blend-multiply"
          />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-ink/80 mb-6 block bg-canvas/80 px-4 py-2">The Intimates Edit</span>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-ink mb-6 bg-canvas/90 px-6 py-2">
            Bra Fit Guide
          </h1>
          <p className="text-sm text-ink max-w-xl mx-auto leading-relaxed bg-canvas/90 px-6 py-4 font-medium">
            Find your perfect fit. A supportive, comfortable bra starts with the right measurements.
          </p>
        </div>
      </section>

      {/* How to Measure */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-ink mb-4">How To Measure</h2>
          <p className="text-sm text-cocoa max-w-2xl mx-auto">
            Grab a soft measuring tape and wear an unlined, non-padded bra. Follow these two simple steps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-12">
            <div className="flex gap-6 items-start">
              <span className="text-4xl font-bold text-[#e8e6e1]">01</span>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-widest text-ink mb-2">Measure Your Band</h3>
                <p className="text-sm text-cocoa leading-relaxed">
                  Wrap the measuring tape snugly around your ribcage, directly under your bust. Make sure the tape is level all the way around. If you get an odd number, round up to the next even number. This is your band size (e.g., 34).
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <span className="text-4xl font-bold text-[#e8e6e1]">02</span>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-widest text-ink mb-2">Measure Your Bust</h3>
                <p className="text-sm text-cocoa leading-relaxed">
                  Wrap the measuring tape somewhat loosely around the fullest part of your bust. Again, keep the tape level. Round to the nearest whole number.
                </p>
              </div>
            </div>
            <div className="bg-sand p-6 border-l-4 border-ink">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Calculate Your Cup Size</h4>
              <p className="text-xs text-cocoa leading-relaxed">
                Subtract your band size (Step 1) from your bust measurement (Step 2). The difference determines your cup size.<br/><br/>
                1" = A | 2" = B | 3" = C | 4" = D | 5" = DD | 6" = DDD
              </p>
            </div>
          </div>
          <div className="aspect-square bg-[#f9f9f9] border border-[#000000]/10 flex items-center justify-center p-12">
             <img src="/images/product-3.webp" alt="Measuring Guide" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Sister Sizing */}
      <section className="py-24 bg-ink text-canvas px-6 text-center">
        <h2 className="text-2xl font-bold uppercase tracking-widest mb-6">Sister Sizing</h2>
        <p className="text-sm text-canvas/70 max-w-2xl mx-auto mb-12">
          If your recommended size feels slightly off, try a sister size. If you go up a band size, go down a cup size (and vice versa) to maintain the same cup volume.
        </p>
        <div className="max-w-3xl mx-auto overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap border border-canvas/20">
            <thead className="bg-canvas/10 text-[10px] font-bold uppercase tracking-[0.2em] text-canvas">
              <tr>
                <th className="px-6 py-4">If your band is too tight</th>
                <th className="px-6 py-4">Current Size</th>
                <th className="px-6 py-4">If your band is too loose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas/20 text-canvas/80">
              <tr><td className="px-6 py-4">Try 36A</td><td className="px-6 py-4 font-bold text-white">34B</td><td className="px-6 py-4">Try 32C</td></tr>
              <tr><td className="px-6 py-4">Try 36B</td><td className="px-6 py-4 font-bold text-white">34C</td><td className="px-6 py-4">Try 32D</td></tr>
              <tr><td className="px-6 py-4">Try 36C</td><td className="px-6 py-4 font-bold text-white">34D</td><td className="px-6 py-4">Try 32DD</td></tr>
              <tr><td className="px-6 py-4">Try 38B</td><td className="px-6 py-4 font-bold text-white">36C</td><td className="px-6 py-4">Try 34D</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Styles */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-ink mb-4">Explore Styles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/bras/t-shirt-bras" className="group block text-center">
            <div className="aspect-[4/5] bg-sand mb-6 overflow-hidden">
               <img src="/images/product-2.webp" alt="T-Shirt Bra" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-ink mb-2">T-Shirt Bras</h3>
            <p className="text-xs text-cocoa">Smooth, seamless cups invisible under tight clothing.</p>
          </Link>
          <Link to="/bras/unlined" className="group block text-center">
            <div className="aspect-[4/5] bg-[#ececec] mb-6 overflow-hidden">
               <img src="/images/product-1.webp" alt="Unlined Bra" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-ink mb-2">Unlined</h3>
            <p className="text-xs text-cocoa">Natural shape with wire support but no padding.</p>
          </Link>
          <Link to="/bras/push-up" className="group block text-center">
            <div className="aspect-[4/5] bg-sand mb-6 overflow-hidden">
               <img src="/images/product-3.webp" alt="Push-Up Bra" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-ink mb-2">Push-Up</h3>
            <p className="text-xs text-cocoa">Targeted padding for lift and enhanced cleavage.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
