import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCms } from '../../context/CmsContext';

export default function BraFitGuide() {
  const { db } = useCms();
  const content = db?.pages?.braFitGuide || {};

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
            alt="Bra Fit Guide Hero" 
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-ink/80 mb-6 block bg-canvas/90 px-4 py-2">{content.heroEyebrow || 'The Intimates Edit'}</span>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-ink mb-6 bg-canvas/90 px-6 py-2">
            {content.heroTitle || 'Bra Fit Guide'}
          </h1>
          <p className="text-sm md:text-base text-ink font-medium max-w-2xl bg-canvas/90 px-6 py-4 leading-relaxed whitespace-pre-wrap">
            {content.heroDesc || 'Find your perfect fit. A supportive, comfortable bra is the foundation of any wardrobe.'}
          </p>
        </div>
      </section>

      {/* Measuring Guide */}
      <section className="py-24 px-6 max-w-5xl mx-auto border-b border-[#000000]/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] bg-sand overflow-hidden">
            <img src={content.measureImage || "/images/product-3.webp"} alt="Measuring Guide" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-widest text-ink mb-4">{content.measureTitle || 'How To Measure'}</h2>
              <p className="text-sm text-cocoa leading-relaxed whitespace-pre-wrap">
                {content.measureDesc || 'Grab a soft measuring tape and wear an unlined (non-padded) bra that fits you well.'}
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="text-2xl font-bold text-[#e8e6e1]">01</span>
                <p className="text-sm text-cocoa">{content.stepOne || 'Measure under your bust for your band size.'}</p>
              </div>
              <div className="flex gap-4">
                <span className="text-2xl font-bold text-[#e8e6e1]">02</span>
                <p className="text-sm text-cocoa">{content.stepTwo || 'Measure the fullest part of your bust for your cup size.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sister Sizing */}
      <section className="py-24 px-6 max-w-3xl mx-auto text-center border-b border-[#000000]/10">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-ink mb-6">{content.sisterTitle || 'Sister Sizing'}</h2>
        <p className="text-sm text-cocoa leading-relaxed mb-10 whitespace-pre-wrap">
          {content.sisterDesc || 'If your recommended size feels slightly off, try a sister size. Sister sizes hold the same cup volume but vary by band size.'}
        </p>
        <div className="max-w-3xl mx-auto overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap border border-ink/20">
            <thead className="bg-ink text-[10px] font-bold uppercase tracking-[0.2em] text-canvas">
              <tr>
                <th className="px-6 py-4">If your band is too tight</th>
                <th className="px-6 py-4">Current Size</th>
                <th className="px-6 py-4">If your band is too loose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 text-ink">
              <tr><td className="px-6 py-4">Try 36A</td><td className="px-6 py-4 font-bold">34B</td><td className="px-6 py-4">Try 32C</td></tr>
              <tr><td className="px-6 py-4">Try 36B</td><td className="px-6 py-4 font-bold">34C</td><td className="px-6 py-4">Try 32D</td></tr>
              <tr><td className="px-6 py-4">Try 36C</td><td className="px-6 py-4 font-bold">34D</td><td className="px-6 py-4">Try 32DD</td></tr>
              <tr><td className="px-6 py-4">Try 38B</td><td className="px-6 py-4 font-bold">36C</td><td className="px-6 py-4">Try 34D</td></tr>
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
