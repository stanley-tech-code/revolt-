const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'server/db/database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Generate a comprehensive product catalog
const newProducts = [
  // Dresses
  { id: 'prod-d1', name: 'Ribbed Knit Dress — Clay', price: 138, category: 'Dresses', image: '/images/campaign-1.jpg', color: ['Clay', 'Black', 'Red'], size: ['XS', 'S', 'M', 'L'], material: 'Ribbed Knit', style: 'Bodycon', description: 'Flattering evening dress.', tags: ['elegant', 'maxi'], stock: 5 },
  { id: 'prod-d2', name: 'Cotton Slip Dress — Black', price: 89, category: 'Dresses', image: '/images/product-2.jpg', color: ['Black', 'White'], size: ['S', 'M', 'L'], material: 'Cotton', style: 'Slip', description: 'Lightweight summer dress.', tags: ['casual', 'summer', 'mini'], stock: 12 },
  
  // Hoodies & Sweatshirts
  { id: 'prod-h1', name: 'Oversized Fleece Hoodie — Ash', price: 110, category: 'Hoodies', image: '/images/product-3.jpg', color: ['Ash', 'Black', 'Navy'], size: ['S', 'M', 'L', 'XL'], material: 'Fleece Cotton', style: 'Oversized', description: 'Ultra cozy heavy fleece hoodie for winter.', tags: ['winter', 'cozy', 'streetwear', 'loungewear'], stock: 8 },
  { id: 'prod-h2', name: 'Cropped Zip Hoodie — Sand', price: 95, category: 'Hoodies', image: '/images/product-4.jpg', color: ['Sand', 'White'], size: ['XS', 'S', 'M'], material: 'French Terry', style: 'Cropped', description: 'Perfect layering piece for the gym.', tags: ['activewear', 'gym', 'casual'], stock: 15 },
  { id: 'prod-sw1', name: 'Crewneck Sweatshirt — Olive', price: 85, category: 'Sweatshirts', image: '/images/campaign-2.jpg', color: ['Olive', 'Grey'], size: ['M', 'L', 'XL'], material: 'Cotton Blend', style: 'Relaxed', description: 'Everyday crewneck for ultimate comfort.', tags: ['loungewear', 'basic'], stock: 20 },
  
  // Pants & Leggings
  { id: 'prod-p1', name: 'Straight Leg Cargo Pant — Stone', price: 145, category: 'Pants', image: '/images/product-1.jpg', color: ['Stone', 'Black', 'Khaki'], size: ['28', '30', '32', '34'], material: 'Woven Cotton', style: 'Low Rise', description: 'Utilitarian chic cargo pants with multiple pockets.', tags: ['streetwear', 'utility', 'casual'], stock: 4 },
  { id: 'prod-p2', name: 'Second-Skin Legging — Clay', price: 98, category: 'Leggings', image: '/images/product-2.jpg', color: ['Clay', 'Black', 'Olive'], size: ['XS', 'S', 'M', 'L'], material: 'Seamless Jersey', style: 'High Rise', description: 'Maximum compression and flexibility.', tags: ['activewear', 'workout', 'yoga'], stock: 2 },
  
  // Tops & Bodysuits
  { id: 'prod-t1', name: 'Contour Tank — Sand', price: 68, category: 'Tees & Tanks', image: '/images/product-1.jpg', color: ['Sand', 'Black', 'White'], size: ['XS', 'S', 'M', 'L'], material: 'Cotton Rib', style: 'Slim Fit', description: 'Body-hugging tank top.', tags: ['summer', 'casual', 'basic'], stock: 6 },
  { id: 'prod-t2', name: 'Essential Bodysuit — Cocoa', price: 88, category: 'Tops & Bodysuits', image: '/images/product-3.jpg', color: ['Cocoa', 'Nude', 'Black'], size: ['S', 'M', 'L'], material: 'Nylon Elastane', style: 'Thong Back', description: 'Smoothing layer that hugs your curves.', tags: ['seamless', 'shapewear'], stock: 3 },
  
  // Bras & Underwear
  { id: 'prod-b1', name: 'Sculpting Uplift Bra — Sand', price: 52, category: 'Bras', image: '/images/product-4.jpg', color: ['Sand', 'Black', 'Mocha'], size: ['32A', '34B', '36C'], material: 'Microfiber', style: 'Push-Up', description: 'Ultimate lift and all-day comfort.', tags: ['lingerie', 'support', 'underwire'], stock: 12 },
  { id: 'prod-b2', name: 'Seamless T-Shirt Bra — Black', price: 48, category: 'Bras', image: '/images/product-2.jpg', color: ['Black', 'Nude'], size: ['34B', '36C', '38D'], material: 'Spandex Blend', style: 'Lightly Lined', description: 'Invisible under any top.', tags: ['everyday', 'seamless'], stock: 18 },
  { id: 'prod-u1', name: 'Cotton Rib Thong — White', price: 22, category: 'Underwear', image: '/images/product-1.jpg', color: ['White', 'Black', 'Grey'], size: ['XS', 'S', 'M', 'L'], material: 'Cotton', style: 'Thong', description: 'Breathable everyday comfort.', tags: ['panty', 'basic'], stock: 30 },
  
  // Swimwear
  { id: 'prod-swm1', name: 'Convertible Bikini Top — Azure', price: 65, category: 'Swimwear', image: '/images/campaign-1.jpg', color: ['Azure', 'Black', 'Red'], size: ['S', 'M', 'L'], material: 'Swim Nylon', style: 'Bandeau', description: 'Adjustable straps for multiple looks.', tags: ['beach', 'summer', 'vacation'], stock: 10 },
  { id: 'prod-swm2', name: 'High Leg Bikini Bottom — Azure', price: 55, category: 'Swimwear', image: '/images/campaign-2.jpg', color: ['Azure', 'Black', 'Red'], size: ['XS', 'S', 'M', 'L'], material: 'Swim Nylon', style: 'Cheeky', description: 'Flattering high cut design.', tags: ['beach', 'summer'], stock: 15 },
  { id: 'prod-swm3', name: 'One Piece Plunge Swimsuit — Black', price: 120, category: 'Swimwear', image: '/images/product-3.jpg', color: ['Black', 'White'], size: ['S', 'M', 'L'], material: 'Ribbed Swim', style: 'Plunge', description: 'Classic silhouette with a deep V neck.', tags: ['beach', 'resort', 'one-piece'], stock: 5 },
  
  // Accessories
  { id: 'prod-a1', name: 'Premium Fragrance Volume 01', price: 110, category: 'Accessories', image: '/images/product-2.jpg', color: ['Clear'], size: ['50ml'], material: 'Glass', style: 'Eau de Parfum', description: 'Warm amber, subtle florals, and earthy woods.', tags: ['perfume', 'scent', 'gift'], stock: 0 },
  { id: 'prod-a2', name: 'Oversized Cat Eye Sunglasses — Tortoise', price: 185, category: 'Accessories', image: '/images/product-4.jpg', color: ['Tortoise', 'Black'], size: ['OS'], material: 'Acetate', style: 'Cat Eye', description: 'UV400 protection with a vintage flair.', tags: ['glasses', 'shades', 'summer'], stock: 7 },
  { id: 'prod-a3', name: 'Leather Crossbody Bag — Camel', price: 250, category: 'Accessories', image: '/images/campaign-1.jpg', color: ['Camel', 'Black'], size: ['OS'], material: 'Vegan Leather', style: 'Crossbody', description: 'Compact but roomy daily bag.', tags: ['bag', 'purse', 'gifting'], stock: 3 },
  
  // Maternity & Shapewear
  { id: 'prod-m1', name: 'Maternity Support Legging — Black', price: 105, category: 'Maternity', image: '/images/product-1.jpg', color: ['Black'], size: ['S', 'M', 'L', 'XL'], material: 'Stretch Blend', style: 'Over-the-belly', description: 'Grows with you for ultimate comfort.', tags: ['pregnancy', 'activewear', 'support'], stock: 14 }
];

db.products = newProducts;

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Massive product catalog generated!');
