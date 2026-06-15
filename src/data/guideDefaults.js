export const GUIDE_DEFAULTS = {
  trendGuide: {
    heroEyebrow: 'TREND REPORT',
    heroTitle: 'The Season\'s Definitive Edit',
    heroDesc: 'Discover the silhouettes and color palettes shaping this season.',
    heroImage: '/images/campaign-1.webp',
    categories: [
      {
        visible: true,
        label: 'VOLUME & DRAPE',
        desc: 'Exaggerated proportions are grounded by precision cuts.',
        mainImage: '/images/editorial-wide.webp',
        copyTitle: 'The Shift in Proportions',
        copyDesc: 'This season is defined by a distinct shift towards relaxed architectural forms and hyper-tactile materials.',
        icon1Label: 'Vibe', icon1Value: 'Relaxed',
        icon2Label: 'Material', icon2Value: 'Tactile',
        icon3Label: 'Season', icon3Value: 'Fall/Winter',
        productImage: '/images/product-3.webp',
        productName: 'Oversized Drape Hoodie',
        productDesc: '$120 | 3 Colors',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'EARTHY NEUTRALS',
        desc: 'The color palette is rooted in nature.',
        mainImage: '/images/campaign-2.webp',
        copyTitle: 'Grounded Tones',
        copyDesc: 'Opt for shades of slate, moss, oat, and deep cocoa. Monochromatic dressing in these hues creates an instantly elevated, expensive look.',
        icon1Label: 'Vibe', icon1Value: 'Earthy',
        icon2Label: 'Material', icon2Value: 'Organic',
        icon3Label: 'Style', icon3Value: 'Monochrome',
        productImage: '/images/product-1.webp',
        productName: 'Essential Moss Trouser',
        productDesc: '$150 | 2 Colors',
        productLink: '/clothing'
      }
    ],
    shopByTitle: 'Shop the Trends',
    shopByCards: [
      { visible: true, image: '/images/product-2.webp', title: 'Shop Volume', desc: 'Oversized pieces', btnText: 'Shop Now', link: '/clothing' },
      { visible: true, image: '/images/product-4.webp', title: 'Shop Neutrals', desc: 'Earthy tones', btnText: 'Shop Now', link: '/clothing' }
    ]
  },
  clothingGuide: {
    heroEyebrow: 'CLOTHING GUIDE',
    heroTitle: 'The Essentials Wardrobe',
    heroDesc: 'Building a foundation of premium basics.',
    heroImage: '/images/campaign-2.webp',
    categories: [
      {
        visible: true,
        label: 'THE ART OF LAYERING',
        desc: 'Start with lightweight foundations and build volume.',
        mainImage: '/images/product-1.webp',
        copyTitle: 'Mastering the Mix',
        copyDesc: 'Learn how to combine textures and fits for an effortless look.',
        icon1Label: 'Fit', icon1Value: 'Relaxed',
        icon2Label: 'Fabric', icon2Value: 'Cotton',
        icon3Label: 'Style', icon3Value: 'Casual',
        productImage: '/images/product-2.webp',
        productName: 'Heavyweight Tee',
        productDesc: '$45 | 5 Colors',
        productLink: '/clothing'
      }
    ],
    shopByTitle: 'Shop by Category',
    shopByCards: [
      { visible: true, image: '/images/product-3.webp', title: 'Tops', desc: 'Tees & Hoodies', btnText: 'Shop Now', link: '/clothing' },
      { visible: true, image: '/images/product-4.webp', title: 'Bottoms', desc: 'Pants & Shorts', btnText: 'Shop Now', link: '/clothing' }
    ]
  },
  braFitGuide: {
    heroEyebrow: 'FIT GUIDE',
    heroTitle: 'Find Your Perfect Bra',
    heroDesc: 'A comprehensive guide to our fits, fabrics, and support levels.',
    heroImage: '/images/campaign-1.webp',
    heroImageMobile: '/images/product-1.webp',
    categories: [
      {
        visible: true,
        label: 'THE SEAMLESS BRALETTE',
        desc: 'Perfect for lounging and low-impact activities.',
        mainImage: '/images/product-3.webp',
        copyTitle: 'Second-Skin Feel',
        copyDesc: 'Engineered for invisible, weightless support that moves with you.',
        icon1Label: 'Coverage', icon1Value: 'Light',
        icon2Label: 'Support', icon2Value: 'Light',
        icon3Label: 'Wire', icon3Value: 'Wireless',
        productImage: '/images/product-1.webp',
        productName: 'Seamless Sculpt Bralette',
        productDesc: '$38 | 9 Colors',
        productLink: '/bras/all-bras'
      },
      {
        visible: true,
        label: 'THE CONTOUR PLUNGE',
        desc: 'Everyday lift with flexible underwire.',
        mainImage: '/images/product-4.webp',
        copyTitle: 'Lifted Look',
        copyDesc: 'Designed to enhance your natural shape while remaining completely invisible under clothing.',
        icon1Label: 'Coverage', icon1Value: 'Medium',
        icon2Label: 'Support', icon2Value: 'Medium',
        icon3Label: 'Wire', icon3Value: 'Wired',
        productImage: '/images/product-2.webp',
        productName: 'Fits Everybody Plunge',
        productDesc: '$44 | 5 Colors',
        productLink: '/bras/all-bras'
      },
      {
        visible: true,
        label: 'THE BALCONETTE',
        desc: 'Classic support with a wider neckline.',
        mainImage: '/images/campaign-1.webp',
        copyTitle: 'Natural Lift',
        copyDesc: 'Provides comfortable, targeted support that naturally lifts without aggressive push-up padding.',
        icon1Label: 'Coverage', icon1Value: 'Medium',
        icon2Label: 'Support', icon2Value: 'High',
        icon3Label: 'Wire', icon3Value: 'Wired',
        productImage: '/images/product-3.webp',
        productName: 'Cotton Rib Balconette',
        productDesc: '$48 | 4 Colors',
        productLink: '/bras/all-bras'
      },
      {
        visible: true,
        label: 'THE FULL COVERAGE',
        desc: 'Maximum support for larger cup sizes.',
        mainImage: '/images/editorial-tall.webp',
        copyTitle: 'All-Day Comfort',
        copyDesc: 'Smoothing wings and a higher neckline for secure, bounce-free support all day.',
        icon1Label: 'Coverage', icon1Value: 'Full',
        icon2Label: 'Support', icon2Value: 'Maximum',
        icon3Label: 'Wire', icon3Value: 'Wired',
        productImage: '/images/product-4.webp',
        productName: 'Ultimate Support Bra',
        productDesc: '$52 | 6 Colors',
        productLink: '/bras/all-bras'
      }
    ],
    shopByTitle: 'Shop by Support Level',
    shopByCards: [
      { visible: true, image: '/images/editorial-wide.webp', title: 'Light Support', desc: 'For lounging', btnText: 'Shop Now', link: '/bras/all-bras' },
      { visible: true, image: '/images/campaign-2.webp', title: 'Medium Support', desc: 'For everyday', btnText: 'Shop Now', link: '/bras/all-bras' },
      { visible: true, image: '/images/product-1.webp', title: 'High Support', desc: 'For activity', btnText: 'Shop Now', link: '/bras/all-bras' },
      { visible: true, image: '/images/product-2.webp', title: 'Full Coverage', desc: 'Maximum comfort', btnText: 'Shop Now', link: '/bras/all-bras' }
    ]
  },
  underwearGuide: {
    heroEyebrow: 'STYLE GUIDE',
    heroTitle: 'The Underwear Edit',
    heroDesc: 'Discover your new favorite silhouettes.',
    heroImage: '/images/campaign-2.webp',
    categories: [
      {
        visible: true,
        label: 'THE THONG',
        desc: 'Invisible under everything. Zero lines, maximum comfort.',
        mainImage: '/images/product-1.webp',
        copyTitle: 'Foundation First',
        copyDesc: 'The right underwear changes how your clothes fit and how you feel.',
        icon1Label: 'Coverage', icon1Value: 'Minimal',
        icon2Label: 'Rise', icon2Value: 'Mid-Rise',
        icon3Label: 'Fabric', icon3Value: 'Cotton',
        productImage: '/images/product-3.webp',
        productName: 'Cotton Rib Thong',
        productDesc: '$18 | 4 Colors',
        productLink: '/underwear/all-underwear'
      }
    ],
    shopByTitle: 'Shop by Silhouette',
    shopByCards: [
      { visible: true, image: '/images/product-2.webp', title: 'Thongs', desc: 'Minimal coverage', btnText: 'Shop Now', link: '/underwear/all-underwear' },
      { visible: true, image: '/images/product-4.webp', title: 'Briefs', desc: 'Classic coverage', btnText: 'Shop Now', link: '/underwear/all-underwear' }
    ]
  },
  swimFitGuide: {
    heroEyebrow: 'SWIM GUIDE',
    heroTitle: 'The Resort Collection',
    heroDesc: 'Minimalist silhouettes designed for the sun.',
    heroImage: '/images/editorial-wide.webp',
    categories: [
      {
        visible: true,
        label: 'THE ONE-PIECE',
        desc: 'A sleek, sculpting silhouette that doubles as a bodysuit.',
        mainImage: '/images/product-3.webp',
        copyTitle: 'Flawless Construction',
        copyDesc: 'Double-lined fabrics that smooth, sculpt, and support.',
        icon1Label: 'Coverage', icon1Value: 'Full',
        icon2Label: 'Support', icon2Value: 'High',
        icon3Label: 'Style', icon3Value: 'Classic',
        productImage: '/images/product-1.webp',
        productName: 'Sculpting Swim One-Piece',
        productDesc: '$88 | 3 Colors',
        productLink: '/swimwear/all-swimwear'
      }
    ],
    shopByTitle: 'Shop by Style',
    shopByCards: [
      { visible: true, image: '/images/campaign-1.webp', title: 'One-Pieces', desc: 'Sculpting fits', btnText: 'Shop Now', link: '/swimwear/all-swimwear' },
      { visible: true, image: '/images/product-2.webp', title: 'Bikinis', desc: 'Mix & match', btnText: 'Shop Now', link: '/swimwear/all-swimwear' }
    ]
  }
};
