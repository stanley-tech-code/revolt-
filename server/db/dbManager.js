import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'database.json');
const TEMP_DB_FILE = path.join(__dirname, 'database.tmp.json');

// Default starting dataset
const DEFAULT_DB = {
  homepage: {
    hero: {
      tagline: 'Volume 01 — The Essentials',
      title: 'REVOLT DROP',
      description: 'Designed for the Graze',
      buttonText: 'Shop Now',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-makeup-40283-large.mp4',
      useVideo: false
    },
    sections: [
      { id: 'sec-hero', name: 'Cinematic Hero Banner', type: 'hero', active: true },
      { id: 'sec-essentials', name: 'Essentials Grid Curation', type: 'curation', active: true },
      { id: 'sec-most-wanted', name: 'Most Wanted Horizontal Scroll', type: 'products', active: true },
      { id: 'sec-ethos', name: 'Brand Story Ethos Text', type: 'text-block', active: true, title: 'Designed to be felt, not seen.', text: 'DESIGNED TO BE FELT. ENGINEERED FABRICS. CONSIDERED SILHOUETTES. AND A WARM NEUTRAL LANGUAGE.' },
      { id: 'sec-editorial', name: 'Immersive Editorial Banner', type: 'editorial', active: true, title: 'Campaign', text: 'FULL-BLEED', image: '/images/editorial-wide.jpg' },
      { id: 'sec-new-arrivals', name: 'New Arrivals Horizontal Scroll', type: 'new-arrivals', active: true, title: 'New Arrivals', text: 'Explore the latest volumes.' },
      { id: 'sec-newsletter', name: 'Newsletter Subscription Form', type: 'newsletter', active: true, title: 'Join the uniform edit', text: 'Receive early previews of upcoming volumes, technical styling sessions, and complimentary standard shipping.' }
    ]
  },
  products: [
    { id: 'prod-1', name: 'Contour Tank — Sand', price: 68.00, stock: 12, category: 'Clothing', isFeatured: true, image: '/images/product-1.jpg', conversions: 42, revenue: 2856.00 },
    { id: 'prod-2', name: 'Second-Skin Legging — Clay', price: 98.00, stock: 8, category: 'Clothing', isFeatured: true, image: '/images/product-2.jpg', conversions: 35, revenue: 3430.00 },
    { id: 'prod-3', name: 'Essential Bodysuit — Cocoa', price: 88.00, stock: 4, category: 'Underwear', isFeatured: true, image: '/images/product-3.jpg', conversions: 51, revenue: 4488.00 },
    { id: 'prod-4', name: 'Relaxed Short — Stone', price: 58.00, stock: 15, category: 'Clothing', isFeatured: true, image: '/images/product-4.jpg', conversions: 19, revenue: 1102.00 },
    { id: 'prod-5', name: 'Ribbed Knit Dress — Clay', price: 138.00, stock: 3, category: 'Clothing', isFeatured: false, image: '/images/campaign-1.jpg', conversions: 24, revenue: 3312.00 },
    { id: 'prod-6', name: 'Premium Fragrance Volume 01', price: 110.00, stock: 0, category: 'Accessories', isFeatured: false, image: '/images/product-2.jpg', conversions: 8, revenue: 880.00 }
  ],
  orders: [
    { id: '1001', customer: 'Sophia Lauren', date: '2026-05-15T10:30:00Z', total: 254.00, status: 'Delivered', items: '2x Contour Tank, 1x Second-Skin Legging', tracking: 'DHL8274920' },
    { id: '1002', customer: 'Jessica Miller', date: '2026-05-16T14:15:00Z', total: 176.00, status: 'Processing', items: '2x Essential Bodysuit', tracking: '', refundStatus: '' },
    { id: '1003', customer: 'Emma Watson', date: '2026-05-17T09:45:00Z', total: 126.00, status: 'Pending', items: '1x Relaxed Short, 1x Contour Tank', tracking: '' }
  ],
  seo: {
    title: 'REVOLT — Refined Luxury Essentials',
    description: 'Minimalist active layers and luxury staples engineered for maximum compression and high-tension support.',
    googleAnalyticsId: 'G-REVOLT882',
    facebookPixelId: 'FB-9920184',
    promoBannerActive: true,
    promoBannerText: 'Complimentary standard shipping on all uniforms over $120'
  },
  admin: {
    currentUser: null,
    logs: [
      { id: 'log-1', user: 'system', action: 'Database initialized with Vol 01 standards', timestamp: '2026-05-17T22:30:00Z' }
    ]
  },
  users: []
};

export const dbManager = {
  // Read database.json synchronously
  read() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        // Create directory if not exists
        const dir = path.dirname(DB_FILE);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        this.write(DEFAULT_DB);
        return DEFAULT_DB;
      }
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const db = JSON.parse(raw);
      
      // Auto-migration: Ensure Immersive Editorial Banner is detected and injected
      let migrated = false;
      if (db.homepage && db.homepage.sections) {
        const hasEditorial = db.homepage.sections.some(s => s.type === 'editorial');
        if (!hasEditorial) {
          const editorialBlock = {
            id: 'sec-editorial',
            name: 'Immersive Editorial Banner',
            type: 'editorial',
            active: true,
            title: 'Volume 01 Campaign',
            text: 'Full-bleed luxury lifestyle visual campaign.',
            image: '/images/editorial-wide.jpg'
          };
          const newsletterIdx = db.homepage.sections.findIndex(s => s.id === 'sec-newsletter');
          if (newsletterIdx !== -1) {
            db.homepage.sections.splice(newsletterIdx, 0, editorialBlock);
          } else {
            db.homepage.sections.push(editorialBlock);
          }
          migrated = true;
        }
      }
      
      // Auto-migration: Ensure users array exists
      if (!db.users) {
        db.users = [];
        migrated = true;
      }

      if (migrated) {
        this.write(db);
      }
      
      return db;
    } catch (err) {
      console.error('Failed to read database file. Reverting to memory default.', err);
      return DEFAULT_DB;
    }
  },

  // Write database atomically to prevent file corruption
  write(data) {
    try {
      const serialized = JSON.stringify(data, null, 2);
      fs.writeFileSync(TEMP_DB_FILE, serialized, 'utf-8');
      fs.renameSync(TEMP_DB_FILE, DB_FILE);
      return true;
    } catch (err) {
      console.error('Atomic database write transaction failed!', err);
      return false;
    }
  },

  // Core retrieval methods
  getProducts() {
    return this.read().products;
  },

  getOrders() {
    return this.read().orders;
  },

  getUsers() {
    return this.read().users;
  },

  getSections() {
    return this.read().homepage.sections;
  },

  getHero() {
    return this.read().homepage.hero;
  },

  getSeo() {
    return this.read().seo;
  },

  getLogs() {
    return this.read().admin.logs;
  },

  // Save or update a product
  saveProduct(product) {
    const db = this.read();
    const idx = db.products.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      db.products[idx] = { ...db.products[idx], ...product };
    } else {
      db.products.push(product);
    }
    this.write(db);
    return product;
  },

  // Delete a product
  deleteProduct(id) {
    const db = this.read();
    db.products = db.products.filter(p => p.id !== id);
    this.write(db);
    return true;
  },

  // Save or update an order
  saveOrder(order) {
    const db = this.read();
    const idx = db.orders.findIndex(o => o.id === order.id);
    if (idx !== -1) {
      db.orders[idx] = { ...db.orders[idx], ...order };
    } else {
      db.orders.push(order);
    }
    this.write(db);
    return order;
  },

  // Save or update a user profile
  saveUser(user) {
    const db = this.read();
    const idx = db.users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      db.users[idx] = { ...db.users[idx], ...user };
    } else {
      db.users.push(user);
    }
    this.write(db);
    return user;
  },

  // Delete a user
  deleteUser(id) {
    const db = this.read();
    db.users = db.users.filter(u => u.id !== id);
    this.write(db);
    return true;
  },

  // Save layout sections
  saveSections(sections) {
    const db = this.read();
    db.homepage.sections = sections;
    this.write(db);
    return sections;
  },

  // Save Hero details
  saveHero(hero) {
    const db = this.read();
    db.homepage.hero = hero;
    this.write(db);
    return hero;
  },

  // Save SEO variables
  saveSeo(seo) {
    const db = this.read();
    db.seo = seo;
    this.write(db);
    return seo;
  },

  // Append a secure audit activity log
  addLog(user, action) {
    const db = this.read();
    const newLog = {
      id: `log-${Date.now()}`,
      user,
      action,
      timestamp: new Date().toISOString()
    };
    db.admin.logs.unshift(newLog);
    // Keep last 100 logs
    if (db.admin.logs.length > 100) {
      db.admin.logs.pop();
    }
    this.write(db);
    return newLog;
  }
};
