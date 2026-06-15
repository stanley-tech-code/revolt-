import React from 'react';
import { Link } from 'react-router-dom';
import { useCms } from '../../context/CmsContext';
import { GUIDE_DEFAULTS } from '../../data/guideDefaults';

const IconLine = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-black py-2">
    <span className="text-xs uppercase tracking-widest font-bold">{label}</span>
    <span className="text-sm font-serif">{value}</span>
  </div>
);

const MagazineGuide = ({ pageKey }) => {
  const { db } = useCms();
  const content = db.pages?.[pageKey] || {};
  const defaults = GUIDE_DEFAULTS[pageKey] || {};

  // Merge content with defaults
  const data = { ...defaults, ...content };

  const heroVisible = data.heroVisible !== false;
  const shopByVisible = data.shopByVisible !== false;

  const categories = Array.isArray(data.categories) ? data.categories : (defaults.categories || []);
  const shopByCards = Array.isArray(data.shopByCards) ? data.shopByCards : (defaults.shopByCards || []);

  return (
    <div className="bg-white text-black min-h-screen">
      {/* HERO SECTION */}
      {heroVisible && (
        <>
          <section className={`relative w-full ${pageKey === 'braFitGuide' ? 'h-screen' : 'h-[90vh] md:h-[80vh]'} bg-stone-100 overflow-hidden`}>
            {data.heroVideo ? (
              <video 
                src={data.heroVideo} 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : data.heroImage ? (
              <picture className="absolute inset-0 w-full h-full">
                {data.heroImageMobile && (
                  <source media="(max-width: 767px)" srcSet={data.heroImageMobile} />
                )}
                <img 
                  src={data.heroImage} 
                  alt={data.heroTitle} 
                  className="w-full h-full object-cover"
                />
              </picture>
            ) : null}
          </section>

          {/* TEXT BLOCK BELOW IMAGE */}
          <section className="w-full bg-white flex flex-col items-center text-center px-6 py-12">
            {data.heroEyebrow && (
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 text-[#888] block">
                {data.heroEyebrow}
              </span>
            )}
            <h1 className="text-[28px] md:text-[48px] font-serif tracking-normal leading-tight mb-4 text-black">
              {data.heroTitle}
            </h1>
            {data.heroDesc && (
              <p className="text-[17px] text-[#888] max-w-[560px] mx-auto leading-[1.5]">
                {data.heroDesc}
              </p>
            )}
          </section>
        </>
      )}

      {/* DYNAMIC CATEGORY BLOCKS */}
      {categories.map((category, idx) => {
        if (category.visible === false) return null;
        
        // Alternate layout: even indexes have image on left, odd have image on right
        const isReversed = idx % 2 !== 0;

        return (
          <section key={idx} className="border-b border-black">
            {/* Category Header */}
            <div className="border-b border-black px-6 md:px-12 py-8 md:py-12 text-center">
              <h2 className="text-3xl md:text-5xl font-serif mb-3 uppercase tracking-wide">
                {category.label}
              </h2>
              {category.desc && (
                <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                  {category.desc}
                </p>
              )}
            </div>

            {/* Split Grid */}
            <div className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
              
              {/* Main Editorial Media */}
              <div className="w-full md:w-3/5 border-b md:border-b-0 border-black flex-shrink-0 relative h-[60vh] md:h-[90vh]">
                {category.mainVideo ? (
                  <video 
                    src={category.mainVideo} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : category.mainImage ? (
                  <img 
                    src={category.mainImage} 
                    alt={category.label} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-stone-100" />
                )}
              </div>

              {/* Detail / Microcopy Column */}
              <div className={`w-full md:w-2/5 flex flex-col ${isReversed ? 'md:border-r border-black' : 'md:border-l border-black'}`}>
                
                {/* Copy Block */}
                <div className="p-8 md:p-12 border-b border-black">
                  <h3 className="text-2xl md:text-3xl font-serif mb-4">
                    {category.copyTitle}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-800">
                    {category.copyDesc}
                  </p>
                </div>

                {/* Icons / Details */}
                <div className="p-8 md:p-12 border-b border-black bg-stone-50">
                  <div className="space-y-4 border-t border-black pt-4">
                    {category.icon1Label && <IconLine label={category.icon1Label} value={category.icon1Value} />}
                    {category.icon2Label && <IconLine label={category.icon2Label} value={category.icon2Value} />}
                    {category.icon3Label && <IconLine label={category.icon3Label} value={category.icon3Value} />}
                  </div>
                </div>

                {/* Featured Product Card */}
                <div className="p-8 md:p-12 flex-grow flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-stone-50 transition-colors">
                  <div className="w-48 h-64 md:w-56 md:h-72 mb-6 overflow-hidden bg-stone-100">
                    {category.productImage && (
                      <img 
                        src={category.productImage} 
                        alt={category.productName} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    )}
                  </div>
                  <h4 className="text-lg font-bold uppercase tracking-widest mb-2">
                    {category.productName}
                  </h4>
                  <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider">
                    {category.productDesc}
                  </p>
                  {category.productLink && (
                    <Link 
                      to={category.productLink}
                      className="text-[10px] font-bold uppercase tracking-[0.2em] border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors"
                    >
                      Shop The Style
                    </Link>
                  )}
                </div>

              </div>
            </div>
          </section>
        );
      })}

      {/* SHOP BY SECTION */}
      {shopByVisible && shopByCards.length > 0 && (
        <section className="py-20 px-6 md:px-12 max-w-[1600px] mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif text-center mb-16">
            {data.shopByTitle || 'Shop By'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {shopByCards.map((card, idx) => {
              if (card.visible === false) return null;
              return (
                <Link key={idx} to={card.link || '#'} className="group block relative overflow-hidden h-[400px] bg-stone-100">
                  {card.image && (
                    <img 
                      src={card.image} 
                      alt={card.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <h3 className="text-2xl font-serif mb-2">{card.title}</h3>
                    <p className="text-sm opacity-90 mb-6">{card.desc}</p>
                    <span className="text-[10px] font-bold uppercase tracking-widest border-b border-white pb-1 w-max opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {card.btnText || 'Shop Now'}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default MagazineGuide;
