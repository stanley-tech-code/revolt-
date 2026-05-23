const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      if (file !== 'components') { // Skip components folder
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
      }
    } else {
      if (file.endsWith('.jsx') && !dirPath.endsWith('pages')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });
  return arrayOfFiles;
}

const pagesDir = path.join(__dirname, 'src/pages');
const allFiles = getAllFiles(pagesDir);

const allProducts = new Map();

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  
  // Extract category from folder name
  const folderName = path.basename(path.dirname(file));
  const categoryStr = folderName.charAt(0).toUpperCase() + folderName.slice(1);
  
  // Find all <Link ... </Link> blocks that contain "toggleWishlist"
  // Using a less greedy dotall approach or splitting by <Link
  const blocks = content.split('<Link');
  
  for (const block of blocks) {
    if (!block.includes('toggleWishlist')) continue;
    
    // Extract ID
    const idMatch = block.match(/toggleWishlist\('([^']+)'\)/);
    const id = idMatch ? idMatch[1] : `gen-${Date.now()}-${Math.random()}`;
    
    // Extract Name
    let name = 'Unknown Product';
    const nameMatch = block.match(/className="(?:product-name|rec-name)">([^<]+)<\/div>/);
    if (nameMatch) name = nameMatch[1].trim();
    
    // Extract Material
    let material = '';
    const matMatch = block.match(/className="(?:product-material|rec-material)">([^<]+)<\/div>/);
    if (matMatch) material = matMatch[1].trim();
    
    // Extract Price
    let price = 0;
    const priceMatch = block.match(/className="(?:price-sale|rec-price-sale|rec-price-only|price-original)">Ksh ([\d,]+)<\/span>/);
    if (priceMatch) {
      price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
    }
    
    // Extract Image
    let image = '/images/product-1.jpg';
    const imgMatch1 = block.match(/<img src="([^"]+)"[^>]*className="primary-img"/);
    const imgMatch2 = block.match(/<img src="([^"]+)"[^>]*alt="/); // fallback for rec-img
    if (imgMatch1) {
      image = imgMatch1[1];
    } else if (imgMatch2) {
      image = imgMatch2[1];
    }
    
    // Infer colors from name (e.g., "Dress - Black" or "Dress — Black")
    const colors = [];
    if (name.includes(' - ')) {
      colors.push(name.split(' - ')[1].trim());
    } else if (name.includes(' — ')) {
      colors.push(name.split(' — ')[1].trim());
    }
    
    const product = {
      id,
      name,
      price,
      stock: Math.floor(Math.random() * 15) + 1, // Random stock 1-15
      category: categoryStr,
      image,
      material,
      color: colors,
      description: 'Extracted from ' + categoryStr + ' collection.'
    };
    
    // Deduplicate by name to prevent massive bloating with identical products, 
    // but keep ID consistent if possible. Actually, deduplicating by name is better 
    // so we don't have 10 "Cotton Slip Dress" in the search results.
    if (!allProducts.has(name)) {
      allProducts.set(name, product);
    }
  }
}

const finalProductsList = Array.from(allProducts.values());

// Write to database.json
const dbPath = path.join(__dirname, 'server/db/database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

db.products = finalProductsList;

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`Successfully extracted ${finalProductsList.length} unique products from UI!`);
