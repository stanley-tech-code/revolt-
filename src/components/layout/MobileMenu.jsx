import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AccordionItem = ({ title, children, to }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-clay/30 pb-4">
      <div className="flex items-center justify-between">
        <Link to={to} className="text-base font-semibold uppercase tracking-tight text-ink">
          {title}
        </Link>
        <button 
          className="p-2 -mr-2" 
          aria-label="Toggle Submenu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg 
            className={`size-5 text-cocoa transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="flex flex-col gap-5 pt-5">
          {children}
        </div>
      )}
    </div>
  );
};

export default function MobileMenu({ isOpen, onClose }) {
  return (
    <div className={`fixed inset-0 z-[80] bg-canvas transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="px-6 h-14 flex items-center justify-between border-b border-clay/40 shrink-0">
        <button onClick={onClose} aria-label="Back" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink hover:text-cocoa transition-colors">
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <button onClick={onClose} aria-label="Close Menu" className="p-1 text-cocoa hover:text-ink transition-colors">
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-10 flex flex-col gap-6">
        
        <AccordionItem title="New In" to="/new-in/new-in">
          <div className="flex flex-col gap-3 pb-4 border-b border-clay/20">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Featured</span>
            <Link to="/new-in/all-new-arrivals" className="text-xs text-cocoa hover:text-ink">All New Arrivals</Link>
            <Link to="/new-in/the-editorial-edit" className="text-xs text-cocoa hover:text-ink">The Editorial Edit</Link>
            <Link to="/new-in/trend-guide" className="text-xs text-cocoa hover:text-ink">Trend Guide</Link>
          </div>
          <div className="flex flex-col gap-3 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Categories</span>
            <Link to="/new-in/all-new-arrivals" className="text-xs text-cocoa hover:text-ink">All New Arrivals</Link>
            <Link to="/new-in/back-in-stock" className="text-xs text-cocoa hover:text-ink">Back in Stock</Link>
            <Link to="/new-in/coming-soon" className="text-xs text-cocoa hover:text-ink">Coming Soon</Link>
            <Link to="/new-in/pre-order" className="text-xs text-cocoa hover:text-ink">Pre-Order</Link>
          </div>
          <Link to="/other/volume-02-preview" className="block bg-sand aspect-[4/3] relative overflow-hidden mb-2 mt-2 rounded-sm">
            <img src="/images/campaign-1.jpg" alt="Campaign" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-ink/20 flex flex-col justify-end p-4">
              <span className="text-canvas text-sm font-bold uppercase tracking-[0.1em]">Volume 02 Preview</span>
            </div>
          </Link>
        </AccordionItem>

        <AccordionItem title="Clothing" to="/clothing/clothing">
          <div className="flex flex-col gap-3 pb-4 border-b border-clay/20">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Featured</span>
            <Link to="/clothing/all-clothing" className="text-xs text-cocoa hover:text-ink">All Clothing</Link>
            <Link to="/clothing/two-piece-matching-sets" className="text-xs text-cocoa hover:text-ink">Two Piece & Matching Sets</Link>
            <Link to="/clothing/clothing-guide" className="text-xs text-cocoa hover:text-ink">Clothing Guide</Link>
          </div>
          <div className="flex flex-col gap-3 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Categories</span>
            <Link to="/clothing/dresses" className="text-xs text-cocoa hover:text-ink">Dresses</Link>
            <Link to="/clothing/hoodies" className="text-xs text-cocoa hover:text-ink">Hoodies</Link>
            <Link to="/clothing/sweatshirts" className="text-xs text-cocoa hover:text-ink">Sweatshirts</Link>
            <Link to="/clothing/leggings" className="text-xs text-cocoa hover:text-ink">Leggings</Link>
            <Link to="/clothing/maternity" className="text-xs text-cocoa hover:text-ink">Maternity</Link>
            <Link to="/clothing/tops-bodysuits" className="text-xs text-cocoa hover:text-ink">Tops & Bodysuits</Link>
            <Link to="/clothing/pants" className="text-xs text-cocoa hover:text-ink">Pants</Link>
            <Link to="/clothing/pajamas" className="text-xs text-cocoa hover:text-ink">Pajamas</Link>
            <Link to="/clothing/shorts" className="text-xs text-cocoa hover:text-ink">Shorts</Link>
            <Link to="/clothing/skirts" className="text-xs text-cocoa hover:text-ink">Skirts</Link>
            <Link to="/clothing/tees-tanks" className="text-xs text-cocoa hover:text-ink">Tees & Tanks</Link>
          </div>
          <Link to="/other/the-essentials-edit" className="block bg-sand aspect-[4/3] relative overflow-hidden mb-2 mt-2 rounded-sm">
            <img src="/images/editorial-wide.jpg" alt="Campaign" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-ink/20 flex flex-col justify-end p-4">
              <span className="text-canvas text-sm font-bold uppercase tracking-[0.1em]">The Essentials Edit</span>
            </div>
          </Link>
        </AccordionItem>

        <AccordionItem title="Bras" to="/bras/bras">
          <div className="flex flex-col gap-3 pb-4 border-b border-clay/20">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Featured</span>
            <Link to="/bras/all-bras" className="text-xs text-cocoa hover:text-ink">All Bras</Link>
            <Link to="/bras/everyday-comfort" className="text-xs text-cocoa hover:text-ink">Everyday Comfort</Link>
            <Link to="/bras/bra-fit-guide" className="text-xs text-cocoa hover:text-ink">Bra Fit Guide</Link>
          </div>
          <div className="flex flex-col gap-3 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Categories</span>
            <Link to="/bras/t-shirt-bras" className="text-xs text-cocoa hover:text-ink">T-Shirt Bras</Link>
            <Link to="/bras/strapless" className="text-xs text-cocoa hover:text-ink">Strapless</Link>
            <Link to="/bras/full-coverage" className="text-xs text-cocoa hover:text-ink">Full Coverage</Link>
            <Link to="/clothing/maternity" className="text-xs text-cocoa hover:text-ink">Maternity</Link>
            <Link to="/bras/lined" className="text-xs text-cocoa hover:text-ink">Lined</Link>
            <Link to="/bras/push-up" className="text-xs text-cocoa hover:text-ink">Push-Up</Link>
            <Link to="/bras/unlined" className="text-xs text-cocoa hover:text-ink">Unlined</Link>
            <Link to="/bras/lightly-lined" className="text-xs text-cocoa hover:text-ink">Lightly Lined</Link>
          </div>
          <Link to="/other/second-skin-feel" className="block bg-sand aspect-[4/3] relative overflow-hidden mb-2 mt-2 rounded-sm">
            <img src="/images/product-3.jpg" alt="Campaign" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-ink/20 flex flex-col justify-end p-4">
              <span className="text-canvas text-sm font-bold uppercase tracking-[0.1em]">Second-Skin Feel</span>
            </div>
          </Link>
        </AccordionItem>

        <AccordionItem title="Underwear" to="/underwear/underwear">
          <div className="flex flex-col gap-3 pb-4 border-b border-clay/20">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Featured</span>
            <Link to="/underwear/all-underwear" className="text-xs text-cocoa hover:text-ink">All Underwear</Link>
            <Link to="/underwear/multi-packs" className="text-xs text-cocoa hover:text-ink">Multi-Packs</Link>
            <Link to="/underwear/underwear-guide" className="text-xs text-cocoa hover:text-ink">Underwear Guide</Link>
          </div>
          <div className="flex flex-col gap-3 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Categories</span>
            <Link to="/underwear/thongs" className="text-xs text-cocoa hover:text-ink">Thongs</Link>
            <Link to="/underwear/cheeky" className="text-xs text-cocoa hover:text-ink">Cheeky</Link>
            <Link to="/clothing/maternity" className="text-xs text-cocoa hover:text-ink">Maternity</Link>
            <Link to="/underwear/seamless" className="text-xs text-cocoa hover:text-ink">Seamless</Link>
          </div>
          <Link to="/other/seamless-collection" className="block bg-sand aspect-[4/3] relative overflow-hidden mb-2 mt-2 rounded-sm">
            <img src="/images/product-2.jpg" alt="Campaign" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-ink/20 flex flex-col justify-end p-4">
              <span className="text-canvas text-sm font-bold uppercase tracking-[0.1em]">Seamless Collection</span>
            </div>
          </Link>
        </AccordionItem>

        <AccordionItem title="Accessories" to="/accessories/accessories">
          <div className="flex flex-col gap-3 pb-4 border-b border-clay/20">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Featured</span>
            <Link to="/accessories/all-accessories" className="text-xs text-cocoa hover:text-ink">All Accessories</Link>
            <Link to="/accessories/gifting" className="text-xs text-cocoa hover:text-ink">Gifting</Link>
            <Link to="/accessories/the-travel-edit" className="text-xs text-cocoa hover:text-ink">The Travel Edit</Link>
          </div>
          <div className="flex flex-col gap-3 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Categories</span>
            <Link to="/accessories/bags" className="text-xs text-cocoa hover:text-ink">Bags</Link>
            <Link to="/accessories/glasses-shades" className="text-xs text-cocoa hover:text-ink">Glasses & Shades</Link>
            <Link to="/accessories/belts" className="text-xs text-cocoa hover:text-ink">Belts</Link>
            <Link to="/accessories/perfumes" className="text-xs text-cocoa hover:text-ink">Perfumes</Link>
          </div>
          <Link to="/other/signature-scents" className="block bg-sand aspect-[4/3] relative overflow-hidden mb-2 mt-2 rounded-sm">
            <img src="/images/campaign-2.jpg" alt="Campaign" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-ink/20 flex flex-col justify-end p-4">
              <span className="text-canvas text-sm font-bold uppercase tracking-[0.1em]">Signature Scents</span>
            </div>
          </Link>
        </AccordionItem>

        <AccordionItem title="Swimwear" to="/swimwear/swimwear">
          <div className="flex flex-col gap-3 pb-4 border-b border-clay/20">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Featured</span>
            <Link to="/swimwear/all-swimwear" className="text-xs text-cocoa hover:text-ink">All Swimwear</Link>
            <Link to="/swimwear/vacation-shop" className="text-xs text-cocoa hover:text-ink">Vacation Shop</Link>
            <Link to="/swimwear/swim-fit-guide" className="text-xs text-cocoa hover:text-ink">Swim Fit Guide</Link>
          </div>
          <div className="flex flex-col gap-3 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Categories</span>
            <Link to="/swimwear/bikinis" className="text-xs text-cocoa hover:text-ink">Bikinis</Link>
            <Link to="/swimwear/swimsuits" className="text-xs text-cocoa hover:text-ink">Swimsuits</Link>
            <Link to="/swimwear/swim-cover-ups" className="text-xs text-cocoa hover:text-ink">Swim Cover-Ups</Link>
          </div>
          <Link to="/other/the-resort-edit" className="block bg-sand aspect-[4/3] relative overflow-hidden mb-2 mt-2 rounded-sm">
            <img src="/images/product-1.jpg" alt="Campaign" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-ink/20 flex flex-col justify-end p-4">
              <span class="text-canvas text-sm font-bold uppercase tracking-[0.1em]">The Resort Edit</span>
            </div>
          </Link>
        </AccordionItem>

        <hr className="border-clay/40 my-2" />
        <Link to="/components/account" className="text-xs font-medium uppercase tracking-[0.18em] text-cocoa hover:text-ink">Account</Link>
        <Link to="/components/wishlist" className="text-xs font-medium uppercase tracking-[0.18em] text-cocoa hover:text-ink mb-6">Wishlist</Link>
        
        <div className="flex items-center gap-4 text-cocoa pb-4">
          <Link to="/components/instagram" aria-label="Instagram" className="hover:text-ink">
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </Link>
          <Link to="/components/facebook" aria-label="Facebook" className="hover:text-ink">
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </Link>
          <Link to="/components/tiktok" aria-label="TikTok" className="hover:text-ink">
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a8 8 0 0 1-5-1z"/></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
