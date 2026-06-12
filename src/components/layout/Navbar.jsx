import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useCms } from '../../context/CmsContext';

export default function Navbar({ onMenuToggle, isMenuOpen }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { openCart, openSearch, getCartCount, wishlist } = useStore();
  const { db } = useCms();
  const navContent = db?.pages?.navbar || {};
  const isTransparentPage = location.pathname === '/' || location.pathname === '/clothing/clothing';

  useEffect(() => {
    const handleScroll = () => {
      if (!isTransparentPage) {
        // Inner pages require a persistent solid background for readability over content scrolling
        setIsScrolled(true);
        return;
      }

      setIsScrolled(window.scrollY > 20);
    };

    // Trigger initially and on scroll/resize
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isTransparentPage]);

  // Determine if the navbar should show the solid background
  const showSolid = isScrolled || isHovered || isMenuOpen;

  return (
    <>
      <header 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-full z-[100] relative transition-all duration-300 ease-in-out ${
          showSolid 
            ? `bg-canvas text-ink ${isHovered ? "" : "border-b border-clay/15"}` 
            : "bg-transparent text-canvas border-transparent"
        } h-12 md:h-12`}
      >
        {/* Subtle top-down gradient for readability when transparent */}
        {!showSolid && (
          <div className="absolute inset-0 bg-gradient-to-b from-ink/20 to-transparent pointer-events-none -z-10"></div>
        )}

      <div className="w-full px-4 md:px-6 lg:px-8 h-full flex items-center justify-between">
        
        <Link to="/" className="md:hidden flex items-center h-full -ml-1">
          <img src="/images/logo.webp?v=2" alt="Revolt" className={`h-[64px] w-auto object-contain transition-all duration-500 ${showSolid ? "brightness-0" : "brightness-0 invert drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"}`} />
        </Link>

        {/* Desktop Left: Logo & Nav Links */}
        <div className="hidden md:flex items-center h-full">
          <Link to="/" className="flex items-center h-full -ml-4 -mr-8">
            <img src="/images/logo.webp?v=2" alt="Revolt" className={`h-[110px] w-auto object-contain transition-all duration-500 ${showSolid ? "brightness-0" : "brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"}`} />
          </Link>
          <nav className="flex items-center h-full">
            
            {/* MEGA MENU: NEW IN */}
            <div className="group h-full flex items-center">
              <Link to="/new-in/new-in" className={`px-2 lg:px-3 xl:px-4 text-[13px] xl:text-[14px] font-bold uppercase tracking-[0.02em] navbar-brand-font transition-colors duration-500 h-full flex items-center ${
                showSolid ? "text-[#000000] hover:text-[#000000]/70" : "text-[#FAF9F6] hover:text-[#FAF9F6]/80"
              }`}>New In</Link>
              <div className="mega-menu-panel absolute left-0 top-full w-full hidden group-hover:block bg-canvas border-b border-clay/15 shadow-lg animate-in fade-in duration-150 before:absolute before:-top-8 before:left-0 before:w-full before:h-8 before:content-['']">
                <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
                  <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8 lg:gap-12">
                    {/* Left: Featured */}
                    <div className="col-span-3 flex flex-col gap-4">
                      <div className="flex flex-col gap-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-ink">Featured</h4>
                        <div className="flex flex-col gap-2.5">
                          <Link to="/new-in/all-new-arrivals" className="text-[13px] text-cocoa hover:text-ink transition-colors">All New Arrivals</Link>
                          <Link to="/new-in/the-editorial-edit" className="text-[13px] text-cocoa hover:text-ink transition-colors">The Editorial Edit</Link>
                          <Link to="/new-in/trend-guide" className="text-[13px] text-cocoa hover:text-ink transition-colors">Trend Guide</Link>
                        </div>
                      </div>
                    </div>
                    {/* Middle: Categories */}
                    <div className="col-span-5 flex flex-col gap-4">
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-ink">Categories</h4>
                      <div className="grid grid-cols-2 gap-y-2.5 gap-x-12">
                        <Link to="/new-in/all-new-arrivals" className="text-[13px] text-cocoa hover:text-ink transition-colors">All New Arrivals</Link>
                        <Link to="/new-in/back-in-stock" className="text-[13px] text-cocoa hover:text-ink transition-colors">Back in Stock</Link>
                        <Link to="/new-in/coming-soon" className="text-[13px] text-cocoa hover:text-ink transition-colors">Coming Soon</Link>
                        <Link to="/new-in/pre-order" className="text-[13px] text-cocoa hover:text-ink transition-colors">Pre-Order</Link>
                      </div>
                    </div>
                    {/* Right: Promo */}
                    <div className="col-span-4 pl-12 border-l border-clay/20">
                      <div className="group/promo block cursor-default">
                        <div className="aspect-[16/10] bg-sand mb-3 overflow-hidden">
                          <img loading="lazy" src={navContent.newInImage || "/images/campaign-1.webp"} alt="Campaign" className="w-full h-full object-cover transition-transform duration-700 group-hover/promo:scale-105" />
                        </div>
                        <h5 className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink mb-2">{navContent.newInTitle || "Volume 02 Preview"}</h5>
                        <p className="text-[11px] text-cocoa leading-relaxed">{navContent.newInDesc || "Discover the next evolution of our essentials."}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* MEGA MENU: CLOTHING */}
            <div className="group h-full flex items-center">
              <Link to="/clothing/clothing" className={`px-2 lg:px-3 xl:px-4 text-[13px] xl:text-[14px] font-bold uppercase tracking-[0.02em] navbar-brand-font transition-colors duration-500 h-full flex items-center ${
                showSolid ? "text-[#000000] hover:text-[#000000]/70" : "text-[#FAF9F6] hover:text-[#FAF9F6]/80"
              }`}>Clothing</Link>
              <div className="mega-menu-panel absolute left-0 top-full w-full hidden group-hover:block bg-canvas border-b border-clay/15 shadow-lg animate-in fade-in duration-150 before:absolute before:-top-8 before:left-0 before:w-full before:h-8 before:content-['']">
                <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
                  <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8 lg:gap-12">
                    {/* Left: Featured */}
                    <div className="col-span-3 flex flex-col gap-4">
                      <div className="flex flex-col gap-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-ink">Featured</h4>
                        <div className="flex flex-col gap-2.5">
                          <Link to="/clothing/all-clothing" className="text-[13px] text-cocoa hover:text-ink transition-colors">All Clothing</Link>
                          <Link to="/clothing/two-piece-matching-sets" className="text-[13px] text-cocoa hover:text-ink transition-colors">Two Piece & Matching Sets</Link>
                          <Link to="/clothing/clothing-guide" className="text-[13px] text-cocoa hover:text-ink transition-colors">Clothing Guide</Link>
                        </div>
                      </div>
                    </div>
                    {/* Middle: Categories */}
                    <div className="col-span-5 flex flex-col gap-4">
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-ink">Categories</h4>
                      <div className="grid grid-cols-2 gap-y-2.5 gap-x-12">
                        <Link to="/clothing/dresses" className="text-[13px] text-cocoa hover:text-ink transition-colors">Dresses</Link>
                        <Link to="/clothing/hoodies" className="text-[13px] text-cocoa hover:text-ink transition-colors">Hoodies</Link>
                        <Link to="/clothing/sweatshirts" className="text-[13px] text-cocoa hover:text-ink transition-colors">Sweatshirts</Link>
                        <Link to="/clothing/leggings" className="text-[13px] text-cocoa hover:text-ink transition-colors">Leggings</Link>
                        <Link to="/clothing/maternity" className="text-[13px] text-cocoa hover:text-ink transition-colors">Maternity</Link>
                        <Link to="/clothing/tops-bodysuits" className="text-[13px] text-cocoa hover:text-ink transition-colors">Tops & Bodysuits</Link>
                        <Link to="/clothing/pants" className="text-[13px] text-cocoa hover:text-ink transition-colors">Pants</Link>
                        <Link to="/clothing/pajamas" className="text-[13px] text-cocoa hover:text-ink transition-colors">Pajamas</Link>
                        <Link to="/clothing/shorts" className="text-[13px] text-cocoa hover:text-ink transition-colors">Shorts</Link>
                        <Link to="/clothing/skirts" className="text-[13px] text-cocoa hover:text-ink transition-colors">Skirts</Link>
                        <Link to="/clothing/tees-tanks" className="text-[13px] text-cocoa hover:text-ink transition-colors">Tees & Tanks</Link>
                      </div>
                    </div>
                    {/* Right: Promo */}
                    <div className="col-span-4 pl-12 border-l border-clay/20">
                      <div className="group/promo block cursor-default">
                        <div className="aspect-[16/10] bg-sand mb-3 overflow-hidden">
                          <img loading="lazy" src={navContent.clothingImage || "/images/editorial-wide.webp"} alt="Campaign" className="w-full h-full object-cover transition-transform duration-700 group-hover/promo:scale-105" />
                        </div>
                        <h5 className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink mb-2">{navContent.clothingTitle || "The Essentials Edit"}</h5>
                        <p className="text-[11px] text-cocoa leading-relaxed">{navContent.clothingDesc || "Shop the looks from our latest campaign."}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MEGA MENU: BRAS */}
            <div className="group h-full flex items-center">
              <Link to="/bras/bras" className={`px-2 lg:px-3 xl:px-4 text-[13px] xl:text-[14px] font-bold uppercase tracking-[0.02em] navbar-brand-font transition-colors duration-500 h-full flex items-center ${
                showSolid ? "text-[#000000] hover:text-[#000000]/70" : "text-[#FAF9F6] hover:text-[#FAF9F6]/80"
              }`}>Bras</Link>
              <div className="mega-menu-panel absolute left-0 top-full w-full hidden group-hover:block bg-canvas border-b border-clay/15 shadow-lg animate-in fade-in duration-150 before:absolute before:-top-8 before:left-0 before:w-full before:h-8 before:content-['']">
                <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
                  <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8 lg:gap-12">
                    {/* Left: Featured */}
                    <div className="col-span-3 flex flex-col gap-4">
                      <div className="flex flex-col gap-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-ink">Featured</h4>
                        <div className="flex flex-col gap-2.5">
                          <Link to="/bras/all-bras" className="text-[13px] text-cocoa hover:text-ink transition-colors">All Bras</Link>
                          <Link to="/bras/everyday-comfort" className="text-[13px] text-cocoa hover:text-ink transition-colors">Everyday Comfort</Link>
                          <Link to="/bras/bra-fit-guide" className="text-[13px] text-cocoa hover:text-ink transition-colors">Bra Fit Guide</Link>
                        </div>
                      </div>
                    </div>
                    {/* Middle: Categories */}
                    <div className="col-span-5 flex flex-col gap-4">
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-ink">Categories</h4>
                      <div className="grid grid-cols-2 gap-y-2.5 gap-x-12">
                        <Link to="/bras/t-shirt-bras" className="text-[13px] text-cocoa hover:text-ink transition-colors">T-Shirt Bras</Link>
                        <Link to="/bras/strapless" className="text-[13px] text-cocoa hover:text-ink transition-colors">Strapless</Link>
                        <Link to="/bras/full-coverage" className="text-[13px] text-cocoa hover:text-ink transition-colors">Full Coverage</Link>
                        <Link to="/clothing/maternity" className="text-[13px] text-cocoa hover:text-ink transition-colors">Maternity</Link>
                        <Link to="/bras/lined" className="text-[13px] text-cocoa hover:text-ink transition-colors">Lined</Link>
                        <Link to="/bras/push-up" className="text-[13px] text-cocoa hover:text-ink transition-colors">Push-Up</Link>
                        <Link to="/bras/unlined" className="text-[13px] text-cocoa hover:text-ink transition-colors">Unlined</Link>
                        <Link to="/bras/lightly-lined" className="text-[13px] text-cocoa hover:text-ink transition-colors">Lightly Lined</Link>
                      </div>
                    </div>
                    {/* Right: Promo */}
                    <div className="col-span-4 pl-12 border-l border-clay/20">
                      <div className="group/promo block cursor-default">
                        <div className="aspect-[16/10] bg-sand mb-3 overflow-hidden">
                          <img loading="lazy" src={navContent.brasImage || "/images/product-3.webp"} alt="Campaign" className="w-full h-full object-cover transition-transform duration-700 group-hover/promo:scale-105" />
                        </div>
                        <h5 className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink mb-2">{navContent.brasTitle || "Second-Skin Feel"}</h5>
                        <p className="text-[11px] text-cocoa leading-relaxed">{navContent.brasDesc || "Engineered for invisible, weightless support."}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MEGA MENU: UNDERWEAR */}
            <div className="group h-full flex items-center">
              <Link to="/underwear/underwear" className={`px-2 lg:px-3 xl:px-4 text-[13px] xl:text-[14px] font-bold uppercase tracking-[0.02em] navbar-brand-font transition-colors duration-500 h-full flex items-center ${
                showSolid ? "text-[#000000] hover:text-[#000000]/70" : "text-[#FAF9F6] hover:text-[#FAF9F6]/80"
              }`}>Underwear</Link>
              <div className="mega-menu-panel absolute left-0 top-full w-full hidden group-hover:block bg-canvas border-b border-clay/15 shadow-lg animate-in fade-in duration-150 before:absolute before:-top-8 before:left-0 before:w-full before:h-8 before:content-['']">
                <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
                  <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8 lg:gap-12">
                    {/* Left: Featured */}
                    <div className="col-span-3 flex flex-col gap-4">
                      <div className="flex flex-col gap-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-ink">Featured</h4>
                        <div className="flex flex-col gap-2.5">
                          <Link to="/underwear/all-underwear" className="text-[13px] text-cocoa hover:text-ink transition-colors">All Underwear</Link>
                          <Link to="/underwear/multi-packs" className="text-[13px] text-cocoa hover:text-ink transition-colors">Multi-Packs</Link>
                          <Link to="/underwear/underwear-guide" className="text-[13px] text-cocoa hover:text-ink transition-colors">Underwear Guide</Link>
                        </div>
                      </div>
                    </div>
                    {/* Middle: Categories */}
                    <div className="col-span-5 flex flex-col gap-4">
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-ink">Categories</h4>
                      <div className="grid grid-cols-2 gap-y-2.5 gap-x-12">
                        <Link to="/underwear/thongs" className="text-[13px] text-cocoa hover:text-ink transition-colors">Thongs</Link>
                        <Link to="/underwear/cheeky" className="text-[13px] text-cocoa hover:text-ink transition-colors">Cheeky</Link>
                        <Link to="/clothing/maternity" className="text-[13px] text-cocoa hover:text-ink transition-colors">Maternity</Link>
                        <Link to="/underwear/seamless" className="text-[13px] text-cocoa hover:text-ink transition-colors">Seamless</Link>
                      </div>
                    </div>
                    {/* Right: Promo */}
                    <div className="col-span-4 pl-12 border-l border-clay/20">
                      <div className="group/promo block cursor-default">
                        <div className="aspect-[16/10] bg-sand mb-3 overflow-hidden">
                          <img loading="lazy" src={navContent.underwearImage || "/images/product-2.webp"} alt="Campaign" className="w-full h-full object-cover transition-transform duration-700 group-hover/promo:scale-105" />
                        </div>
                        <h5 className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink mb-2">{navContent.underwearTitle || "Seamless Collection"}</h5>
                        <p className="text-[11px] text-cocoa leading-relaxed">{navContent.underwearDesc || "Smooth lines and ultimate comfort for every body."}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MEGA MENU: ACCESSORIES */}
            <div className="group h-full flex items-center">
              <Link to="/accessories/accessories" className={`px-2 lg:px-3 xl:px-4 text-[13px] xl:text-[14px] font-bold uppercase tracking-[0.02em] navbar-brand-font transition-colors duration-500 h-full flex items-center ${
                showSolid ? "text-[#000000] hover:text-[#000000]/70" : "text-[#FAF9F6] hover:text-[#FAF9F6]/80"
              }`}>Accessories</Link>
              <div className="mega-menu-panel absolute left-0 top-full w-full hidden group-hover:block bg-canvas border-b border-clay/15 shadow-lg animate-in fade-in duration-150 before:absolute before:-top-8 before:left-0 before:w-full before:h-8 before:content-['']">
                <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
                  <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8 lg:gap-12">
                    {/* Left: Featured */}
                    <div className="col-span-3 flex flex-col gap-4">
                      <div className="flex flex-col gap-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-ink">Featured</h4>
                        <div className="flex flex-col gap-2.5">
                          <Link to="/accessories/all-accessories" className="text-[13px] text-cocoa hover:text-ink transition-colors">All Accessories</Link>
                          <Link to="/accessories/gifting" className="text-[13px] text-cocoa hover:text-ink transition-colors">Gifting</Link>
                          <Link to="/accessories/the-travel-edit" className="text-[13px] text-cocoa hover:text-ink transition-colors">The Travel Edit</Link>
                        </div>
                      </div>
                    </div>
                    {/* Middle: Categories */}
                    <div className="col-span-5 flex flex-col gap-4">
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-ink">Categories</h4>
                      <div className="grid grid-cols-2 gap-y-2.5 gap-x-12">
                        <Link to="/accessories/bags" className="text-[13px] text-cocoa hover:text-ink transition-colors">Bags</Link>
                        <Link to="/accessories/glasses-shades" className="text-[13px] text-cocoa hover:text-ink transition-colors">Glasses & Shades</Link>
                        <Link to="/accessories/belts" className="text-[13px] text-cocoa hover:text-ink transition-colors">Belts</Link>
                        <Link to="/accessories/perfumes" className="text-[13px] text-cocoa hover:text-ink transition-colors">Perfumes</Link>
                      </div>
                    </div>
                    {/* Right: Promo */}
                    <div className="col-span-4 pl-12 border-l border-clay/20">
                      <div className="group/promo block cursor-default">
                        <div className="aspect-[16/10] bg-sand mb-3 overflow-hidden">
                          <img loading="lazy" src={navContent.accessoriesImage || "/images/campaign-2.webp"} alt="Campaign" className="w-full h-full object-cover transition-transform duration-700 group-hover/promo:scale-105" />
                        </div>
                        <h5 className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink mb-2">{navContent.accessoriesTitle || "Signature Scents"}</h5>
                        <p className="text-[11px] text-cocoa leading-relaxed">{navContent.accessoriesDesc || "Complete the uniform with our new fragrance line."}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MEGA MENU: SWIMWEAR */}
            <div className="group h-full flex items-center">
              <Link to="/swimwear/swimwear" className={`px-2 lg:px-3 xl:px-4 text-[13px] xl:text-[14px] font-bold uppercase tracking-[0.02em] navbar-brand-font transition-colors duration-500 h-full flex items-center ${
                showSolid ? "text-[#000000] hover:text-[#000000]/70" : "text-[#FAF9F6] hover:text-[#FAF9F6]/80"
              }`}>Swimwear</Link>
              <div className="mega-menu-panel absolute left-0 top-full w-full hidden group-hover:block bg-canvas border-b border-clay/15 shadow-lg animate-in fade-in duration-150 before:absolute before:-top-8 before:left-0 before:w-full before:h-8 before:content-['']">
                <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
                  <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8 lg:gap-12">
                    {/* Left: Featured */}
                    <div className="col-span-3 flex flex-col gap-4">
                      <div className="flex flex-col gap-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-ink">Featured</h4>
                        <div className="flex flex-col gap-2.5">
                          <Link to="/swimwear/all-swimwear" className="text-[13px] text-cocoa hover:text-ink transition-colors">All Swimwear</Link>
                          <Link to="/swimwear/vacation-shop" className="text-[13px] text-cocoa hover:text-ink transition-colors">Vacation Shop</Link>
                          <Link to="/swimwear/swim-fit-guide" className="text-[13px] text-cocoa hover:text-ink transition-colors">Swim Fit Guide</Link>
                        </div>
                      </div>
                    </div>
                    {/* Middle: Categories */}
                    <div className="col-span-5 flex flex-col gap-4">
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-ink">Categories</h4>
                      <div className="grid grid-cols-2 gap-y-2.5 gap-x-12">
                        <Link to="/swimwear/bikinis" className="text-[13px] text-cocoa hover:text-ink transition-colors">Bikinis</Link>
                        <Link to="/swimwear/swimsuits" className="text-[13px] text-cocoa hover:text-ink transition-colors">Swimsuits</Link>
                        <Link to="/swimwear/swim-cover-ups" className="text-[13px] text-cocoa hover:text-ink transition-colors">Swim Cover-Ups</Link>
                      </div>
                    </div>
                    {/* Right: Promo */}
                    <div className="col-span-4 pl-12 border-l border-clay/20">
                      <div className="group/promo block cursor-default">
                        <div className="aspect-[16/10] bg-sand mb-3 overflow-hidden">
                          <img loading="lazy" src={navContent.swimwearImage || "/images/product-1.webp"} alt="Campaign" className="w-full h-full object-cover transition-transform duration-700 group-hover/promo:scale-105" />
                        </div>
                        <h5 className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink mb-2">{navContent.swimwearTitle || "The Resort Edit"}</h5>
                        <p className="text-[11px] text-cocoa leading-relaxed">{navContent.swimwearDesc || "Minimal silhouettes ready for the sun."}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </nav>
        </div>

        {/* Right Side: Icons + Hamburger */}
        <div className={`flex items-center gap-1 md:gap-3 transition-colors duration-500 ${
          showSolid ? "text-[#000000]" : "text-[#FAF9F6]"
        }`}>
          <button onClick={openSearch} aria-label="Search" className="p-2 min-w-[48px] min-h-[48px] flex items-center justify-center hover:scale-110 transition-transform"><svg className="size-[18px] md:size-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3" strokeLinecap="round"/></svg></button>
          <button onClick={() => navigate('/account')} aria-label="Account" className="p-2 min-w-[48px] min-h-[48px] flex items-center justify-center hover:scale-110 transition-transform hidden sm:flex"><svg className="size-[18px] md:size-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg></button>
          <button onClick={() => navigate('/wishlist')} aria-label="Wishlist" className="p-2 min-w-[48px] min-h-[48px] flex items-center justify-center hover:scale-110 transition-transform relative">
            <svg className="size-[18px] md:size-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.8 5.6a5.5 5.5 0 0 0-9 1.7 5.5 5.5 0 0 0-9-1.7c-2.1 2.1-2.1 5.6 0 7.7l9 9 9-9c2.1-2.1 2.1-5.6 0-7.7Z"/></svg>
            {wishlist.length > 0 && <span className="absolute top-1 right-1 w-3 h-3 bg-red-600 text-white text-[8px] flex items-center justify-center rounded-full font-bold">{wishlist.length}</span>}
          </button>
          <button onClick={openCart} aria-label="Cart" className="p-2 min-w-[48px] min-h-[48px] flex items-center justify-center hover:scale-110 transition-transform relative">
            <svg className="size-[18px] md:size-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 7h14l-1.5 12h-11L5 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>
            {getCartCount() > 0 && <span className="absolute top-1 right-1 w-3 h-3 bg-red-600 text-white text-[8px] flex items-center justify-center rounded-full font-bold">{getCartCount()}</span>}
          </button>
          <button onClick={onMenuToggle} aria-label="Menu" className={`md:hidden p-2 min-w-[48px] min-h-[48px] flex items-center justify-center transition-colors duration-500 ${
            showSolid ? "text-[#000000] hover:text-[#000000]/70" : "text-[#FAF9F6] hover:text-[#FAF9F6]/80"
          }`}>
            {isMenuOpen ? (
              <svg className="size-[22px] md:size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="size-[22px] md:size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  </>
  );
}
