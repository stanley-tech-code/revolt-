import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCms } from '../context/CmsContext';
import ProductCard from '../components/ui/ProductCard';

export default function Home() {
  const { db } = useCms();

  const currentUser = null;
  const isEditMode = false;
  const hero = db.homepage.hero;
  const sections = db.homepage.sections;

  // Section Component Renderers
  const renderHero = (sec) => {
    return (
      <section 
        className={`relative zoomed-h-screen w-full flex items-end justify-start bg-canvas transition-all ${
          isEditMode ? 'border-2 border-dashed border-clay/60 cursor-pointer hover:border-clay/90' : ''
        }`}
        onClick={() => { if (isEditMode) setEditHeroModal(true); }}
        title={isEditMode ? "Double click to edit Hero content" : ""}
      >
        {hero.useVideo ? (
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src={hero.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <img src="/images/hero.jpg" alt="Model in Revolt set" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent md:bg-gradient-to-r md:from-ink/20 md:via-transparent md:to-transparent"></div>
        <div className="relative z-10 w-full px-4 md:px-8 lg:px-10 xl:px-12 pt-28 md:pt-32 pb-12 md:pb-16 lg:pb-20">
          <div className="max-w-[550px] relative">
            
            {isEditMode && (
              <span className="absolute -top-12 left-0 bg-ink text-canvas text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded shadow">
                ✏️ Hero (Click to Edit Wording)
              </span>
            )}

            <h1 className="text-[clamp(1.5rem,4.2vw,2.75rem)] font-bold uppercase mb-2 md:mb-3 text-white leading-[0.95] tracking-tight">{hero.title}</h1>
            <p className="text-base md:text-lg lg:text-xl text-white max-w-[42ch] mb-4 md:mb-5 leading-relaxed">{hero.description}</p>
            <Link to="/other/shop-the-collection" className="inline-block text-[12px] font-extrabold uppercase tracking-[0.3em] text-white border-b border-white pb-1.5 hover:text-white/80 hover:border-white/80 transition-all duration-300">
              {hero.buttonText}
            </Link>
          </div>
        </div>
      </section>
    );
  };

  const renderTextBlock = (sec) => {
    return (
      <section 
        className={`py-12 md:py-16 bg-canvas border-t border-clay/10 transition-all ${
          isEditMode ? 'border-2 border-dashed border-clay/60 cursor-pointer hover:border-clay/90' : ''
        }`}
        onClick={() => { if (isEditMode) triggerInlineEdit(sec); }}
      >
        <div className="w-full px-4 md:px-6 text-center relative">
          
          {isEditMode && (
            <span className="absolute top-2 left-1/2 -translate-x-1/2 bg-ink text-canvas text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded shadow">
              ✏️ Ethos Block (Click to Edit)
            </span>
          )}

          <div className="w-full">
            <h2 className="h2-fluid font-semibold uppercase mb-6 tracking-[-0.04em] leading-[0.9]">{sec.title}</h2>
            <p className="text-base md:text-lg lg:text-xl text-[#000000] max-w-xl mx-auto leading-relaxed font-bold uppercase tracking-wider">{sec.text}</p>
          </div>
        </div>
      </section>
    );
  };

  const renderCuration = (sec) => {
    return (
      <section className="w-full py-6 md:py-8 bg-canvas overflow-hidden">
        <div className="w-full px-2 md:px-4 lg:px-6">
          <div className="mb-6 px-2 md:px-0">
            <h2 className="h2-fluid font-semibold uppercase tracking-tight">Curated For You</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-2 md:gap-4 w-full">
            {/* Left Column */}
            <Link to={sec.mainItem?.link || "/other/shop-the-collection"} className="relative group overflow-hidden min-h-[500px] md:min-h-[850px]">
              <img src={sec.mainItem?.image || "/images/campaign-2.jpg"} alt={sec.mainItem?.title || "Revolt curation"} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3500ms] ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
                <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-white mb-5">{sec.mainItem?.title || "The Lounge Edit"}</p>
                <span className="inline-block bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] py-4 px-10 transition-all duration-700 group-hover:bg-black group-hover:text-white">Shop Now</span>
              </div>
            </Link>

            {/* Right Column */}
            <div className="grid grid-cols-1 gap-2 md:gap-4">
              {sec.subItems?.map((item, idx) => (
                <Link key={idx} to={item.link} className="relative group overflow-hidden min-h-[400px]">
                  <img src={item.image} alt={item.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3500ms] ease-out group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8">
                    <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-white mb-4">{item.title}</p>
                    <span className="inline-block bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] py-3 px-8 transition-all duration-700 group-hover:bg-black group-hover:text-white">Shop Now</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderProducts = (sec) => {
    // Dynamically fetch requested categories from the section object
    const mostWantedCategories = sec.categories || [];

    return (
      <section className="py-6 md:py-8 bg-canvas border-y border-clay/10">
        <div className="w-full px-4 md:px-6 mb-8 flex items-end justify-between">
          <div>
            <h2 className="h2-fluid font-semibold uppercase tracking-tight">{sec.title || "Most Wanted"}</h2>
          </div>
        </div>
        
        <div className="w-full px-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 w-full">
            {mostWantedCategories.map((cat, idx) => (
              <Link 
                to={cat.link} 
                key={idx} 
                className="group block w-full text-left"
              >
                <div className="aspect-[4/5] bg-canvas overflow-hidden relative mb-3">
                  <img 
                    loading="lazy" 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" 
                  />
                </div>
                <h3 className="text-[10px] md:text-[11px] lg:text-[12px] font-bold uppercase tracking-[0.25em] text-left text-[#000000] navbar-brand-font group-hover:text-[#000000]/70 transition-colors mt-2">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderNewArrivals = (sec) => {
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
          window.location.reload(); // Refresh to update live storefront stock state
        }
      } catch (err) {
        alert('Failed to place storefront checkout order.');
      }
    };

    // Dynamically fetch from db.products
    const newArrivals = db.products.filter(p => p.isNewArrival);

    return (
      <section className="py-6 md:py-8 bg-canvas border-y border-clay/10 overflow-hidden">
        <div className="w-full px-4 md:px-6 mb-6 flex items-end justify-between">
          <div>
            <h2 className="h2-fluid font-semibold uppercase tracking-tight">{sec.title || "New Arrivals"}</h2>
          </div>
          <Link to="/new-in/new-in" className="text-[9px] font-bold uppercase tracking-[0.4em] text-cocoa hover:text-ink transition-colors border-b border-ink/20 hover:border-ink pb-1">Shop Collection</Link>
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
    );
  };

  const renderNewsletter = (sec) => {
    return (
      <section 
        className={`py-6 md:py-8 bg-sand/30 border-t border-clay/10 text-center transition-all ${
          isEditMode ? 'border-2 border-dashed border-clay/60 cursor-pointer hover:border-clay/90' : ''
        }`}
        onClick={() => { if (isEditMode) triggerInlineEdit(sec); }}
      >
        <div className="max-w-2xl mx-auto px-4 relative">
          
          {isEditMode && (
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-ink text-canvas text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded shadow">
              ✏️ Newsletter (Click to Edit)
            </span>
          )}

          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-4">{sec.title}</h2>
          <p className="text-sm text-cocoa mb-6 max-w-md mx-auto leading-relaxed">{sec.text}</p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto justify-center">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-4 py-3 bg-canvas border border-clay/40 rounded text-xs focus:outline-none focus:border-ink flex-1"
            />
            <button className="bg-ink text-canvas py-3 px-8 text-[9px] uppercase tracking-wider font-bold hover:bg-cocoa transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    );
  };

  const renderTestimonials = (sec) => {
    return (
      <section 
        className={`py-6 md:py-8 bg-canvas border-t border-clay/10 text-center transition-all ${
          isEditMode ? 'border-2 border-dashed border-clay/60 cursor-pointer hover:border-clay/90' : ''
        }`}
        onClick={() => { if (isEditMode) triggerInlineEdit(sec); }}
      >
        <div className="max-w-3xl mx-auto px-4 relative">
          {isEditMode && (
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-ink text-canvas text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded shadow">
              ✏️ Testimonials (Click to Edit)
            </span>
          )}
          <span className="text-[24px] text-clay">“</span>
          <p className="text-base md:text-lg font-serif italic text-cocoa max-w-xl mx-auto mb-4">{sec.text}</p>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-ink">{sec.title}</span>
        </div>
      </section>
    );
  };

  const renderFaq = (sec) => {
    return (
      <section 
        className={`py-6 md:py-8 bg-canvas border-y border-clay/10 transition-all ${
          isEditMode ? 'border-2 border-dashed border-clay/60 cursor-pointer hover:border-clay/90' : ''
        }`}
        onClick={() => { if (isEditMode) triggerInlineEdit(sec); }}
      >
        <div className="max-w-2xl mx-auto px-4 relative">
          {isEditMode && (
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-ink text-canvas text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded shadow">
              ✏️ FAQ Section (Click to Edit)
            </span>
          )}
          <h2 className="text-center text-sm font-bold uppercase tracking-widest mb-8">{sec.title}</h2>
          <div className="flex flex-col gap-4 text-left">
            <div className="border-b border-clay/20 pb-3">
              <h4 className="text-[12px] font-bold uppercase text-ink">What is the return policy?</h4>
              <p className="text-[11px] text-cocoa mt-1">{sec.text}</p>
            </div>
            <div className="border-b border-clay/20 pb-3">
              <h4 className="text-[12px] font-bold uppercase text-ink">How do I choose my size?</h4>
              <p className="text-[11px] text-cocoa mt-1">Please refer to our Size Guide located in the help page for detailed instructions.</p>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderContact = (sec) => {
    return (
      <section 
        className={`py-6 md:py-8 bg-sand/20 border-t border-clay/10 text-center transition-all ${
          isEditMode ? 'border-2 border-dashed border-clay/60 cursor-pointer hover:border-clay/90' : ''
        }`}
        onClick={() => { if (isEditMode) triggerInlineEdit(sec); }}
      >
        <div className="max-w-2xl mx-auto px-4 relative">
          {isEditMode && (
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-ink text-canvas text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded shadow">
              ✏️ Contact Block (Click to Edit)
            </span>
          )}
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4">{sec.title}</h2>
          <p className="text-xs text-cocoa mb-6">{sec.text}</p>
          <div className="flex justify-center gap-4 text-[11px] font-bold uppercase tracking-wide text-ink">
            <span>Instagram: @revolt_uniform</span>
            <span>Support: support@revolt.com</span>
          </div>
        </div>
      </section>
    );
  };

  const renderEditorial = (sec) => {
    return (
      <section 
        className={`w-full zoomed-h-screen overflow-hidden bg-canvas transition-all relative ${
          isEditMode ? 'border-2 border-dashed border-clay/60 cursor-pointer hover:border-clay/90' : ''
        }`}
        onClick={() => { if (isEditMode) triggerInlineEdit(sec); }}
        title={isEditMode ? "Click to edit Editorial Banner details" : ""}
      >
        <div className="relative w-full h-full group">
          {isEditMode && (
            <span className="absolute top-2 left-1/2 -translate-x-1/2 bg-ink text-canvas text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded shadow z-10">
              ✏️ Editorial Campaign (Click to Edit)
            </span>
          )}
          
          {/* Zooming background image */}
          <img 
            loading="lazy" 
            src={sec.image || "/images/editorial-wide.jpg"} 
            alt={sec.title || "Campaign Banner"} 
            className="w-full h-full object-cover transition-transform duration-[8s] group-hover:scale-105" 
          />

          {/* Left-aligned Luxury CTA Text & Button Overlay in Bottom Left */}
          <div className="absolute inset-0 bg-ink/15 flex flex-col items-start justify-end text-left px-6 md:px-10 lg:px-14 pb-8 md:pb-12 lg:pb-16">
            <p className="text-[10px] uppercase tracking-[0.5em] text-canvas mb-3 drop-shadow-sm font-medium">
              {sec.title || "Volume 01 Campaign"}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-canvas mb-6 max-w-xl leading-none drop-shadow-md">
              {sec.text || "Technical Layers for Maximum Support"}
            </h2>
            <Link 
              to="/other/view-all" 
              className="bg-canvas text-ink hover:bg-ink hover:text-canvas text-[9px] font-bold uppercase tracking-[0.4em] px-8 py-3.5 shadow-lg transition-all duration-300 transform active:scale-95 z-10"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </section>
    );
  };

  const componentMap = {
    hero: renderHero,
    'text-block': renderTextBlock,
    curation: renderCuration,
    products: renderProducts,
    newsletter: renderNewsletter,
    testimonials: renderTestimonials,
    faq: renderFaq,
    contact: renderContact,
    editorial: renderEditorial,
    'new-arrivals': renderNewArrivals
  };

  return (
    <main className="w-full overflow-x-hidden relative" style={{ paddingBottom: currentUser ? '60px' : '0' }}>
      
      {/* Dynamic Sections rendering */}
      {sections.map(sec => {
        if (!sec.active && !isEditMode) return null;
        const renderer = componentMap[sec.type];
        if (!renderer) return null;

        return (
          <div 
            key={sec.id} 
            className={`relative ${!sec.active && isEditMode ? 'opacity-30 border border-red-300' : ''}`}
          >
            {!sec.active && isEditMode && (
              <span className="absolute top-2 left-2 z-50 bg-red-600 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded">
                Inactive Draft Block
              </span>
            )}
            {renderer(sec)}
          </div>
        );
      })}



    </main>
  );
}
