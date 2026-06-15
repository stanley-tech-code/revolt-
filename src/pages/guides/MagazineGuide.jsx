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
      {heroVisible && pageKey === 'braFitGuide' ? (
        <Link to={data.heroBtnLink || "/bras/all-bras"} className="block relative w-full zoomed-h-screen flex items-center justify-center bg-stone-100 transition-all text-center overflow-hidden">
          {data.heroVideo ? (
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
              <source src={data.heroVideo} type="video/mp4" />
            </video>
          ) : data.heroImage ? (
            <picture className="absolute inset-0 w-full h-full">
              {data.heroImageMobile && (
                <source media="(max-width: 767px)" srcSet={data.heroImageMobile} />
              )}
              <img src={data.heroImage} alt={data.heroTitle} className="absolute inset-0 w-full h-full object-cover" />
            </picture>
          ) : null}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500"></div>
          <div className="relative z-10 w-full px-6 flex flex-col items-center">
            <div className="max-w-[700px] relative">
              {data.heroEyebrow && (
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 block text-white">
                  {data.heroEyebrow}
                </span>
              )}
              <h1 className="text-[28px] md:text-[48px] font-sans font-bold uppercase mb-4 text-white leading-tight tracking-wide">{data.heroTitle}</h1>
              {data.heroDesc && (
                <p className="text-base md:text-lg text-white max-w-[560px] mx-auto leading-relaxed font-sans">{data.heroDesc}</p>
              )}
            </div>
          </div>
        </Link>
      ) : heroVisible && (
        <>
          <section className="relative w-full h-[90vh] md:h-[80vh] bg-stone-100 overflow-hidden">
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
      <div className="w-full">
        {pageKey === 'braFitGuide' ? (
          (() => {
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
                               <h2 className="text-[16px] md:text-3xl font-sans font-bold mb-1.5 md:mb-4 uppercase tracking-wide text-black">{category.label}</h2>
                               
                               <p className="text-[12px] md:text-[14px] text-gray-700 leading-tight md:leading-relaxed font-sans mb-3 md:mb-6">
                                 {category.copyDesc || category.desc}
                               </p>
                               
                               <div className="w-full max-w-sm">
                                 <h3 className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5 md:mb-3 text-black border-b border-gray-100 pb-1 md:pb-2 font-sans">Guide</h3>
                                 <ul className="text-[11px] md:text-[13px] text-gray-700 space-y-1.5 md:space-y-3 font-sans text-left mt-2 md:mt-4">
                                   {category.icon1Value && (
                                     <li className="flex justify-between items-center">
                                       <span className="font-semibold text-black uppercase tracking-wider text-[9px] md:text-[11px]">Coverage Level</span> 
                                       <span>{category.icon1Value}</span>
                                     </li>
                                   )}
                                   {category.icon2Value && (
                                     <li className="flex justify-between items-center border-t border-gray-50 pt-1 md:pt-2">
                                       <span className="font-semibold text-black uppercase tracking-wider text-[9px] md:text-[11px]">Support Level</span> 
                                       <span>{category.icon2Value}</span>
                                     </li>
                                   )}
                                   {category.icon3Value && (
                                     <li className="flex justify-between items-center border-t border-gray-50 pt-1 md:pt-2">
                                       <span className="font-semibold text-black uppercase tracking-wider text-[9px] md:text-[11px]">Fabric Details</span> 
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
                    <Link to={data.promoBtnLink || "/bras/all-bras"} className="group block w-full zoomed-h-screen relative overflow-hidden bg-stone-100 flex flex-col justify-center items-center mt-[26px]">
                      <img 
                        src={data.promoBanner || "/images/campaign-2.webp"} 
                        alt="Campaign Banner" 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
                    </Link>
                  )}
                </React.Fragment>
              );
            });
          })()
        ) : (
          categories.map((category, idx) => {
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
      })
    )}
    </div>

      {/* SHOP BY SECTION */}
      {shopByVisible && shopByCards.length > 0 && (
        <section className="py-[40px] md:py-[60px] w-full max-w-[1600px] mx-auto overflow-hidden">
          <h2 className="text-3xl md:text-5xl font-sans font-bold text-center mb-[24px] md:mb-[36px] uppercase tracking-wide text-black px-4 md:px-[44px]">
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
                    <h3 className="text-xl md:text-2xl font-sans font-bold mb-2 uppercase">{card.title}</h3>
                    <p className="text-xs md:text-sm opacity-90 mb-4 md:mb-6">{card.desc}</p>
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
