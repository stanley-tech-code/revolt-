export const GUIDE_DEFAULTS = {
  trendGuide: {
    heroEyebrow: 'TREND REPORT',
    heroTitle: "The Season's Definitive Edit",
    heroDesc: 'Discover the silhouettes and color palettes shaping this season.',
    heroImage: '/images/campaign-1.webp',
    heroBtnText: 'Shop New Arrivals',
    heroBtnLink: '/new-in/all-new-arrivals',
    categories: [
      {
        visible: true,
        label: 'VOLUME & DRAPE',
        desc: 'Exaggerated proportions are grounded by precision cuts.',
        mainImage: '/images/editorial-wide.webp',
        copyTitle: 'The Shift in Proportions',
        copyDesc: 'This season is defined by a distinct shift towards relaxed architectural forms and hyper-tactile materials.',
        icon1Label: 'Fit', icon1Value: 'Oversized',
        icon2Label: 'Fabric', icon2Value: 'Heavyweight',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'EARTHY NEUTRALS',
        desc: 'The color palette is rooted in nature.',
        mainImage: '/images/campaign-2.webp',
        copyTitle: 'Grounded Tones',
        copyDesc: 'Opt for shades of slate, moss, oat, and deep cocoa. Monochromatic dressing in these hues creates an instantly elevated, expensive look.',
        icon1Label: 'Fit', icon1Value: 'Tailored',
        icon2Label: 'Fabric', icon2Value: 'Organic Cotton',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'UTILITARIAN EDGE',
        desc: 'Functionality meets high fashion.',
        mainImage: '/images/product-3.webp',
        copyTitle: 'Modern Cargo',
        copyDesc: 'Hardware details, multi-pocket designs, and structured canvases bring an industrial edge to everyday wear.',
        icon1Label: 'Fit', icon1Value: 'Relaxed',
        icon2Label: 'Fabric', icon2Value: 'Canvas / Twill',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'SHEER LAYERS',
        desc: 'Translucent fabrics for depth and dimension.',
        mainImage: '/images/product-4.webp',
        copyTitle: 'Ethereal Foundations',
        copyDesc: 'Layer sheer meshes over opaque bases to create a sense of intrigue without sacrificing comfort or coverage.',
        icon1Label: 'Fit', icon1Value: 'Second-Skin',
        icon2Label: 'Fabric', icon2Value: 'Micro-Mesh',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'REFINED LEATHER',
        desc: 'A permanent fixture in the modern wardrobe.',
        mainImage: '/images/product-1.webp',
        copyTitle: 'Structured Rebellion',
        copyDesc: 'Buttery soft vegan leathers cut into sharp, tailored silhouettes. Perfect for transitioning from day to night.',
        icon1Label: 'Fit', icon1Value: 'Structured',
        icon2Label: 'Fabric', icon2Value: 'Vegan Leather',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'THE MAXI HEMLINE',
        desc: 'Floor-sweeping lengths make a return.',
        mainImage: '/images/product-2.webp',
        copyTitle: 'Elongated Silhouettes',
        copyDesc: 'Skirts and dresses that hit below the ankle, creating a dramatic, sweeping line that commands attention.',
        icon1Label: 'Fit', icon1Value: 'Column',
        icon2Label: 'Fabric', icon2Value: 'Fluid Silk',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'METALLIC ACCENTS',
        desc: 'High shine for everyday wear.',
        mainImage: '/images/product-3.webp',
        copyTitle: 'Liquid Metal',
        copyDesc: 'Silver and gold tones are no longer reserved for evening. Incorporate metallic threads and finishes into your daily rotation.',
        icon1Label: 'Fit', icon1Value: 'Draped',
        icon2Label: 'Fabric', icon2Value: 'Lurex Blend',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'THE POWER SHOULDER',
        desc: 'Strong silhouettes for a confident presence.',
        mainImage: '/images/editorial-tall.webp',
        copyTitle: 'Architectural Details',
        copyDesc: 'Subtle padding and sharp tailoring draw the eye upward, creating a strong V-shape that instantly elevates any look.',
        icon1Label: 'Fit', icon1Value: 'Structured',
        icon2Label: 'Fabric', icon2Value: 'Wool Blend',
        productLink: '/clothing'
      }
    ],
    promoEyebrow: 'THE EDIT',
    promoTitle: 'Curated Textures',
    promoDesc: 'Explore fabrics designed for motion and impact.',
    promoBanner: '/images/campaign-2.webp',
    promoBtnText: 'Shop The Edit',
    promoBtnLink: '/clothing',
    shopByTitle: 'Shop the Trends',
    shopByCards: [
      { visible: true, image: '/images/product-2.webp', title: 'Volume', desc: 'Oversized pieces', btnText: 'Shop Now', link: '/clothing' },
      { visible: true, image: '/images/product-4.webp', title: 'Neutrals', desc: 'Earthy tones', btnText: 'Shop Now', link: '/clothing' },
      { visible: true, image: '/images/product-1.webp', title: 'Utility', desc: 'Cargo & Hardware', btnText: 'Shop Now', link: '/clothing' },
      { visible: true, image: '/images/editorial-tall.webp', title: 'Sheer', desc: 'Mesh layering', btnText: 'Shop Now', link: '/clothing' }
    ]
  },
  clothingGuide: {
    heroEyebrow: 'CLOTHING GUIDE',
    heroTitle: 'The Essentials Wardrobe',
    heroDesc: 'Building a foundation of premium basics.',
    heroImage: '/images/campaign-2.webp',
    heroBtnText: 'Shop Clothing',
    heroBtnLink: '/clothing/all-clothing',
    categories: [
      {
        visible: true,
        label: 'THE PERFECT TEE',
        desc: 'The ultimate base layer.',
        mainImage: '/images/product-1.webp',
        copyTitle: 'Everyday Luxury',
        copyDesc: 'A flawless cut, a perfectly weighted fabric, and a neckline that holds its shape wash after wash.',
        icon1Label: 'Fit', icon1Value: 'Relaxed',
        icon2Label: 'Fabric', icon2Value: 'Heavyweight Cotton',
        productLink: '/clothing/tops'
      },
      {
        visible: true,
        label: 'THE EFFORTLESS PANT',
        desc: 'Tailoring that feels like loungewear.',
        mainImage: '/images/product-2.webp',
        copyTitle: 'Motion & Structure',
        copyDesc: 'Pleated details and wide-leg silhouettes that offer extreme comfort while maintaining a sharp, professional edge.',
        icon1Label: 'Fit', icon1Value: 'Wide-Leg',
        icon2Label: 'Fabric', icon2Value: 'Stretch Crepe',
        productLink: '/clothing/bottoms'
      },
      {
        visible: true,
        label: 'THE OVERSIZED BUTTON-DOWN',
        desc: 'Borrowed from the boys, tailored for you.',
        mainImage: '/images/product-3.webp',
        copyTitle: 'Crisp & Clean',
        copyDesc: 'Wear it open over a bralette, buttoned up for the office, or thrown over a swimsuit. The most versatile piece in your closet.',
        icon1Label: 'Fit', icon1Value: 'Oversized',
        icon2Label: 'Fabric', icon2Value: 'Poplin',
        productLink: '/clothing/tops'
      },
      {
        visible: true,
        label: 'THE SEAMLESS BODYSUIT',
        desc: 'A flawless tuck, every single time.',
        mainImage: '/images/product-4.webp',
        copyTitle: 'Sculpting Foundation',
        copyDesc: 'Double-lined, ultra-soft microfiber that acts as a second skin. Designed to smooth and contour without restricting movement.',
        icon1Label: 'Fit', icon1Value: 'Compressive',
        icon2Label: 'Fabric', icon2Value: 'Microfiber Blend',
        productLink: '/clothing/tops'
      },
      {
        visible: true,
        label: 'THE TAILORED BLAZER',
        desc: 'Instant polish for any outfit.',
        mainImage: '/images/campaign-1.webp',
        copyTitle: 'Structured Elegance',
        copyDesc: 'A slightly oversized fit that drapes perfectly over both tees and evening wear. Fully lined for a premium feel.',
        icon1Label: 'Fit', icon1Value: 'Oversized',
        icon2Label: 'Fabric', icon2Value: 'Wool Blend',
        productLink: '/clothing/outerwear'
      },
      {
        visible: true,
        label: 'THE RIBBED TANK',
        desc: 'The essential layering piece.',
        mainImage: '/images/product-2.webp',
        copyTitle: 'Contoured Comfort',
        copyDesc: 'High necklines and deep armholes create a flattering shoulder line. Spun with just enough elastane to hold its shape.',
        icon1Label: 'Fit', icon1Value: 'Fitted',
        icon2Label: 'Fabric', icon2Value: 'Cotton Rib',
        productLink: '/clothing/tops'
      },
      {
        visible: true,
        label: 'THE SLIP DRESS',
        desc: 'From day to night in a single piece.',
        mainImage: '/images/editorial-wide.webp',
        copyTitle: 'Fluid Motion',
        copyDesc: 'Cut on the bias to drape beautifully across the body. Wear it alone or layered over a fitted tee.',
        icon1Label: 'Fit', icon1Value: 'Bias Cut',
        icon2Label: 'Fabric', icon2Value: 'Washable Silk',
        productLink: '/clothing/dresses'
      },
      {
        visible: true,
        label: 'THE STRAIGHT-LEG DENIM',
        desc: 'Vintage wash, modern fit.',
        mainImage: '/images/product-4.webp',
        copyTitle: 'Denim Reimagined',
        copyDesc: 'Rigid denim look with hidden stretch for all-day wearability. A high rise that perfectly complements cropped tops.',
        icon1Label: 'Fit', icon1Value: 'Straight',
        icon2Label: 'Fabric', icon2Value: 'Stretch Denim',
        productLink: '/clothing/bottoms'
      }
    ],
    promoEyebrow: 'WARDROBE BUILDERS',
    promoTitle: 'The Core Collection',
    promoDesc: 'Invest in pieces you will wear forever.',
    promoBanner: '/images/editorial-wide.webp',
    promoBtnText: 'Shop Core',
    promoBtnLink: '/clothing/all-clothing',
    shopByTitle: 'Shop by Category',
    shopByCards: [
      { visible: true, image: '/images/product-3.webp', title: 'Tops', desc: 'Tees & Shirts', btnText: 'Shop Now', link: '/clothing/tops' },
      { visible: true, image: '/images/product-4.webp', title: 'Bottoms', desc: 'Pants & Skirts', btnText: 'Shop Now', link: '/clothing/bottoms' },
      { visible: true, image: '/images/campaign-1.webp', title: 'Dresses', desc: 'One-piece styling', btnText: 'Shop Now', link: '/clothing/dresses' },
      { visible: true, image: '/images/product-1.webp', title: 'Outerwear', desc: 'Jackets & Coats', btnText: 'Shop Now', link: '/clothing/outerwear' }
    ]
  },
  braFitGuide: {
    heroEyebrow: 'FIT GUIDE',
    heroTitle: 'Find Your Perfect Bra',
    heroDesc: 'A comprehensive guide to our fits, fabrics, and support levels.',
    heroImage: '/images/campaign-1.webp',
    heroImageMobile: '/images/product-1.webp',
    heroBtnText: 'Shop Bras',
    heroBtnLink: '/bras/all-bras',
    categories: [
      {
        visible: true,
        label: 'CLASSIC T-SHIRT BRA',
        desc: 'Everyday Essential',
        mainImage: '/images/product-1.webp',
        copyTitle: 'Classic T-Shirt Bra',
        copyDesc: 'Smooth, seamless cups that disappear under fitted tops and t-shirts, with light padding for a rounded shape and no visible lines.',
        icon1Label: 'Coverage', icon1Value: 'Full',
        icon2Label: 'Support', icon2Value: 'Medium',
        productLink: '/bras/all-bras'
      },
      {
        visible: true,
        label: 'PUSH-UP T-SHIRT BRA',
        desc: 'Added Lift',
        mainImage: '/images/product-2.webp',
        copyTitle: 'Push-Up T-Shirt Bra',
        copyDesc: 'The same smooth, seamless silhouette with extra padding for a fuller shape and a noticeable lift under everyday tops.',
        icon1Label: 'Coverage', icon1Value: 'Medium',
        icon2Label: 'Support', icon2Value: 'Medium',
        productLink: '/bras/all-bras'
      },
      {
        visible: true,
        label: 'BALCONETTE BRA',
        desc: 'Lifted & Rounded',
        mainImage: '/images/product-3.webp',
        copyTitle: 'Balconette Bra',
        copyDesc: 'A horizontal neckline and structured cups create a lifted, rounded shape with a hint of natural cleavage — ideal for square-neck tops.',
        icon1Label: 'Coverage', icon1Value: 'Medium',
        icon2Label: 'Support', icon2Value: 'High',
        productLink: '/bras/all-bras'
      },
      {
        visible: true,
        label: 'PLUNGE BALCONETTE BRA',
        desc: 'Low-Cut Friendly',
        mainImage: '/images/product-4.webp',
        copyTitle: 'Plunge Balconette Bra',
        copyDesc: 'Combines the lifted balconette shape with a lower center front, giving cleavage and coverage for low-cut tops and dresses.',
        icon1Label: 'Coverage', icon1Value: 'Medium',
        icon2Label: 'Support', icon2Value: 'Medium',
        productLink: '/bras/all-bras'
      },
      {
        visible: true,
        label: 'PLUNGE BRA',
        desc: 'Deep V Neckline',
        mainImage: '/images/editorial-tall.webp',
        copyTitle: 'Plunge Bra',
        copyDesc: 'A deep V-shaped center front sits low between the cups, creating cleavage and disappearing under plunge and V-neck necklines.',
        icon1Label: 'Coverage', icon1Value: 'Minimal',
        icon2Label: 'Support', icon2Value: 'Light',
        productLink: '/bras/all-bras'
      },
      {
        visible: true,
        label: 'STRAPLESS PLUNGE BRA',
        desc: 'Strap-Free',
        mainImage: '/images/editorial-wide.webp',
        copyTitle: 'Strapless Plunge Bra',
        copyDesc: 'The same deep-V cleavage with a secure, grippy band and removable straps — built to hold its shape without slipping.',
        icon1Label: 'Coverage', icon1Value: 'Medium',
        icon2Label: 'Support', icon2Value: 'High',
        productLink: '/bras/all-bras'
      },
      {
        visible: true,
        label: 'FULL COVERAGE BRA',
        desc: 'Maximum Support',
        mainImage: '/images/campaign-1.webp',
        copyTitle: 'Full Coverage Bra',
        copyDesc: 'Cups that fully encase the bust for a smooth, no-spill silhouette and superior support, with wider straps for all-day comfort.',
        icon1Label: 'Coverage', icon1Value: 'Full',
        icon2Label: 'Support', icon2Value: 'Maximum',
        productLink: '/bras/all-bras'
      },
      {
        visible: true,
        label: 'MINIMIZER BRA',
        desc: 'Streamlined Shape',
        mainImage: '/images/campaign-2.webp',
        copyTitle: 'Minimizer Bra',
        copyDesc: 'Full coverage cups designed to gently redistribute and reduce bust projection for a smoother line under fitted clothing.',
        icon1Label: 'Coverage', icon1Value: 'Full',
        icon2Label: 'Support', icon2Value: 'Maximum',
        productLink: '/bras/all-bras'
      }
    ],
    promoEyebrow: 'THE SUPPORT EDIT',
    promoTitle: 'Designed for Every Body',
    promoDesc: 'From A to G, find the support that feels like nothing at all.',
    promoBanner: '/images/campaign-2.webp',
    promoBtnText: 'Shop All Bras',
    promoBtnLink: '/bras/all-bras',
    shopByTitle: 'Shop',
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
    heroBtnText: 'Shop Underwear',
    heroBtnLink: '/underwear/all-underwear',
    categories: [
      {
        visible: true,
        label: 'THE THONG',
        desc: 'Invisible under everything. Zero lines, maximum comfort.',
        mainImage: '/images/product-1.webp',
        copyTitle: 'Foundation First',
        copyDesc: 'The right underwear changes how your clothes fit and how you feel. Our thong features a soft lace trim that never digs in.',
        icon1Label: 'Coverage', icon1Value: 'Minimal',
        icon2Label: 'Fabric', icon2Value: 'Cotton Rib',
        productLink: '/underwear/all-underwear'
      },
      {
        visible: true,
        label: 'THE CHEEKY',
        desc: 'A flirty middle ground.',
        mainImage: '/images/product-2.webp',
        copyTitle: 'Everyday Ease',
        copyDesc: 'Just enough coverage in the back while maintaining a flattering, slightly arched cut. Perfect for denim.',
        icon1Label: 'Coverage', icon1Value: 'Moderate',
        icon2Label: 'Fabric', icon2Value: 'Microfiber',
        productLink: '/underwear/all-underwear'
      },
      {
        visible: true,
        label: 'THE BIKINI',
        desc: 'The classic daily go-to.',
        mainImage: '/images/product-3.webp',
        copyTitle: 'Timeless Comfort',
        copyDesc: 'A moderate rise and full gusset coverage make this the reliable choice for all-day wear under practically anything.',
        icon1Label: 'Coverage', icon1Value: 'Moderate-Full',
        icon2Label: 'Fabric', icon2Value: 'Modal Blend',
        productLink: '/underwear/all-underwear'
      },
      {
        visible: true,
        label: 'THE BOYSHORT',
        desc: 'Maximum coverage, lounge-ready.',
        mainImage: '/images/product-4.webp',
        copyTitle: 'Sleep to Street',
        copyDesc: 'A straight-cut leg that provides full cheek coverage. So comfortable you can sleep in them, or pair them with oversized tees.',
        icon1Label: 'Coverage', icon1Value: 'Full',
        icon2Label: 'Fabric', icon2Value: 'Seamless Stretch',
        productLink: '/underwear/all-underwear'
      },
      {
        visible: true,
        label: 'THE HIGH-WAIST THONG',
        desc: 'Contouring without the lines.',
        mainImage: '/images/campaign-1.webp',
        copyTitle: 'Sculpted Shape',
        copyDesc: 'Sitting just below the belly button, this style smooths the core while remaining completely invisible from behind.',
        icon1Label: 'Coverage', icon1Value: 'Minimal',
        icon2Label: 'Fabric', icon2Value: 'Microfiber',
        productLink: '/underwear/all-underwear'
      },
      {
        visible: true,
        label: 'THE HIGH-WAIST BRIEF',
        desc: 'Vintage-inspired full coverage.',
        mainImage: '/images/product-2.webp',
        copyTitle: 'Maximum Smoothing',
        copyDesc: 'The ultimate comfort piece. A retro-inspired cut that provides full front, back, and hip coverage without riding up.',
        icon1Label: 'Coverage', icon1Value: 'Full',
        icon2Label: 'Fabric', icon2Value: 'Cotton Stretch',
        productLink: '/underwear/all-underwear'
      },
      {
        visible: true,
        label: 'THE FRENCH CUT',
        desc: 'Leg-lengthening magic.',
        mainImage: '/images/editorial-wide.webp',
        copyTitle: 'Elevated Lines',
        copyDesc: 'Cut high on the hip to elongate the legs, offering moderate coverage in the back with a distinctly European feel.',
        icon1Label: 'Coverage', icon1Value: 'Moderate',
        icon2Label: 'Fabric', icon2Value: 'Lace Trim',
        productLink: '/underwear/all-underwear'
      },
      {
        visible: true,
        label: 'THE SEAMLESS PANTY',
        desc: 'Like wearing nothing at all.',
        mainImage: '/images/editorial-tall.webp',
        copyTitle: 'Laser-Cut Perfection',
        copyDesc: 'Constructed without elastics or stitching around the leg openings to guarantee absolute invisibility under leggings and silk.',
        icon1Label: 'Coverage', icon1Value: 'Various',
        icon2Label: 'Fabric', icon2Value: 'Laser-Cut Nylon',
        productLink: '/underwear/all-underwear'
      }
    ],
    promoEyebrow: 'THE COMFORT EDIT',
    promoTitle: 'Second Skin Intimates',
    promoDesc: 'Fabrics so light, you will forget you are wearing them.',
    promoBanner: '/images/editorial-tall.webp',
    promoBtnText: 'Shop Intimates',
    promoBtnLink: '/underwear/all-underwear',
    shopByTitle: 'Shop by Silhouette',
    shopByCards: [
      { visible: true, image: '/images/product-2.webp', title: 'Thongs', desc: 'Minimal coverage', btnText: 'Shop Now', link: '/underwear/all-underwear' },
      { visible: true, image: '/images/product-4.webp', title: 'Briefs', desc: 'Classic coverage', btnText: 'Shop Now', link: '/underwear/all-underwear' },
      { visible: true, image: '/images/product-1.webp', title: 'Cheekies', desc: 'Moderate coverage', btnText: 'Shop Now', link: '/underwear/all-underwear' },
      { visible: true, image: '/images/campaign-1.webp', title: 'Boyshorts', desc: 'Full coverage', btnText: 'Shop Now', link: '/underwear/all-underwear' }
    ]
  },
  swimFitGuide: {
    heroEyebrow: 'SWIM GUIDE',
    heroTitle: 'The Resort Collection',
    heroDesc: 'Minimalist silhouettes designed for the sun.',
    heroImage: '/images/editorial-wide.webp',
    heroBtnText: 'Shop Swimwear',
    heroBtnLink: '/swimwear/all-swimwear',
    categories: [
      {
        visible: true,
        label: 'THE ONE-PIECE',
        desc: 'A sleek, sculpting silhouette that doubles as a bodysuit.',
        mainImage: '/images/product-3.webp',
        copyTitle: 'Flawless Construction',
        copyDesc: 'Double-lined fabrics that smooth, sculpt, and support. Transition seamlessly from the pool to the bar.',
        icon1Label: 'Coverage', icon1Value: 'Full',
        icon2Label: 'Support', icon2Value: 'High',
        productLink: '/swimwear/all-swimwear'
      },
      {
        visible: true,
        label: 'THE BANDEAU',
        desc: 'Tan-line free and effortlessly chic.',
        mainImage: '/images/campaign-1.webp',
        copyTitle: 'Sun-Soaked Days',
        copyDesc: 'Featuring hidden grip strips to stay perfectly in place, with optional halter straps for when the waves pick up.',
        icon1Label: 'Coverage', icon1Value: 'Medium',
        icon2Label: 'Support', icon2Value: 'Light',
        productLink: '/swimwear/all-swimwear'
      },
      {
        visible: true,
        label: 'THE BALCONETTE TOP',
        desc: 'Lingerie-inspired lift for the beach.',
        mainImage: '/images/campaign-2.webp',
        copyTitle: 'Underwire Support',
        copyDesc: 'Built exactly like your favorite bra, offering unparalleled lift and separation even when wet.',
        icon1Label: 'Coverage', icon1Value: 'Medium',
        icon2Label: 'Support', icon2Value: 'Maximum',
        productLink: '/swimwear/all-swimwear'
      },
      {
        visible: true,
        label: 'THE HIGH-WAIST BOTTOM',
        desc: 'Retro appeal with modern contouring.',
        mainImage: '/images/product-1.webp',
        copyTitle: 'Flattering Lines',
        copyDesc: 'Sits right at the natural waist to cinch and smooth, featuring a high-cut leg to elongate your silhouette.',
        icon1Label: 'Coverage', icon1Value: 'Full',
        icon2Label: 'Support', icon2Value: 'Medium',
        productLink: '/swimwear/all-swimwear'
      },
      {
        visible: true,
        label: 'THE STRING BIKINI',
        desc: 'Fully adjustable for the perfect fit.',
        mainImage: '/images/product-2.webp',
        copyTitle: 'Custom Coverage',
        copyDesc: 'Tie closures allow you to adjust the fit and coverage to your exact preference. A timeless beach essential.',
        icon1Label: 'Coverage', icon1Value: 'Minimal',
        icon2Label: 'Support', icon2Value: 'Light',
        productLink: '/swimwear/all-swimwear'
      },
      {
        visible: true,
        label: 'THE SCOOP TOP',
        desc: 'Sporty aesthetic, secure fit.',
        mainImage: '/images/editorial-tall.webp',
        copyTitle: 'Active Swim',
        copyDesc: 'A comfortable, bralette-style fit that provides security for swimming and water sports without sacrificing style.',
        icon1Label: 'Coverage', icon1Value: 'Medium',
        icon2Label: 'Support', icon2Value: 'Medium',
        productLink: '/swimwear/all-swimwear'
      },
      {
        visible: true,
        label: 'THE CHEEKY BOTTOM',
        desc: 'Minimal back coverage, maximum sun.',
        mainImage: '/images/product-4.webp',
        copyTitle: 'Flattering Curves',
        copyDesc: 'Designed to enhance your shape with a slight ruche detail at the back. Perfect for tanning.',
        icon1Label: 'Coverage', icon1Value: 'Minimal',
        icon2Label: 'Support', icon2Value: 'N/A',
        productLink: '/swimwear/all-swimwear'
      },
      {
        visible: true,
        label: 'THE CUT-OUT ONE-PIECE',
        desc: 'Strategic reveals.',
        mainImage: '/images/editorial-wide.webp',
        copyTitle: 'Modern Glamour',
        copyDesc: 'Combining the security of a one-piece with the aesthetic of a bikini through carefully placed cut-outs.',
        icon1Label: 'Coverage', icon1Value: 'Moderate',
        icon2Label: 'Support', icon2Value: 'Medium',
        productLink: '/swimwear/all-swimwear'
      }
    ],
    promoEyebrow: 'THE ESCAPE EDIT',
    promoTitle: 'Ready For Departure',
    promoDesc: 'Pack light. Make an impact.',
    promoBanner: '/images/product-2.webp',
    promoBtnText: 'Shop Resort',
    promoBtnLink: '/swimwear/all-swimwear',
    shopByTitle: 'Shop by Style',
    shopByCards: [
      { visible: true, image: '/images/campaign-1.webp', title: 'One-Pieces', desc: 'Sculpting fits', btnText: 'Shop Now', link: '/swimwear/all-swimwear' },
      { visible: true, image: '/images/product-2.webp', title: 'Bikini Tops', desc: 'Mix & match', btnText: 'Shop Now', link: '/swimwear/all-swimwear' },
      { visible: true, image: '/images/product-3.webp', title: 'Bikini Bottoms', desc: 'Cheeky to full', btnText: 'Shop Now', link: '/swimwear/all-swimwear' },
      { visible: true, image: '/images/editorial-tall.webp', title: 'Cover-Ups', desc: 'Beach to bar', btnText: 'Shop Now', link: '/clothing/all-clothing' }
    ]
  },
  travelEdit: {
    heroEyebrow: 'THE TRAVEL EDIT',
    heroTitle: 'Departure Lounge',
    heroDesc: 'Packable, versatile, and uncompromised style for your next getaway.',
    heroImage: '/images/campaign-1.webp',
    heroBtnText: 'Shop Travel',
    heroBtnLink: '/clothing/all-clothing',
    categories: [
      {
        visible: true,
        label: 'THE AIRPORT UNIFORM',
        desc: 'Look put-together while feeling like you are in pajamas.',
        mainImage: '/images/product-1.webp',
        copyTitle: 'First Class Comfort',
        copyDesc: 'Matching knit sets that resist wrinkling during long-haul flights and provide cozy warmth against extreme AC.',
        icon1Label: 'Packability', icon1Value: 'High',
        icon2Label: 'Versatility', icon2Value: 'Lounge & Transit',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'THE DAY-TO-NIGHT DRESS',
        desc: 'One piece, endless possibilities.',
        mainImage: '/images/campaign-2.webp',
        copyTitle: 'Effortless Transitions',
        copyDesc: 'Wear it with sandals for exploring the local markets, then swap to a heel and bold earrings for dinner.',
        icon1Label: 'Packability', icon1Value: 'Medium',
        icon2Label: 'Versatility', icon2Value: 'Maximum',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'THE PACKABLE TRENCH',
        desc: 'Weather protection without the bulk.',
        mainImage: '/images/editorial-wide.webp',
        copyTitle: 'Unpredictable Climates',
        copyDesc: 'A lightweight outer layer that folds down to nothing but completely transforms a simple outfit when thrown over the shoulders.',
        icon1Label: 'Packability', icon1Value: 'High',
        icon2Label: 'Versatility', icon2Value: 'Layering',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'THE RESORT LINEN',
        desc: 'Breathable fabrics for high humidity.',
        mainImage: '/images/product-4.webp',
        copyTitle: 'Tropical Uniform',
        copyDesc: 'Crisp, airy linens that actually look better with a few natural wrinkles. Essential for humid coastal climates.',
        icon1Label: 'Packability', icon1Value: 'Medium',
        icon2Label: 'Versatility', icon2Value: 'Beach to Dinner',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'THE CARRY-ON TOTE',
        desc: 'Fits everything, goes everywhere.',
        mainImage: '/images/product-2.webp',
        copyTitle: 'Organized Chaos',
        copyDesc: 'A structured canvas tote that fits under the seat in front of you but looks chic enough to be a beach bag.',
        icon1Label: 'Packability', icon1Value: 'Low',
        icon2Label: 'Versatility', icon2Value: 'Transit & Beach',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'THE RIBBED SEPARATES',
        desc: 'Mix, match, repeat.',
        mainImage: '/images/product-3.webp',
        copyTitle: 'The Capsule Formula',
        copyDesc: 'Pack 3 ribbed pieces that can be worn in 6 different combinations. The ultimate space-saving strategy.',
        icon1Label: 'Packability', icon1Value: 'Maximum',
        icon2Label: 'Versatility', icon2Value: 'Endless',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'THE OVERSIZED SHIRT',
        desc: 'The ultimate vacation multi-tasker.',
        mainImage: '/images/editorial-tall.webp',
        copyTitle: 'Beyond the Beach',
        copyDesc: 'Wear it open as a swim cover-up, tied at the waist with linen pants, or buttoned up for dinner.',
        icon1Label: 'Packability', icon1Value: 'High',
        icon2Label: 'Versatility', icon2Value: 'Beach to Bar',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'THE SLIP-ON SANDAL',
        desc: 'Zero effort, instant polish.',
        mainImage: '/images/campaign-1.webp',
        copyTitle: 'TSA Approved',
        copyDesc: 'Easy to slide off at security and comfortable enough to walk 10,000 steps around a new city.',
        icon1Label: 'Packability', icon1Value: 'High',
        icon2Label: 'Versatility', icon2Value: 'Daytime Sightseeing',
        productLink: '/clothing'
      }
    ],
    promoEyebrow: 'DESTINATION APPROVED',
    promoTitle: 'Pack Lighter, Dress Better',
    promoDesc: 'Curating a capsule wardrobe that works overtime.',
    promoBanner: '/images/editorial-tall.webp',
    promoBtnText: 'Shop The Capsule',
    promoBtnLink: '/clothing',
    shopByTitle: 'Shop The Edit',
    shopByCards: [
      { visible: true, image: '/images/product-1.webp', title: 'Lounge Sets', desc: 'For the flight', btnText: 'Shop Now', link: '/clothing' },
      { visible: true, image: '/images/campaign-2.webp', title: 'Dresses', desc: 'One and done', btnText: 'Shop Now', link: '/clothing' },
      { visible: true, image: '/images/editorial-wide.webp', title: 'Light Outerwear', desc: 'Layering heroes', btnText: 'Shop Now', link: '/clothing' },
      { visible: true, image: '/images/product-4.webp', title: 'Swim & Cover', desc: 'Poolside ready', btnText: 'Shop Now', link: '/swimwear/all-swimwear' }
    ]
  },
  giftGuide: {
    heroEyebrow: 'GIFT GUIDE',
    heroTitle: 'The Art of Gifting',
    heroDesc: 'Curated presents for everyone on your list.',
    heroImage: '/images/campaign-2.webp',
    heroBtnText: 'Shop Gifts',
    heroBtnLink: '/clothing/all-clothing',
    categories: [
      {
        visible: true,
        label: 'LITTLE LUXURIES',
        desc: 'Small packages, big impact.',
        mainImage: '/images/product-2.webp',
        copyTitle: 'Thoughtful Details',
        copyDesc: 'From silk scrunchies to premium rib-knit socks, these are the elevated essentials they would never buy for themselves.',
        icon1Label: 'Price', icon1Value: 'Under $50',
        icon2Label: 'Occasion', icon2Value: 'Stocking Stuffers',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'THE COZY EDIT',
        desc: 'The gift of comfort.',
        mainImage: '/images/product-3.webp',
        copyTitle: 'Hibernation Mode',
        copyDesc: 'Plush robes, cashmere blend lounge sets, and incredibly soft oversized hoodies designed for winter weekends indoors.',
        icon1Label: 'Price', icon1Value: '$50 - $150',
        icon2Label: 'Occasion', icon2Value: 'For the Homebody',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'THE SHOWSTOPPERS',
        desc: 'When you really want to spoil them.',
        mainImage: '/images/editorial-wide.webp',
        copyTitle: 'Unforgettable Pieces',
        copyDesc: 'Statement coats, luxury silk sleepwear, and timeless leather accessories that will remain in their rotation for years.',
        icon1Label: 'Price', icon1Value: 'Over $150',
        icon2Label: 'Occasion', icon2Value: 'For the VIP',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'THE FAIL-SAFE',
        desc: 'You literally cannot get this wrong.',
        mainImage: '/images/campaign-1.webp',
        copyTitle: 'Universal Appeal',
        copyDesc: 'Our best-selling seamless tees and universal fit joggers. Loved by everyone, returned by no one.',
        icon1Label: 'Price', icon1Value: 'Various',
        icon2Label: 'Occasion', icon2Value: 'For Anyone',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'THE HOSTESS GIFT',
        desc: 'Better than a bottle of wine.',
        mainImage: '/images/product-4.webp',
        copyTitle: 'Home Upgrades',
        copyDesc: 'Luxe cashmere throws, signature scented candles, and elevated loungewear sets that make staying in feel like an event.',
        icon1Label: 'Price', icon1Value: 'Under $100',
        icon2Label: 'Occasion', icon2Value: 'Dinner Parties',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'THE WORKOUT ENTHUSIAST',
        desc: 'Performance wear that looks like streetwear.',
        mainImage: '/images/product-1.webp',
        copyTitle: 'Studio to Street',
        copyDesc: 'High-compression leggings and breathable crop tops that transition seamlessly from pilates to brunch.',
        icon1Label: 'Price', icon1Value: '$80 - $120',
        icon2Label: 'Occasion', icon2Value: 'For the Active',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'THE JETSETTER',
        desc: 'Gifts for their next getaway.',
        mainImage: '/images/editorial-tall.webp',
        copyTitle: 'First-Class Essentials',
        copyDesc: 'Travel-friendly knits, oversized cashmere wraps for chilly flights, and chic passport holders.',
        icon1Label: 'Price', icon1Value: 'Various',
        icon2Label: 'Occasion', icon2Value: 'For the Traveler',
        productLink: '/clothing'
      },
      {
        visible: true,
        label: 'THE SELF-CARE PACKAGE',
        desc: 'Because they deserve a break.',
        mainImage: '/images/product-3.webp',
        copyTitle: 'Pure Indulgence',
        copyDesc: 'Bundle a silk sleep mask with our softest modal pajamas for the ultimate night-in gift set.',
        icon1Label: 'Price', icon1Value: 'Under $100',
        icon2Label: 'Occasion', icon2Value: 'Just Because',
        productLink: '/clothing'
      }
    ],
    promoEyebrow: 'GIFT CARDS',
    promoTitle: 'Let Them Choose',
    promoDesc: 'Delivered instantly to their inbox.',
    promoBanner: '/images/editorial-tall.webp',
    promoBtnText: 'Send a Gift Card',
    promoBtnLink: '/clothing',
    shopByTitle: 'Shop By Price',
    shopByCards: [
      { visible: true, image: '/images/product-2.webp', title: 'Under $50', desc: 'Little luxuries', btnText: 'Shop Now', link: '/clothing' },
      { visible: true, image: '/images/product-3.webp', title: 'Under $100', desc: 'Crowd pleasers', btnText: 'Shop Now', link: '/clothing' },
      { visible: true, image: '/images/editorial-wide.webp', title: 'Over $150', desc: 'The showstoppers', btnText: 'Shop Now', link: '/clothing' },
      { visible: true, image: '/images/campaign-1.webp', title: 'Gift Cards', desc: 'The perfect fit', btnText: 'Shop Now', link: '/clothing' }
    ]
  }
};
