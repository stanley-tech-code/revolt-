import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCms } from '../context/CmsContext';
import { allNewArrivalsData } from '../data/newArrivalsData';

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
        <div className="relative z-10 w-full px-4 md:px-8 lg:px-10 
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
