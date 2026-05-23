const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src/pages');
const categories = ['clothing', 'bras', 'swimwear', 'accessories', 'underwear', 'new-in'];

categories.forEach(category => {
  const categoryDir = path.join(pagesDir, category);
  if (!fs.existsSync(categoryDir)) return;

  const files = fs.readdirSync(categoryDir).filter(file => file.endsWith('.jsx') && file !== 'ClothingGuide.jsx' && file !== 'BraFitGuide.jsx' && file !== 'UnderwearGuide.jsx' && file !== 'SwimFitGuide.jsx');

  files.forEach(file => {
    const filePath = path.join(categoryDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already updated
    if (content.includes('useStore')) return;

    // 1. Add imports
    content = content.replace(
      "import React, { useEffect } from 'react';",
      "import React, { useEffect, useState } from 'react';\nimport { useStore } from '../../context/StoreContext';"
    );

    // 2. Add hooks
    const componentMatch = content.match(/export default function ([a-zA-Z0-9]+)\(\) \{/);
    if (componentMatch) {
      const componentName = componentMatch[1];
      content = content.replace(
        `export default function ${componentName}() {`,
        `export default function ${componentName}() {\n  const { toggleWishlist, wishlist } = useStore();\n  const [sortBy, setSortBy] = useState('NEWEST');`
      );
    }

    // 3. Update filter buttons
    content = content.replace(
      /<button className="filter-btn">PRICE/g,
      `<button className="filter-btn" onClick={() => setSortBy('PRICE')} style={{ fontWeight: sortBy === 'PRICE' ? '700' : '500' }}>PRICE`
    );
    content = content.replace(
      /<button className="filter-btn">NEWEST/g,
      `<button className="filter-btn" onClick={() => setSortBy('NEWEST')} style={{ fontWeight: sortBy === 'NEWEST' ? '700' : '500' }}>NEWEST`
    );
    content = content.replace(
      /<button className="filter-btn">OLDEST/g,
      `<button className="filter-btn" onClick={() => setSortBy('OLDEST')} style={{ fontWeight: sortBy === 'OLDEST' ? '700' : '500' }}>OLDEST`
    );
    content = content.replace(
      /<button className="filter-btn">COLOR/g,
      `<button className="filter-btn" onClick={() => setSortBy('COLOR')} style={{ fontWeight: sortBy === 'COLOR' ? '700' : '500' }}>COLOR`
    );

    // 4. Update wishlist buttons
    // Since we don't have dynamic IDs, we'll just use a generic hash based on the string or just 'prod-demo'
    // To make them toggle individually, we can use a random ID or index. 
    // We can replace all `<button className="wishlist-btn">` with a regex function
    let wishlistCounter = 0;
    content = content.replace(/<button className="wishlist-btn"( style=\{\{ zIndex: 10 \}\})?>\s*<svg viewBox="0 0 24 24" fill="none" stroke="[^"]+" strokeWidth="1\.5">\s*<path d="M20\.84 4\.61a5\.5 5\.5 0 0 0-7\.78 0L12 5\.67l-1\.06-1\.06a5\.5 5\.5 0 0 0-7\.78 7\.78l1\.06 1\.06L12 21\.23l7\.78-7\.78 1\.06-1\.06a5\.5 5\.5 0 0 0 0-7\.78z"\/>\s*<\/svg>\s*<\/button>/g, (match, p1) => {
      wishlistCounter++;
      const id = `${componentMatch[1].toLowerCase()}-prod-${wishlistCounter}`;
      const styleAttr = p1 ? p1 : '';
      return `<button className="wishlist-btn"${styleAttr} onClick={(e) => { e.preventDefault(); toggleWishlist('${id}'); }}>
                <svg viewBox="0 0 24 24" fill={wishlist.includes('${id}') ? '#1a1a1a' : 'none'} stroke={wishlist.includes('${id}') ? '#1a1a1a' : '#000'} strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>`;
    });

    // Also replace the simpler SVG in recommendations if different
    content = content.replace(/<button className="wishlist-btn">\s*<svg viewBox="0 0 24 24"><path d="M20\.84 4\.61a5\.5 5\.5 0 0 0-7\.78 0L12 5\.67l-1\.06-1\.06a5\.5 5\.5 0 0 0-7\.78 7\.78l1\.06 1\.06L12 21\.23l7\.78-7\.78 1\.06-1\.06a5\.5 5\.5 0 0 0 0-7\.78z"\/><\/svg>\s*<\/button>/g, (match) => {
      wishlistCounter++;
      const id = `${componentMatch[1].toLowerCase()}-prod-${wishlistCounter}`;
      return `<button className="wishlist-btn" onClick={(e) => { e.preventDefault(); toggleWishlist('${id}'); }}>
                <svg viewBox="0 0 24 24" fill={wishlist.includes('${id}') ? '#1a1a1a' : 'none'} stroke={wishlist.includes('${id}') ? '#1a1a1a' : '#000'} strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>`;
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  });
});
