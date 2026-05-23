const fs = require('fs');
const path = require('path');

const generateProducts = () => {
  const products = [];
  const categories = {
    'clothing': ['tees-tanks', 'shorts', 'dresses', 'pants', 'leggings', 'sweatshirts', 'tops-bodysuits', 'pajamas', 'shapewear', 'hoodies', 'skirts'],
    'swimwear': ['bikinis', 'swimsuits', 'swim-cover-ups'],
    'bras': ['strapless', 'full-coverage', 'lined', 'unlined', 't-shirt-bras', 'push-up', 'lightly-lined', 'everyday-comfort'],
    'underwear': ['seamless', 'thongs', 'cheeky', 'multi-packs'],
    'accessories': ['bags', 'glasses-shades', 'belts', 'perfumes']
  };

  const images = [
    '/images/product-1.jpg',
    '/images/product-2.jpg',
    '/images/product-3.jpg',
    '/images/product-4.jpg',
    '/images/campaign-1.jpg',
    '/images/campaign-2.jpg',
    '/images/hero-dresses.png',
    '/images/hero.jpg'
  ];

  const colors = [
    { name: 'Onyx', hex: '#1a1a1a' },
    { name: 'Desert', hex: '#b5a090' },
    { name: 'Cream', hex: '#f0ead8' },
    { name: 'Sienna', hex: '#8a2020' },
    { name: 'Cocoa', hex: '#c4967a' }
  ];

  const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2X', '3X'];

  let idCounter = 1;

  for (const [mainCat, subCats] of Object.entries(categories)) {
    for (const subCat of subCats) {
      // Generate 4-8 products per subcategory
      const numProducts = Math.floor(Math.random() * 5) + 4;
      for (let i = 0; i < numProducts; i++) {
        const originalPrice = Math.floor(Math.random() * 10000) + 5000;
        const isSale = Math.random() > 0.5;
        const salePrice = isSale ? Math.floor(originalPrice * 0.7) : originalPrice;
        
        const primaryImg = images[Math.floor(Math.random() * images.length)];
        let secondaryImg = images[Math.floor(Math.random() * images.length)];
        while(secondaryImg === primaryImg) {
          secondaryImg = images[Math.floor(Math.random() * images.length)];
        }

        // Generate 1-4 random colors
        const productColors = colors.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 1);

        const prodName = `${subCat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} ${i + 1}`;

        products.push({
          id: `prod-${idCounter++}`,
          name: prodName,
          mainCategory: mainCat,
          subCategory: subCat,
          material: ['Cotton Rib', 'Seamless Jersey', 'Woven Cotton', 'Smooth Layers'][Math.floor(Math.random() * 4)],
          description: `This is a high quality ${prodName.toLowerCase()} designed for ultimate comfort and style.`,
          originalPrice: originalPrice,
          salePrice: salePrice,
          primaryImage: primaryImg,
          secondaryImage: secondaryImg,
          allImages: [primaryImg, secondaryImg, images[Math.floor(Math.random() * images.length)]],
          colors: productColors,
          sizes: sizes,
          saleLabel: isSale ? '30% OFF BI-ANNUAL SALE' : '',
          isBestSeller: Math.random() > 0.8,
          isNewArrival: Math.random() > 0.7
        });
      }
    }
  }

  return products;
};

const dbPath = path.join(__dirname, 'server', 'db', 'database.json');
const db = {
  products: generateProducts(),
  seo: {
    title: "REVOLT | Official Site",
    description: "Discover the latest in fashion and essentials."
  }
};

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Successfully generated ${db.products.length} products in database.json`);
