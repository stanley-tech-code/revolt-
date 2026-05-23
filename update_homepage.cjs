const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'db', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Only the requested sections, in the exact order requested
db.homepage.sections = [
  { 
    id: 'sec-hero', 
    type: 'hero', 
    active: true 
  },
  { 
    id: 'sec-products', 
    type: 'products', 
    active: true,
    title: 'Most Wanted',
    categories: [
      { name: 'Thongs', link: '/underwear/thongs', image: '/images/product-4.jpg' },
      { name: 'Pants', link: '/clothing/pants', image: '/images/product-2.jpg' },
      { name: 'T-Shirt Bras', link: '/bras/t-shirt-bras', image: '/images/product-3.jpg' },
      { name: 'Tees & Tanks', link: '/clothing/tees-tanks', image: '/images/product-1.jpg' }
    ]
  },
  { 
    id: 'sec-editorial', 
    type: 'editorial', 
    active: true, 
    title: "Volume 01", 
    text: "Technical Layers for Maximum Support", 
    image: "/images/editorial-wide.jpg" 
  },
  { 
    id: 'sec-new-arrivals', 
    type: 'new-arrivals', 
    active: true,
    title: 'New Arrivals'
  },
  { 
    id: 'sec-curation', 
    type: 'curation', 
    active: true,
    title: 'Curated For You',
    mainItem: { title: "The Lounge Edit", image: "/images/campaign-2.jpg", link: "/other/lounge" },
    subItems: [
      { title: "Shapewear Edit", image: "/images/product-3.jpg", link: "/clothing/shapewear" },
      { title: "Knit Series", image: "/images/campaign-1.jpg", link: "/clothing/clothing" }
    ]
  },
  { 
    id: 'sec-text-block', 
    type: 'text-block', 
    active: true, 
    title: "Our Ethos", 
    text: "We believe in clothing that empowers you to move with confidence. Every seam, every fabric choice, is designed with purpose." 
  }
];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Homepage sections dynamically ordered and updated in database.json!');
