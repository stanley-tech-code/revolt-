import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCms } from '../context/CmsContext';
import ProductCard from '../components/ui/ProductCard';

export default function Home() {
  const { db } = useCms();

  const currentUser = null;
  const isEditMode = false;
  const content = db?.pages?.home || {};

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
        body: JSON.stringify({
          customer: randomCustomer,
          total: p.price,
          items: `1x ${p.name}`
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`✓ Purchase complete!\nOrder #${data.order.id} placed for $${p.price.toFixed(2)}.\nProduct stock decremented & admin dashboard updated in real-time!`);
        window.location.reload();
      }
    } catch (err) {
      alert('Failed to place storefront checkout order.');
    }
  };

  const newArrivals = db.products.filter(p => p.isNewArrival);

  return (
    <main className="w-full overflow-x-hidden relative animate-fade-in" style={{ paddingBottom: '0' }}>
      
      {/* Hero Section */}
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

      {/* Featured Category Section */}
      {content.featCatVisible !== false && (
        <section className="w-full py-6 md:py-8 bg-canvas overflow-hidden">
          <div className="w-full px-2 md:px-4 lg:px-6">
            <div className="mb-6 px-2 md:px-0">
              <h2 className="h2-fluid font-semibold uppercase tracking-tight">{content.featCatTitle || "The Essentials"}</h2>
            </div>
            <Link to={content.featCatBtnLink || "/clothing"} className="relative block group overflow-hidden min-h-[500px] md:min-h-[850px]">
              <img src={content.featCatImage || "/images/campaign-2.webp"} alt={content.featCatTitle} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3500ms] ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
                <span className="inline-block bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] py-4 px-10 transition-all duration-700 group-hover:bg-black group-hover:text-white">{content.featCatBtnText || "Explore"}</span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* New Arrivals Section (Dynamic based on Products) */}
      <section className="py-6 md:py-8 bg-canvas border-y border-clay/10 overflow-hidden">
        <div className="w-full px-4 md:px-6 mb-6 flex items-end justify-between">
          <div>
            <h2 className="h2-fluid font-semibold uppercase tracking-tight">New Arrivals</h2>
          </div>
          <Link to="/new-in/all-new-arrivals" className="text-[9px] font-bold uppercase tracking-[0.4em] text-cocoa hover:text-ink transition-colors border-b border-ink/20 hover:border-ink pb-1">Shop Collection</Link>
        </div>
        
        <div className="overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing">
          <div className="flex gap-4 px-4">
            {newArrivals.slice(0, 10).map((p, idx) => (
              <div key={p.id} className="shrink-0 w-[60vw] sm:w-[35vw] md:w-[25vw] lg:w-[20vw] xl:w-[16vw]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Feature Section */}
      {content.editorialVisible !== false && (
        <section className="w-full zoomed-h-screen overflow-hidden bg-canvas transition-all relative">
          <div className="relative w-full h-full group">
            <img 
              loading="lazy" 
              src={content.editorialImage || "/images/editorial-wide.webp"} 
              alt={content.editorialTitle} 
              className="w-full h-full object-cover transition-transform duration-[8s] group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-ink/15 flex flex-col items-start justify-end text-left px-6 md:px-10 lg:px-14 pb-8 md:pb-12 lg:pb-16">
              <p className="text-[10px] uppercase tracking-[0.5em] text-canvas mb-3 drop-shadow-sm font-medium">
                {content.editorialTitle || "Behind the Design"}
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-canvas mb-6 max-w-xl leading-none drop-shadow-md">
                {content.editorialDesc || "A look into our meticulous design process."}
              </h2>
              <Link 
                to={content.editorialBtnLink || "/about/our-story"} 
                className="bg-canvas text-ink hover:bg-ink hover:text-canvas text-[9px] font-bold uppercase tracking-[0.4em] px-8 py-3.5 shadow-lg transition-all duration-300 transform active:scale-95 z-10"
              >
                {content.editorialBtnText || "Read More"}
              </Link>
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
