const fs = require('fs');
const path = require('path');

// Simulated searchUtils.js
function fuzzyMatch(query, target) {
  if (!query) return true;
  if (!target) return false;
  
  query = query.toLowerCase().trim();
  target = target.toLowerCase().trim();
  
  const singularQuery = query.endsWith('s') ? query.slice(0, -1) : query;
  const singularTarget = target.endsWith('s') ? target.slice(0, -1) : target;
  
  if (target === query || singularTarget === singularQuery) return 100;
  if (target.includes(query) || target.includes(singularQuery) || query.includes(singularTarget)) return 50;
  
  let qIdx = 0;
  for (let i = 0; i < target.length; i++) {
    if (qIdx < query.length && target[i] === query[qIdx]) {
      qIdx++;
    }
  }
  
  if (qIdx >= Math.floor(query.length * 0.8)) {
    return 20; 
  }
  
  return 0;
}

function performSearch(query, products) {
  if (!query || query.trim() === '') return products;
  
  const lowerQuery = query.toLowerCase().trim();
  
  let maxPrice = null;
  let minPrice = null;
  
  const underMatch = lowerQuery.match(/(?:under|<)\s*(\d+)/);
  if (underMatch) maxPrice = parseInt(underMatch[1], 10);
  
  const overMatch = lowerQuery.match(/(?:over|>)\s*(\d+)/);
  if (overMatch) minPrice = parseInt(overMatch[1], 10);

  const tokens = lowerQuery
    .replace(/(?:under|<|>|over)\s*\d+/g, '') 
    .split(/\s+/)
    .filter(t => t.length > 0);
    
  return products.map(product => {
    let score = 0;
    
    if (maxPrice !== null && product.price >= maxPrice) return { product, score: -1 };
    if (minPrice !== null && product.price <= minPrice) return { product, score: -1 };
    
    if (tokens.length === 0) {
      score = 10;
      return { product, score };
    }
    
    for (const token of tokens) {
      let tokenScore = 0;
      
      tokenScore = Math.max(tokenScore, fuzzyMatch(token, product.name) * 2);
      tokenScore = Math.max(tokenScore, fuzzyMatch(token, product.category) * 1.5);
      tokenScore = Math.max(tokenScore, fuzzyMatch(token, product.description));
      tokenScore = Math.max(tokenScore, fuzzyMatch(token, product.material));
      tokenScore = Math.max(tokenScore, fuzzyMatch(token, product.style));
      
      if (product.color && Array.isArray(product.color)) {
        for (const c of product.color) tokenScore = Math.max(tokenScore, fuzzyMatch(token, c) * 1.5);
      }
      
      if (product.tags && Array.isArray(product.tags)) {
        for (const t of product.tags) tokenScore = Math.max(tokenScore, fuzzyMatch(token, t));
      }
      
      if (product.size && Array.isArray(product.size)) {
        for (const s of product.size) {
          if (s.toLowerCase() === token) tokenScore = Math.max(tokenScore, 100);
        }
      }
      
      if (tokenScore === 0) {
        score = -1;
        break; 
      } else {
        score += tokenScore;
      }
    }
    
    return { product, score };
  })
  .filter(result => result.score > 0)
  .sort((a, b) => b.score - a.score)
  .map(result => ({ name: result.product.name, score: result.score }));
}

const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'server/db/database.json'), 'utf8'));

console.log('Search "hoodie":', performSearch('hoodie', db.products));
console.log('Search "black":', performSearch('black', db.products));
console.log('Search "dress under 100":', performSearch('dress under 100', db.products));
console.log('Search "bikini":', performSearch('bikini', db.products));
console.log('Search "skirt":', performSearch('skirt', db.products));

