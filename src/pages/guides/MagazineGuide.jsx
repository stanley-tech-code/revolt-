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
      {heroVisible ? (
        <Link to={data.heroBtnLink || "/bras/all-bras"} className="group block relative w-full zoomed-h-screen overflow-hidden bg-stone-100 transition-all">
          {data.heroVideo ? (
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
              <source src={data.heroVideo} type="video/mp4" />
            </video>
          ) : data.heroImage ? (
            <picture className="absolute inset-0 w-full h-full">
              {data.heroImageMobile && (
                <source media="(max-width: 767px)" srcSet={data.heroImageMobile} />
              )}
              <img src={data.heroImage} alt={data.heroTitle} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
            </picture>
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500"></div>
          <div className="absolute bottom-0 left-0 w-full px-6 md:px-8 xl:px-12 pb-12 md:pb-16 flex flex-col items-start text-left">
            <div className="max-w-[700px] relative">
              {data.heroEyebrow && (
                <span className="text-[10px] uppercase tracking-[0.5em] font-medium mb-3 block text-white drop-shadow-sm">
                  {data.heroEyebrow}
                </span>
              )}
              <h1 className="text-[clamp(1.5rem,4.2vw,2.75rem)] font-bold uppercase mb-2 md:mb-3 text-white leading-[0.95] tracking-tight">{data.heroTitle}</h1>
              {data.heroDesc && (
                <p className="text-base md:text-lg lg:text-xl text-white max-w-[42ch] mb-4 md:mb-6 leading-relaxed">{data.heroDesc}</p>
              )}
              <span className="inline-block bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] py-3.5 px-8 transition-all duration-500 group-hover:bg-black group-hover:text-white mt-2">
                {data.heroBtnText || 'Shop Now'}
              </span>
            </div>
          </div>
        </Link>
      ) : null}

      {/* DYNAMIC CATEGORY BLOCKS */}
      <div className="w-full">
        {(() => {
            const visibleCategories = categories.filter(c => c.visible !== false);
            const chunks = [];
            for (let i = 0; i < visibleCategories.length; i += 2) {
              chunks.push(visibleCategories.slice(i, i + 2));
            }
            
            return chunks.map((pair, idx) => {
              const isReversed = idx % 2 !== 0;

              return (
                <React.Fragment key={idx}>
                  <section className="w-full px-4 md:px-8 xl:px-12 pt-[26px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:min-h-[620px]">
                      {pair.map((category, pIdx) => {
                         const isFirstItem = pIdx === 0;
                         // Mobile order: Image always first
                         const mobileImgOrder = isFirstItem ? "order-1" : "order-3";
                         const mobileTextOrder = isFirstItem ? "order-2" : "order-4";
                         
                         // Desktop order
                         let deskImgOrder, deskTextOrder;
                         if (isReversed) {
                           // Odd section: Text Left, Image Right
                           deskImgOrder = isFirstItem ? "md:order-2" : "md:order-4";
                           deskTextOrder = isFirstItem ? "md:order-1" : "md:order-3";
                         } else {
                           // Even section: Image Left, Text Right
                           deskImgOrder = isFirstItem ? "md:order-1" : "md:order-3";
                           deskTextOrder = isFirstItem ? "md:order-2" : "md:order-4";
                         }

                         // 1px divider between stacked items
                         const borderDivider = isFirstItem ? 'md:border-b md:border-gray-200' : '';

                         return (
                           <React.Fragment key={pIdx}>
                             {/* IMAGE POSTER */}
                             <Link to={category.productLink || "/bras/all-bras"} className={`group block w-full h-[320px] md:h-[310px] relative bg-stone-100 overflow-hidden ${mobileImgOrder} ${deskImgOrder} ${borderDivider}`}>
                               <img src={category.mainImage} alt={category.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                             </Link>

                             {/* TEXT PANEL */}
                             <div className={`w-full h-auto md:h-[310px] flex flex-col justify-center py-[16px] px-[16px] md:pt-[36px] md:pb-[36px] md:px-[44px] bg-white ${mobileTextOrder} ${deskTextOrder} ${borderDivider}`}>
                               <h2 className="text-[16px] md:text-2xl lg:text-3xl font-semibold uppercase tracking-tight text-black mb-1.5 md:mb-4">{category.label}</h2>
                               
                               <p className="text-[12px] md:text-base lg:text-lg text-gray-700 leading-tight md:leading-relaxed mb-3 md:mb-6">
                                 {category.copyDesc || category.desc}
                               </p>
                               
                               <div className="w-full max-w-sm">
                                 <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.5em] mb-1.5 md:mb-3 text-black border-b border-gray-100 pb-1 md:pb-2">Guide</h3>
                                 <ul className="text-[11px] md:text-[13px] text-gray-700 space-y-1.5 md:space-y-3 text-left mt-2 md:mt-4">
                                   {category.icon1Value && (
                                     <li className="flex justify-between items-center">
                                       <span className="font-semibold text-black uppercase tracking-wider text-[9px] md:text-[11px]">{category.icon1Label || 'Detail 1'}</span> 
                                       <span>{category.icon1Value}</span>
                                     </li>
                                   )}
                                   {category.icon2Value && (
                                     <li className="flex justify-between items-center border-t border-gray-50 pt-1 md:pt-2">
                                       <span className="font-semibold text-black uppercase tracking-wider text-[9px] md:text-[11px]">{category.icon2Label || 'Detail 2'}</span> 
                                       <span>{category.icon2Value}</span>
                                     </li>
                                   )}
                                   {category.icon3Value && (
                                     <li className="flex justify-between items-center border-t border-gray-50 pt-1 md:pt-2">
                                       <span className="font-semibold text-black uppercase tracking-wider text-[9px] md:text-[11px]">{category.icon3Label || 'Detail 3'}</span> 
                                       <span>{category.icon3Value}</span>
                                     </li>
                                   )}
                                 </ul>
                               </div>
                             </div>
                           </React.Fragment>
                         );
                      })}
                    </div>
                  </section>

                  {/* Full-screen banner (only after Section 1, which is idx 0) */}
                  {idx === 0 && (
                    <Link to={data.promoBtnLink || "/bras/all-bras"} className="group block w-full zoomed-h-screen relative overflow-hidden bg-stone-100 mt-[26px]">
                      <img 
                        src={data.promoBanner || "/images/campaign-2.webp"} 
                        alt="Campaign Banner" 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-colors duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-full px-6 md:px-8 xl:px-12 pb-12 md:pb-16 flex flex-col items-start text-left">
                        <div className="max-w-[700px] relative">
                          {data.promoEyebrow && (
                            <span className="text-[10px] uppercase tracking-[0.5em] font-medium mb-3 block text-white drop-shadow-sm">
                              {data.promoEyebrow}
                            </span>
                          )}
                          <h2 className="text-[clamp(1.5rem,4.2vw,2.75rem)] font-bold uppercase mb-2 md:mb-3 text-white leading-[0.95] tracking-tight">
                            {data.promoTitle || 'The Edit'}
                          </h2>
                          {data.promoDesc && (
                            <p className="text-base md:text-lg lg:text-xl text-white max-w-[42ch] mb-4 md:mb-6 leading-relaxed">
                              {data.promoDesc}
                            </p>
                          )}
                          <span className="inline-block bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] py-3.5 px-8 transition-all duration-500 group-hover:bg-black group-hover:text-white mt-2">
                            {data.promoBtnText || 'Shop Now'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )}
                </React.Fragment>
              );
            });
          })()}
    </div>

      {/* SHOP BY SECTION */}
      {shopByVisible && shopByCards.length > 0 && (
        <section className="py-[40px] md:py-[60px] w-full max-w-[1600px] mx-auto overflow-hidden">
          <h2 className="h2-fluid font-semibold uppercase tracking-tight text-left mb-[24px] md:mb-[36px] text-black px-4 md:px-[44px]">
            {data.shopByTitle || 'Shop By'}
          </h2>
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-[16px] pb-4 px-4 md:px-[44px] md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-x-visible md:pb-0">
            {shopByCards.map((card, idx) => {
              if (card.visible === false) return null;
              return (
                <Link key={idx} to={card.link || '#'} className="snap-start flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-auto group block relative overflow-hidden h-[260px] bg-stone-100">
                  {card.image && (
                     <img 
                      src={card.image} 
                      alt={card.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-2">{card.title}</h3>
                    <p className="text-xs md:text-sm opacity-90 mb-4 md:mb-6 leading-relaxed">{card.desc}</p>
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] border-b border-white pb-1 w-max opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
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
