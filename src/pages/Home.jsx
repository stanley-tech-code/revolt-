import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCms } from '../context/CmsContext';
import ProductCard from '../components/ui/ProductCard';

export default function Home() {
  const { db } = useCms();
  const content = db?.pages?.home || {};
  const newArrivals = db?.products?.filter(p => p.isNewArrival) || [];

  const handleQuickPurchase = async (e, p) => {
    e.preventDefault();
    e.stopPropagation();
    if (p.stock <= 0) return;
    const randomNames = ['Amelia Clark', 'Charlotte Evans', 'Isabella Hall', 'Mia Jenkins', 'Harper Kelly'];
    const randomCustomer = randomNames[Math.floor(Math.random() * randomNames.length)];
    try {
      const res = await fetch('/api/orders', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ customer: randomCustomer, total: p.price, items: `1x ${p.name}` }) 
      });
      const data = await res.json();
      if (data.success) {
        alert(`✓ Purchase complete!\nOrder #${data.order.id} placed for $${p.price.toFixed(2)}.\nProduct stock decremented & admin dashboard updated in real-time!`);
        window.location.reload();
      }
    } catch (err) { alert('Failed to place storefront checkout order.'); }
  };

  return (
    <main className="w-full overflow-x-hidden relative animate-fade-in" style={{ paddingBottom: '0' }}>
      
      {/* 1. Hero Section */}
      {content.heroVisible !== false && (
        <section className="relative zoomed-h-screen w-full flex items-end justify-start bg-canvas transition-all">
          {content.heroVideo ? (
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
              <source src={content.heroVideo} type="video/mp4" />
            </video>
          ) : (
            <img src={content.heroImage || "/images/hero.webp"} alt="Hero" loading="eager" fetchpriority="high" className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent md:bg-gradient-to-r md:from-ink/20 md:via-transparent md:to-transparent"></div>
          <div className="relative z-10 w-full px-4 md:px-8 lg:px-10 xl:px-12 pt-28 md:pt-32 pb-12 md:pb-16 lg:pb-20">
            <div className="max-w-[550px] relative">
              <h1 className="text-[clamp(1.5rem,4.2vw,2.75rem)] font-bold uppercase mb-2 md:mb-3 text-white leading-[0.95] tracking-tight">{content.heroTitle || 'Refined Luxury Essentials'}</h1>
              <p className="text-base md:text-lg lg:text-xl text-white max-w-[42ch] mb-4 md:mb-5 leading-relaxed">{content.heroDesc || 'Discover the latest collection of premium essentials designed for modern living.'}</p>
              <Link to={content.heroBtnLink || "/new-in/all-new-arrivals"} className="inline-block text-[12px] font-extrabold uppercase tracking-[0.3em] text-white border-b border-white pb-1.5 hover:text-white/80 hover:border-white/80 transition-all duration-300">
                {content.heroBtnText || 'Shop Now'}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 2. Most Wanted Categories Section */}
      {content.productsVisible !== false && (
        <section className="py-6 md:py-8 bg-canvas border-y border-clay/10">
          <div className="w-full px-4 md:px-6 mb-8 flex items-end justify-between">
            <div><h2 className="h2-fluid font-semibold uppercase tracking-tight">{content.productsTitle || "Most Wanted"}</h2></div>
          </div>
          <div className="w-full px-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 w-full">
              {[1, 2, 3, 4].map((num) => (
                <Link to={content[`cat${num}Link`] || "/clothing"} key={num} className="group block w-full text-left">
                  <div className="aspect-[4/5] bg-canvas overflow-hidden relative mb-3">
                    <img loading="lazy" src={content[`cat${num}Image`] || `/images/product-${num}.webp`} alt="Category" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                  </div>
                  <h3 className="text-[10px] md:text-[11px] lg:text-[12px] font-bold uppercase tracking-[0.25em] text-left text-[#000000] navbar-brand-font group-hover:text-[#000000]/70 transition-colors mt-2">
                    {content[`cat${num}Title`] || `Category ${num}`}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Editorial Section (Behind the Design) */}
      {content.editorialVisible !== false && (
        <section className="w-full zoomed-h-screen overflow-hidden bg-canvas transition-all relative">
          <div className="relative w-full h-full group">
            <img loading="lazy" src={content.editorialImage || "/images/editorial-wide.webp"} alt={content.editorialTitle || "Editorial"} className="w-full h-full object-cover transition-transform duration-[8s] group-hover:scale-105" />
            <div className="absolute inset-0 bg-ink/15 flex flex-col items-start justify-end text-left px-6 md:px-10 lg:px-14 pb-8 md:pb-12 lg:pb-16">
              <p className="text-[10px] uppercase tracking-[0.5em] text-canvas mb-3 drop-shadow-sm font-medium">{content.editorialTitle || "Behind the Design"}</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-canvas mb-6 max-w-xl leading-none drop-shadow-md">{content.editorialDesc || "A look into our meticulous design process."}</h2>
              <Link to={content.editorialBtnLink || "/about/our-story"} className="bg-canvas text-ink hover:bg-ink hover:text-canvas text-[9px] font-bold uppercase tracking-[0.4em] px-8 py-3.5 shadow-lg transition-all duration-300 transform active:scale-95 z-10">
                {content.editorialBtnText || "Read More"}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 4. New Arrivals Section */}
      {content.newArrivalsVisible !== false && (
        <section className="py-6 md:py-8 bg-canvas border-y border-clay/10 overflow-hidden">
          <div className="w-full px-4 md:px-6 mb-6 flex items-end justify-between">
            <div><h2 className="h2-fluid font-semibold uppercase tracking-tight">New Arrivals</h2></div>
            <Link to="/new-in/all-new-arrivals" className="text-[9px] font-bold uppercase tracking-[0.4em] text-cocoa hover:text-ink transition-colors border-b border-ink/20 hover:border-ink pb-1">Shop Collection</Link>
          </div>
          <div className="overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing">
            <div className="flex gap-4 px-4">
              {newArrivals.slice(0, 10).map((p) => (
                <div key={p.id} className="shrink-0 w-[60vw] sm:w-[35vw] md:w-[25vw] lg:w-[20vw] xl:w-[16vw]">
                  <ProductCard product={p} onQuickPurchase={handleQuickPurchase} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Curation Section (Curated For You) */}
      {content.curationVisible !== false && (
        <section className="w-full py-6 md:py-8 bg-canvas overflow-hidden">
          <div className="w-full px-2 md:px-4 lg:px-6">
            <div className="mb-6 px-2 md:px-0">
              <h2 className="h2-fluid font-semibold uppercase tracking-tight">{content.curationTitle || "Curated For You"}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-2 md:gap-4 w-full">
              <Link to={content.curationMainLink || "/other/shop-the-collection"} className="relative group overflow-hidden min-h-[500px] md:min-h-[850px]">
                <img src={content.curationMainImage || "/images/campaign-2.webp"} alt="Revolt curation" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3500ms] ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
                  <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-white mb-5">{content.curationMainTitle || "The Lounge Edit"}</p>
                  <span className="inline-block bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] py-4 px-10 transition-all duration-700 group-hover:bg-black group-hover:text-white">Shop Now</span>
                </div>
              </Link>
              <div className="grid grid-cols-1 gap-2 md:gap-4">
                <Link to={content.curationSub1Link || "/other/view"} className="relative group overflow-hidden min-h-[400px]">
                  <img src={content.curationSub1Image || "/images/product-2.webp"} alt="Item" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3500ms] ease-out group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8">
                    <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-white mb-4">{content.curationSub1Title || "Seamless Tops"}</p>
                    <span className="inline-block bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] py-3 px-8 transition-all duration-700 group-hover:bg-black group-hover:text-white">Shop Now</span>
                  </div>
                </Link>
                <Link to={content.curationSub2Link || "/other/view"} className="relative group overflow-hidden min-h-[400px]">
                  <img src={content.curationSub2Image || "/images/product-3.webp"} alt="Item" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3500ms] ease-out group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8">
                    <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-white mb-4">{content.curationSub2Title || "Performance Leggings"}</p>
                    <span className="inline-block bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] py-3 px-8 transition-all duration-700 group-hover:bg-black group-hover:text-white">Shop Now</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. Our Ethos */}
      {content.ethosVisible !== false && (
        <section className="w-full py-24 md:py-32 bg-[#1f1b16] text-[#ffffff] flex flex-col items-center justify-center text-center px-6">
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 uppercase tracking-wider">{content.ethosTitle || "Our Ethos"}</h2>
            <div className="w-12 h-[1px] bg-white/30 mb-8"></div>
            <p className="text-sm md:text-base lg:text-lg text-white/80 max-w-2xl leading-relaxed mb-10 font-serif italic">
              "{content.ethosDesc || 'We believe in uncompromising quality and meticulous design. Every piece is crafted to elevate your daily uniform.'}"
            </p>
            <Link to={content.ethosBtnLink || "/about/our-story"} className="text-[10px] font-bold uppercase tracking-[0.3em] text-white border-b border-white pb-1 hover:text-white/60 hover:border-white/60 transition-colors">
              {content.ethosBtnText || "Read Our Story"}
            </Link>
          </div>
        </section>
      )}

    </main>
  );
}
