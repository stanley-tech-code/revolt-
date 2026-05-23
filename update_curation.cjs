const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'db', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Find curation section
const curationSec = db.homepage.sections.find(s => s.id === 'sec-curation');

if (curationSec) {
  curationSec.mainItem = {
    title: "Bikinis",
    link: "/swimwear/bikinis",
    image: "/images/campaign-2.jpg"
  };
  
  curationSec.subItems = [
    {
      title: "Glasses & Shades",
      link: "/accessories/glasses-shades",
      image: "/images/product-3.jpg"
    },
    {
      title: "Perfumes",
      link: "/accessories/perfumes",
      image: "/images/campaign-1.jpg"
    }
  ];
  
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log("Curation section updated successfully!");
} else {
  console.log("Curation section not found.");
}
