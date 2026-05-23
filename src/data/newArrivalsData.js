export const newArrivalsGrid = [
  {
    id: 'newin-prod-1',
    name: 'Soft Lounge Long Slip Dress',
    material: 'Ribbed Knit',
    originalPrice: 12800,
    salePrice: 8960,
    primaryImage: '/images/product-1.jpg',
    secondaryImage: '/images/campaign-1.jpg',
    colors: ['#b09060', '#1a1a1a', '#f0ece6'],
    saleLabel: '30% OFF BI-ANNUAL SALE',
    isBestSeller: false,
    category: 'Dresses'
  },
  {
    id: 'newin-prod-2',
    name: 'Fits Everybody Mini Dress',
    material: 'Seamless Jersey',
    originalPrice: 9600,
    salePrice: 6720,
    primaryImage: '/images/product-2.jpg',
    secondaryImage: '/images/campaign-2.jpg',
    colors: ['#1a1a1a', '#c4967a', '#f0ece6'],
    saleLabel: '30% OFF BI-ANNUAL SALE',
    isBestSeller: false,
    category: 'Dresses'
  },
  {
    id: 'newin-prod-3',
    name: 'Cotton Rib Midi Dress',
    material: 'Cotton Rib',
    originalPrice: 10200,
    salePrice: 7140,
    primaryImage: '/images/product-3.jpg',
    secondaryImage: '/images/hero-dresses.png',
    colors: ['#f5f0ea', '#c8c0b8', '#1a1a1a', '#8a2020', '#3a6080'],
    saleLabel: '30% OFF BI-ANNUAL SALE',
    isBestSeller: true,
    category: 'Dresses'
  },
  {
    id: 'newin-prod-4',
    name: 'Bodycon Maxi Dress',
    material: 'Smooth Layers',
    originalPrice: 14000,
    salePrice: 9800,
    primaryImage: '/images/product-4.jpg',
    secondaryImage: '/images/hero.jpg',
    colors: ['#8a2020', '#c4967a'],
    saleLabel: '30% OFF BI-ANNUAL SALE',
    isBestSeller: false,
    category: 'Dresses'
  }
];

export const newArrivalsRecommendations = [
  {
    id: 'newin-prod-5',
    name: 'Oversized Low Rise Cargo Pant',
    material: 'Woven Cotton',
    originalPrice: 20800,
    salePrice: 14560,
    image: '/images/product-1.jpg',
    category: 'Pants'
  },
  {
    id: 'newin-prod-6',
    name: 'Wrap Top',
    material: 'Cotton Jersey',
    originalPrice: 9600,
    salePrice: 6720,
    image: '/images/product-2.jpg',
    category: 'Tops'
  },
  {
    id: 'newin-prod-7',
    name: 'Cropped Cardigan',
    material: 'Refined Knit',
    originalPrice: 15200,
    salePrice: 10640,
    image: '/images/product-3.jpg',
    category: 'Sweaters'
  },
  {
    id: 'newin-prod-8',
    name: 'Convertible Bikini Bottom',
    material: 'Iconic Swim',
    originalPrice: 11000,
    salePrice: 11000, // No sale
    image: '/images/product-4.jpg',
    category: 'Swim'
  },
  {
    id: 'newin-prod-9',
    name: 'High Leg Bikini Bottom',
    material: 'Iconic Swim',
    originalPrice: 8200,
    salePrice: 8200, // No sale
    image: '/images/campaign-1.jpg',
    category: 'Swim'
  }
];

// Combine them so Home.jsx can render all of them in the slider
export const allNewArrivalsData = [...newArrivalsGrid, ...newArrivalsRecommendations];
