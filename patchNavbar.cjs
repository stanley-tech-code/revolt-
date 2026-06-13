const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Navbar.jsx', 'utf8');

// 1. Add import
code = code.replace(
  "import { useStore } from '../../context/StoreContext';",
  "import { useStore } from '../../context/StoreContext';\nimport { useCms } from '../../context/CmsContext';"
);

// 2. Add useCms hook
code = code.replace(
  "  const { openCart, openSearch, getCartCount, wishlist } = useStore();",
  "  const { openCart, openSearch, getCartCount, wishlist } = useStore();\n  const { db } = useCms();\n  const navContent = db?.pages?.navbar || {};"
);

// 3. Replace New In promo
code = code.replace(
  /<Link to="\/other\/volume-02-preview-discover-the-next-evolution-of-our-essentials" className="group\/promo block">[\s\S]*?<\/Link>/,
  `<div className="group/promo block cursor-default">
                        <div className="aspect-[16/10] bg-sand mb-3 overflow-hidden">
                          <img loading="lazy" src={navContent.newInImage || "/images/campaign-1.webp"} alt="Campaign" className="w-full h-full object-cover transition-transform duration-700 group-hover/promo:scale-105" />
                        </div>
                        <h5 className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink mb-2">{navContent.newInTitle || "Volume 02 Preview"}</h5>
                        <p className="text-[11px] text-cocoa leading-relaxed">{navContent.newInDesc || "Discover the next evolution of our essentials."}</p>
                      </div>`
);

// 4. Replace Clothing promo
code = code.replace(
  /<Link to="\/other\/the-essentials-edit-shop-the-looks-from-our-latest-campaign" className="group\/promo block">[\s\S]*?<\/Link>/,
  `<div className="group/promo block cursor-default">
                        <div className="aspect-[16/10] bg-sand mb-3 overflow-hidden">
                          <img loading="lazy" src={navContent.clothingImage || "/images/editorial-wide.webp"} alt="Campaign" className="w-full h-full object-cover transition-transform duration-700 group-hover/promo:scale-105" />
                        </div>
                        <h5 className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink mb-2">{navContent.clothingTitle || "The Essentials Edit"}</h5>
                        <p className="text-[11px] text-cocoa leading-relaxed">{navContent.clothingDesc || "Shop the looks from our latest campaign."}</p>
                      </div>`
);

// 5. Replace Bras promo
code = code.replace(
  /<Link to="\/other\/second-skin-feel-engineered-for-invisible-weightless-support" className="group\/promo block">[\s\S]*?<\/Link>/,
  `<div className="group/promo block cursor-default">
                        <div className="aspect-[16/10] bg-sand mb-3 overflow-hidden">
                          <img loading="lazy" src={navContent.brasImage || "/images/product-3.webp"} alt="Campaign" className="w-full h-full object-cover transition-transform duration-700 group-hover/promo:scale-105" />
                        </div>
                        <h5 className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink mb-2">{navContent.brasTitle || "Second-Skin Feel"}</h5>
                        <p className="text-[11px] text-cocoa leading-relaxed">{navContent.brasDesc || "Engineered for invisible, weightless support."}</p>
                      </div>`
);

// 6. Replace Underwear promo
code = code.replace(
  /<Link to="\/other\/seamless-collection-smooth-lines-and-ultimate-comfort-for-every-body" className="group\/promo block">[\s\S]*?<\/Link>/,
  `<div className="group/promo block cursor-default">
                        <div className="aspect-[16/10] bg-sand mb-3 overflow-hidden">
                          <img loading="lazy" src={navContent.underwearImage || "/images/product-2.webp"} alt="Campaign" className="w-full h-full object-cover transition-transform duration-700 group-hover/promo:scale-105" />
                        </div>
                        <h5 className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink mb-2">{navContent.underwearTitle || "Seamless Collection"}</h5>
                        <p className="text-[11px] text-cocoa leading-relaxed">{navContent.underwearDesc || "Smooth lines and ultimate comfort for every body."}</p>
                      </div>`
);

// 7. Replace Accessories promo
code = code.replace(
  /<Link to="\/other\/signature-scents-complete-the-uniform-with-our-new-fragrance-line" className="group\/promo block">[\s\S]*?<\/Link>/,
  `<div className="group/promo block cursor-default">
                        <div className="aspect-[16/10] bg-sand mb-3 overflow-hidden">
                          <img loading="lazy" src={navContent.accessoriesImage || "/images/campaign-2.webp"} alt="Campaign" className="w-full h-full object-cover transition-transform duration-700 group-hover/promo:scale-105" />
                        </div>
                        <h5 className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink mb-2">{navContent.accessoriesTitle || "Signature Scents"}</h5>
                        <p className="text-[11px] text-cocoa leading-relaxed">{navContent.accessoriesDesc || "Complete the uniform with our new fragrance line."}</p>
                      </div>`
);

// 8. Replace Swimwear promo
code = code.replace(
  /<Link to="\/other\/the-resort-edit-minimal-silhouettes-ready-for-the-sun" className="group\/promo block">[\s\S]*?<\/Link>/,
  `<div className="group/promo block cursor-default">
                        <div className="aspect-[16/10] bg-sand mb-3 overflow-hidden">
                          <img loading="lazy" src={navContent.swimwearImage || "/images/product-1.webp"} alt="Campaign" className="w-full h-full object-cover transition-transform duration-700 group-hover/promo:scale-105" />
                        </div>
                        <h5 className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink mb-2">{navContent.swimwearTitle || "The Resort Edit"}</h5>
                        <p className="text-[11px] text-cocoa leading-relaxed">{navContent.swimwearDesc || "Minimal silhouettes ready for the sun."}</p>
                      </div>`
);

fs.writeFileSync('src/components/layout/Navbar.jsx', code);
console.log('Successfully patched Navbar.jsx');
