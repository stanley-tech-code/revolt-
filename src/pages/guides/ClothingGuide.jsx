import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ClothingGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="animate-fade-in pb-32">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] bg-[#f5f5f5] flex items-center justify-center border-b border-[#000000]/10">
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-ink/60 mb-6 block">Fit & Fabrication</span>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-ink mb-6">
            Clothing Guide
          </h1>
          <p className="text-sm text-cocoa max-w-xl mx-auto leading-relaxed">
            Understanding our fits, finding your perfect size, and caring for your garments to ensure they last a lifetime.
          </p>
        </div>
      </section>

      {/* Sizing Chart Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-ink mb-4">General Size Chart</h2>
          <p className="text-sm text-cocoa">Measurements are in inches. Use this as a general guide for all standard clothing.</p>
        </div>
        
        <div className="overflow-x-auto border border-[#000000]/10">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f9f9f9] border-b border-[#000000]/10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/80">
              <tr>
                <th className="px-6 py-4 border-r border-[#000000]/10">Size</th>
                <th className="px-6 py-4">US/CA</th>
                <th className="px-6 py-4">UK/AU</th>
                <th className="px-6 py-4">EU</th>
                <th className="px-6 py-4">Bust</th>
                <th className="px-6 py-4">Waist</th>
                <th className="px-6 py-4 border-l border-[#000000]/10">Hips</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#000000]/10">
              <tr className="hover:bg-[#f9f9f9] transition-colors">
                <td className="px-6 py-4 font-bold border-r border-[#000000]/10">XS</td>
                <td className="px-6 py-4">0-2</td>
                <td className="px-6 py-4">4-6</td>
                <td className="px-6 py-4">32-34</td>
                <td className="px-6 py-4 text-cocoa">31-33"</td>
                <td className="px-6 py-4 text-cocoa">24-25"</td>
                <td className="px-6 py-4 text-cocoa border-l border-[#000000]/10">34-35.5"</td>
              </tr>
              <tr className="hover:bg-[#f9f9f9] transition-colors">
                <td className="px-6 py-4 font-bold border-r border-[#000000]/10">S</td>
                <td className="px-6 py-4">4-6</td>
                <td className="px-6 py-4">8-10</td>
                <td className="px-6 py-4">36-38</td>
                <td className="px-6 py-4 text-cocoa">33.5-35"</td>
                <td className="px-6 py-4 text-cocoa">26-27.5"</td>
                <td className="px-6 py-4 text-cocoa border-l border-[#000000]/10">36-37.5"</td>
              </tr>
              <tr className="hover:bg-[#f9f9f9] transition-colors">
                <td className="px-6 py-4 font-bold border-r border-[#000000]/10">M</td>
                <td className="px-6 py-4">8-10</td>
                <td className="px-6 py-4">12-14</td>
                <td className="px-6 py-4">40-42</td>
                <td className="px-6 py-4 text-cocoa">35.5-37"</td>
                <td className="px-6 py-4 text-cocoa">28-30"</td>
                <td className="px-6 py-4 text-cocoa border-l border-[#000000]/10">38-40"</td>
              </tr>
              <tr className="hover:bg-[#f9f9f9] transition-colors">
                <td className="px-6 py-4 font-bold border-r border-[#000000]/10">L</td>
                <td className="px-6 py-4">12-14</td>
                <td className="px-6 py-4">16-18</td>
                <td className="px-6 py-4">44-46</td>
                <td className="px-6 py-4 text-cocoa">38-40"</td>
                <td className="px-6 py-4 text-cocoa">31-33"</td>
                <td className="px-6 py-4 text-cocoa border-l border-[#000000]/10">41-43"</td>
              </tr>
              <tr className="hover:bg-[#f9f9f9] transition-colors">
                <td className="px-6 py-4 font-bold border-r border-[#000000]/10">XL</td>
                <td className="px-6 py-4">16-18</td>
                <td className="px-6 py-4">20-22</td>
                <td className="px-6 py-4">48-50</td>
                <td className="px-6 py-4 text-cocoa">41-43.5"</td>
                <td className="px-6 py-4 text-cocoa">34-37"</td>
                <td className="px-6 py-4 text-cocoa border-l border-[#000000]/10">44-46.5"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Fit Types */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-[#000000]/10">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-ink mb-4">Understanding Our Fits</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4 text-center">
            <div className="aspect-[3/4] bg-sand mb-6">
               <img src="/images/product-2.webp" alt="Form Fitting" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-widest text-ink">Form-Fitting</h3>
            <p className="text-xs text-cocoa leading-relaxed">
              Designed to sit close to the body, contouring your natural shape. We recommend your true size. If you prefer a bit of breathing room, size up.
            </p>
          </div>
          <div className="space-y-4 text-center">
            <div className="aspect-[3/4] bg-[#ececec] mb-6">
               <img src="/images/product-1.webp" alt="Relaxed Fit" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-widest text-ink">Relaxed Fit</h3>
            <p className="text-xs text-cocoa leading-relaxed">
              Our standard fit. Not too tight, not too loose. Drapes effortlessly. Stick to your true size for the intended aesthetic.
            </p>
          </div>
          <div className="space-y-4 text-center">
            <div className="aspect-[3/4] bg-sand mb-6">
               <img src="/images/product-3.webp" alt="Oversized" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-widest text-ink">Oversized</h3>
            <p className="text-xs text-cocoa leading-relaxed">
              Exaggerated proportions with dropped shoulders and extra volume. Take your normal size for a baggy look, or size down for a standard fit.
            </p>
          </div>
        </div>
      </section>

      {/* Care Guide */}
      <section className="py-24 bg-ink text-canvas px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-widest mb-8">Care Instructions</h2>
            <p className="text-sm text-canvas/70 leading-relaxed mb-6">
              Our garments are constructed from premium fabrics designed to last. Proper care extends their lifespan significantly.
            </p>
            <ul className="space-y-6">
              <li className="flex gap-4 items-start">
                <span className="text-xl">💧</span>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Cold Wash Only</h4>
                  <p className="text-xs text-canvas/50">Machine wash cold with like colors to prevent fading and shrinkage.</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-xl">☀️</span>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Air Dry</h4>
                  <p className="text-xs text-canvas/50">Lay flat to dry. Avoid tumble drying to preserve the shape and fiber integrity.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex flex-col justify-center items-start md:border-l border-canvas/20 md:pl-16">
            <h3 className="text-lg font-bold uppercase tracking-widest mb-4">Need further help?</h3>
            <p className="text-sm text-canvas/70 mb-8">If you're between sizes or need specific garment measurements, our support team is ready to assist.</p>
            <Link to="/help/contact" className="inline-block border border-canvas text-canvas px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-canvas hover:text-ink transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
