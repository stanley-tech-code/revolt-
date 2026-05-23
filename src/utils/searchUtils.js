// A robust client-side search utility for matching products

// Helper for fuzzy string matching (checks if all chars in query appear in sequence in the target)
// Helper for fuzzy string matching (checks if all chars in query appear in sequence in the target)
// Helper for fuzzy string matching (checks if query is a substring or prefix)
function fuzzyMatch(query, target) {
  if (!query) return true;
  if (!target) return false;
  
  query = query.toLowerCase().trim();
  target = target.toLowerCase().trim();
  
  // Strip trailing 's' for simple plural matching
  const singularQuery = query.endsWith('s') ? query.slice(0, -1) : query;
  const singularTarget = target.endsWith('s') ? target.slice(0, -1) : target;
  
  // Exact match gets highest score
  if (target === query || singularTarget === singularQuery) return 100;
  
  // Substring match gets high score
  if (target.includes(query) || target.includes(singularQuery) || query.includes(singularTarget)) return 50;
  
  // Check if any word in the target starts with the query (e.g. "hood" matches "hoodie")
  const targetWords = target.split(/[\\s\\-—,.]+/);
  for (const word of targetWords) {
    if (word.startsWith(query) || word.startsWith(singularQuery)) {
      return 30; // Prefix match
    }
  }
  
  return 0;
}

export function performSearch(query, products) {
  if (!query || query.trim() === '') return products;
  
  const lowerQuery = query.toLowerCase().trim();
  
  // Parse special price queries like "under 50" or "< 100"
  let maxPrice = null;
  let minPrice = null;
  
  const underMatch = lowerQuery.match(/(?:under|<)\s*(\d+)/);
  if (underMatch) {
    maxPrice = parseInt(underMatch[1], 10);
  }
  
  const overMatch = lowerQuery.match(/(?:over|>)\s*(\d+)/);
  if (overMatch) {
    minPrice = parseInt(overMatch[1], 10);
  }

  // Tokenize the query for multi-word searches (e.g. "black dress")
  const tokens = lowerQuery
    .replace(/(?:under|<|>|over)\s*\d+/g, '') // Remove price commands from tokens
    .split(/\s+/)
    .filter(t => t.length > 0);
    
  return products.map(product => {
    let score = 0;
    
    // 1. Price Filtering (Immediate exclusion if it fails)
    if (maxPrice !== null && product.salePrice >= maxPrice) return { product, score: -1 };
    if (minPrice !== null && product.salePrice <= minPrice) return { product, score: -1 };
    
    // If there are no tokens (e.g., only searched "under 50"), just return it as a match
    if (tokens.length === 0) {
      score = 10;
      return { product, score };
    }
    
    // 2. Token Matching
    // Every token must match *something* in the product for it to be a strong result.
    for (const token of tokens) {
      let tokenScore = 0;
      
      // Check Name
      tokenScore = Math.max(tokenScore, fuzzyMatch(token, product.name) * 2);
      
      // Check Category
      tokenScore = Math.max(tokenScore, fuzzyMatch(token, product.subCategory) * 1.5);
      tokenScore = Math.max(tokenScore, fuzzyMatch(token, product.mainCategory) * 1.5);
      
      // Check Description
      tokenScore = Math.max(tokenScore, fuzzyMatch(token, product.description));
      
      // Check Material & Style
      tokenScore = Math.max(tokenScore, fuzzyMatch(token, product.material));
      tokenScore = Math.max(tokenScore, fuzzyMatch(token, product.style));
      
      // Check Colors array
      if (product.colors && Array.isArray(product.colors)) {
        for (const c of product.colors) {
          tokenScore = Math.max(tokenScore, fuzzyMatch(token, c.name) * 1.5);
        }
      }
      
      // Check Tags array
      if (product.tags && Array.isArray(product.tags)) {
        for (const t of product.tags) {
          tokenScore = Math.max(tokenScore, fuzzyMatch(token, t));
        }
      }
      
      // Check Sizes array
      if (product.sizes && Array.isArray(product.sizes)) {
        for (const s of product.sizes) {
          if (s.toLowerCase() === token) tokenScore = Math.max(tokenScore, 100);
        }
      }
      
      // If a token didn't match anything, heavily penalize or exclude (acts like an AND search)
      if (tokenScore === 0) {
        score = -1;
        break; // Fail this product
      } else {
        score += tokenScore;
      }
    }
    
    return { product, score };
  })
  .filter(result => result.score > 0)
  .sort((a, b) => b.score - a.score)
  .map(result => result.product);
}
