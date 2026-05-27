import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AccordionItem = ({ title, children, to, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-clay/30 pb-4">
      <div className="flex items-center justify-between">
        <Link to={to} onClick={onClose} className="text-base font-semibold uppercase tracking-tight text-ink">
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
    <div className={`fixed inset-0 z-[110] bg-canvas transform transition-transform duration-300 ease-in-out md:hidden flex flex-col pt-[100px] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex-1 overflow-y-auto px-6 pb-10 flex flex-col gap-6">
        
        <AccordionItem title="New In" to="/new-in/new-in" onClose={onClose}>
          <div className="flex flex-col gap-3 pb-4 border-b border-clay/20">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Featured</span>
            <Link onClick={onClose} to="/new-in/all-new-arrivals" className="text-xs text-cocoa hover:text-ink">All New Arrivals</Link>
            <Link onClick={onClose} to="/new-in/the-editorial-edit" className="text-xs text-cocoa hover:text-ink">The Editorial Edit</Link>
            <Link onClick={onClose} to="/new-in/trend-guide" className="text-xs text-cocoa hover:text-ink">Trend Guide</Link>
          </div>
          <div className="flex flex-col gap-3 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Categories</span>
            <Link onClick={onClose} to="/new-in/all-new-arrivals" className="text-xs text-cocoa hover:text-ink">All New Arrivals</Link>
            <Link onClick={onClose} to="/new-in/back-in-stock" className="text-xs text-cocoa hover:text-ink">Back in Stock</Link>
            <Link onClick={onClose} to="/new-in/coming-soon" className="text-xs text-cocoa hover:text-ink">Coming Soon</Link>
            <Link onClick={onClose} to="/new-in/pre-order" className="text-xs text-cocoa hover:text-ink">Pre-Order</Link>
          </div>
          <Link onClick={onClose} to="/other/volume-02-preview" className="block bg-sand aspect-[4/3] relative overflow-hidden mb-2 mt-2 rounded-sm">
            <img src="/images/campaign-1.jpg" alt="Campaign" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-ink/20 flex flex-col justify-end p-4">
              <span className="text-canvas text-sm font-bold uppercase tracking-[0.1em]">Volume 02 Preview</span>
            </div>
          </Link>
        </AccordionItem>

        <AccordionItem title="Clothing" to="/clothing/clothing" onClose={onClose}>
          <div className="flex flex-col gap-3 pb-4 border-b border-clay/20">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Featured</span>
            <Link onClick={onClose} to="/clothing/all-clothing" className="text-xs text-cocoa hover:text-ink">All Clothing</Link>
            <Link onClick={onClose} to="/clothing/two-piece-matching-sets" className="text-xs text-cocoa hover:text-ink">Two Piece & Matching Sets</Link>
            <Link onClick={onClose} to="/clothing/clothing-guide" className="text-xs text-cocoa hover:text-ink">Clothing Guide</Link>
          </div>
          <div className="flex flex-col gap-3 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Categories</span>
            <Link onClick={onClose} to="/clothing/dresses" className="text-xs text-cocoa hover:text-ink">Dresses</Link>
            <Link onClick={onClose} to="/clothing/hoodies" className="text-xs text-cocoa hover:text-ink">Hoodies</Link>
            <Link onClick={onClose} to="/clothing/sweatshirts" className="text-xs text-cocoa hover:text-ink">Sweatshirts</Link>
            <Link onClick={onClose} to="/clothing/leggings" className="text-xs text-cocoa hover:text-ink">Leggings</Link>
            <Link onClick={onClose} to="/clothing/maternity" className="text-xs text-cocoa hover:text-ink">Maternity</Link>
            <Link onClick={onClose} to="/clothing/tops-bodysuits" className="text-xs text-cocoa hover:text-ink">Tops & Bodysuits</Link>
            <Link onClick={onClose} to="/clothing/pants" className="text-xs text-cocoa hover:text-ink">Pants</Link>
            <Link onClick={onClose} to="/clothing/pajamas" className="text-xs text-cocoa hover:text-ink">Pajamas</Link>
            <Link onClick={onClose} to="/clothing/shorts" className="text-xs text-cocoa hover:text-ink">Shorts</Link>
            <Link onClick={onClose} to="/clothing/skirts" className="text-xs text-cocoa hover:text-ink">Skirts</Link>
            <Link onClick={onClose} to="/clothing/tees-tanks" className="text-xs text-cocoa hover:text-ink">Tees & Tanks</Link>
          </div>
          <Link onClick={onClose} to="/other/the-essentials-edit" className="block bg-sand aspect-[4/3] relative overflow-hidden mb-2 mt-2 rounded-sm">
            <img src="/images/editorial-wide.jpg" alt="Campaign" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-ink/20 flex flex-col justify-end p-4">
              <span className="text-canvas text-sm font-bold uppercase tracking-[0.1em]">The Essentials Edit</span>
            </div>
          </Link>
        </AccordionItem>

        <AccordionItem title="Bras" to="/bras/bras" onClose={onClose}>
          <div className="flex flex-col gap-3 pb-4 border-b border-clay/20">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Featured</span>
            <Link onClick={onClose} to="/bras/all-bras" className="text-xs text-cocoa hover:text-ink">All Bras</Link>
            <Link onClick={onClose} to="/bras/everyday-comfort" className="text-xs text-cocoa hover:text-ink">Everyday Comfort</Link>
            <Link onClick={onClose} to="/bras/bra-fit-guide" className="text-xs text-cocoa hover:text-ink">Bra Fit Guide</Link>
          </div>
          <div className="flex flex-col gap-3 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Categories</span>
            <Link onClick={onClose} to="/bras/t-shirt-bras" className="text-xs text-cocoa hover:text-ink">T-Shirt Bras</Link>
            <Link onClick={onClose} to="/bras/strapless" className="text-xs text-cocoa hover:text-ink">Strapless</Link>
            <Link onClick={onClose} to="/bras/full-coverage" className="text-xs text-cocoa hover:text-ink">Full Coverage</Link>
            <Link onClick={onClose} to="/clothing/maternity" className="text-xs text-cocoa hover:text-ink">Maternity</Link>
            <Link onClick={onClose} to="/bras/lined" className="text-xs text-cocoa hover:text-ink">Lined</Link>
            <Link onClick={onClose} to="/bras/push-up" className="text-xs text-cocoa hover:text-ink">Push-Up</Link>
            <Link onClick={onClose} to="/bras/unlined" className="text-xs text-cocoa hover:text-ink">Unlined</Link>
            <Link onClick={onClose} to="/bras/lightly-lined" className="text-xs text-cocoa hover:text-ink">Lightly Lined</Link>
          </div>
          <Link onClick={onClose} to="/other/second-skin-feel" className="block bg-sand aspect-[4/3] relative overflow-hidden mb-2 mt-2 rounded-sm">
            <img src="/images/product-3.jpg" alt="Campaign" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-ink/20 flex flex-col justify-end p-4">
              <span className="text-canvas text-sm font-bold uppercase tracking-[0.1em]">Second-Skin Feel</span>
            </div>
          </Link>
        </AccordionItem>

        <AccordionItem title="Underwear" to="/underwear/underwear" onClose={onClose}>
          <div className="flex flex-col gap-3 pb-4 border-b border-clay/20">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Featured</span>
            <Link onClick={onClose} to="/underwear/all-underwear" className="text-xs text-cocoa hover:text-ink">All Underwear</Link>
            <Link onClick={onClose} to="/underwear/multi-packs" className="text-xs text-cocoa hover:text-ink">Multi-Packs</Link>
            <Link onClick={onClose} to="/underwear/underwear-guide" className="text-xs text-cocoa hover:text-ink">Underwear Guide</Link>
          </div>
          <div className="flex flex-col gap-3 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Categories</span>
            <Link onClick={onClose} to="/underwear/thongs" className="text-xs text-cocoa hover:text-ink">Thongs</Link>
            <Link onClick={onClose} to="/underwear/cheeky" className="text-xs text-cocoa hover:text-ink">Cheeky</Link>
            <Link onClick={onClose} to="/clothing/maternity" className="text-xs text-cocoa hover:text-ink">Maternity</Link>
            <Link onClick={onClose} to="/underwear/seamless" className="text-xs text-cocoa hover:text-ink">Seamless</Link>
          </div>
          <Link onClick={onClose} to="/other/seamless-collection" className="block bg-sand aspect-[4/3] relative overflow-hidden mb-2 mt-2 rounded-sm">
            <img src="/images/product-2.jpg" alt="Campaign" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-ink/20 flex flex-col justify-end p-4">
              <span className="text-canvas text-sm font-bold uppercase tracking-[0.1em]">Seamless Collection</span>
            </div>
          </Link>
        </AccordionItem>

        <AccordionItem title="Accessories" to="/accessories/accessories" onClose={onClose}>
          <div className="flex flex-col gap-3 pb-4 border-b border-clay/20">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Featured</span>
            <Link onClick={onClose} to="/accessories/all-accessories" className="text-xs text-cocoa hover:text-ink">All Accessories</Link>
            <Link onClick={onClose} to="/accessories/gifting" className="text-xs text-cocoa hover:text-ink">Gifting</Link>
            <Link onClick={onClose} to="/accessories/the-travel-edit" className="text-xs text-cocoa hover:text-ink">The Travel Edit</Link>
          </div>
          <div className="flex flex-col gap-3 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Categories</span>
            <Link onClick={onClose} to="/accessories/bags" className="text-xs text-cocoa hover:text-ink">Bags</Link>
            <Link onClick={onClose} to="/accessories/glasses-shades" className="text-xs text-cocoa hover:text-ink">Glasses & Shades</Link>
            <Link onClick={onClose} to="/accessories/belts" className="text-xs text-cocoa hover:text-ink">Belts</Link>
            <Link onClick={onClose} to="/accessories/perfumes" className="text-xs text-cocoa hover:text-ink">Perfumes</Link>
          </div>
          <Link onClick={onClose} to="/other/signature-scents" className="block bg-sand aspect-[4/3] relative overflow-hidden mb-2 mt-2 rounded-sm">
            <img src="/images/campaign-2.jpg" alt="Campaign" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-ink/20 flex flex-col justify-end p-4">
              <span className="text-canvas text-sm font-bold uppercase tracking-[0.1em]">Signature Scents</span>
            </div>
          </Link>
        </AccordionItem>

        <AccordionItem title="Swimwear" to="/swimwear/swimwear" onClose={onClose}>
          <div className="flex flex-col gap-3 pb-4 border-b border-clay/20">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Featured</span>
            <Link onClick={onClose} to="/swimwear/all-swimwear" className="text-xs text-cocoa hover:text-ink">All Swimwear</Link>
            <Link onClick={onClose} to="/swimwear/vacation-shop" className="text-xs text-cocoa hover:text-ink">Vacation Shop</Link>
            <Link onClick={onClose} to="/swimwear/swim-fit-guide" className="text-xs text-cocoa hover:text-ink">Swim Fit Guide</Link>
          </div>
          <div className="flex flex-col gap-3 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">Categories</span>
            <Link onClick={onClose} to="/swimwear/bikinis" className="text-xs text-cocoa hover:text-ink">Bikinis</Link>
            <Link onClick={onClose} to="/swimwear/swimsuits" className="text-xs text-cocoa hover:text-ink">Swimsuits</Link>
            <Link onClick={onClose} to="/swimwear/swim-cover-ups" className="text-xs text-cocoa hover:text-ink">Swim Cover-Ups</Link>
          </div>
          <Link onClick={onClose} to="/other/the-resort-edit" className="block bg-sand aspect-[4/3] relative overflow-hidden mb-2 mt-2 rounded-sm">
            <img src="/images/product-1.jpg" alt="Campaign" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-ink/20 flex flex-col justify-end p-4">
              <span className="text-canvas text-sm font-bold uppercase tracking-[0.1em]">The Resort Edit</span>
            </div>
          </Link>
        </AccordionItem>

        <hr className="border-clay/40 my-2" />
        <Link onClick={onClose} to="/components/account" className="text-xs font-medium uppercase tracking-[0.18em] text-cocoa hover:text-ink">Account</Link>
        <Link onClick={onClose} to="/components/wishlist" className="text-xs font-medium uppercase tracking-[0.18em] text-cocoa hover:text-ink pb-4">Wishlist</Link>
      </div>
    </div>
  );
}
