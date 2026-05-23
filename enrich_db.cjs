const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'server/db/database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

db.products = db.products.map(p => {
  const enrichments = {
    color: [],
    size: ['XS', 'S', 'M', 'L', 'XL'],
    tags: [],
    material: '',
    style: '',
    description: ''
  };

  // Add mock details based on name
  if (p.name.toLowerCase().includes('tank')) {
    enrichments.color = ['Sand', 'Black', 'White'];
    enrichments.tags = ['summer', 'casual', 'sleeveless', 'basic'];
    enrichments.material = 'Cotton Rib';
    enrichments.style = 'Slim Fit';
    enrichments.description = 'A versatile, body-hugging tank top designed for everyday wear.';
  } else if (p.name.toLowerCase().includes('legging')) {
    enrichments.color = ['Clay', 'Black', 'Olive'];
    enrichments.tags = ['activewear', 'workout', 'compression', 'bottoms'];
    enrichments.material = 'Seamless Jersey';
    enrichments.style = 'High Rise';
    enrichments.description = 'Engineered for a second-skin feel, offering maximum compression and flexibility.';
  } else if (p.name.toLowerCase().includes('bodysuit')) {
    enrichments.color = ['Cocoa', 'Nude', 'Black'];
    enrichments.tags = ['seamless', 'shapewear', 'essential'];
    enrichments.material = 'Nylon Elastane';
    enrichments.style = 'Thong Back';
    enrichments.description = 'The ultimate smoothing layer that hugs your curves perfectly.';
  } else if (p.name.toLowerCase().includes('short')) {
    enrichments.color = ['Stone', 'Grey', 'Navy'];
    enrichments.tags = ['loungewear', 'casual', 'comfort'];
    enrichments.material = 'French Terry';
    enrichments.style = 'Relaxed Fit';
    enrichments.description = 'Ultra-comfortable shorts with an elastic waistband, perfect for lounging.';
  } else if (p.name.toLowerCase().includes('dress')) {
    enrichments.color = ['Clay', 'Black', 'Red', 'White'];
    enrichments.tags = ['elegant', 'evening', 'maxi', 'midi', 'slip'];
    enrichments.material = 'Ribbed Knit';
    enrichments.style = 'Bodycon';
    enrichments.description = 'A flattering silhouette that effortlessly transitions from day to night.';
  } else if (p.name.toLowerCase().includes('fragrance')) {
    enrichments.color = ['Clear'];
    enrichments.size = ['50ml', '100ml'];
    enrichments.tags = ['perfume', 'scent', 'beauty', 'gift'];
    enrichments.material = 'Glass Bottle';
    enrichments.style = 'Eau de Parfum';
    enrichments.description = 'A signature blend of warm amber, subtle florals, and earthy woods.';
  } else if (p.name.toLowerCase().includes('bra')) {
    enrichments.color = ['Sand', 'Black', 'Mocha'];
    enrichments.size = ['32A', '34B', '36C', '38D'];
    enrichments.tags = ['lingerie', 'support', 'underwire', 'seamless'];
    enrichments.material = 'Microfiber';
    enrichments.style = 'Push-Up';
    enrichments.description = 'Delivers ultimate lift and all-day comfort without sacrificing style.';
  }

  // Extract color from name if present
  if (p.name.includes('—')) {
    const parts = p.name.split('—');
    const colorStr = parts[1].trim();
    if (!enrichments.color.includes(colorStr)) {
      enrichments.color.push(colorStr);
    }
  }

  return { ...p, ...enrichments };
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Database enriched with search attributes!');
