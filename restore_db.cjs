/**
 * restore_db.cjs
 * Restores Supabase products & CMS data from the local database.json backup.
 * Run with: node restore_db.cjs
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌  Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function restore() {
  const dbPath = path.join(__dirname, 'server', 'db', 'database.json');
  const raw = fs.readFileSync(dbPath, 'utf-8');
  const db = JSON.parse(raw);

  // ── 1. RESTORE PRODUCTS ────────────────────────────────────────────────────
  const products = (db.products || []).map(p => ({
    name: p.name || '',
    mainCategory: p.mainCategory || '',
    subCategory: p.subCategory || '',
    material: p.material || '',
    description: p.description || '',
    originalPrice: Number(p.originalPrice || 0),
    salePrice: Number(p.salePrice || 0),
    primaryImage: p.primaryImage || '',
    secondaryImage: p.secondaryImage || '',
    allImages: Array.isArray(p.allImages) ? p.allImages : [],
    colors: Array.isArray(p.colors) ? p.colors : [],
    sizes: Array.isArray(p.sizes) ? p.sizes : [],
    saleLabel: p.saleLabel || '',
    isBestSeller: p.isBestSeller || false,
    isNewArrival: p.isNewArrival || false,
    stock: p.stock !== undefined ? Number(p.stock) : 50,
    status: p.status || 'Active',
    conversions: p.conversions || 0,
    revenue: Number(p.revenue || 0),
  }));

  console.log(`📦  Found ${products.length} products in database.json`);

  // Clear existing products first
  const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.error('❌  Failed to clear products table:', deleteError.message);
    process.exit(1);
  }
  console.log('🗑️   Cleared existing products from Supabase.');

  // Insert in batches of 50 (Supabase limit)
  const BATCH = 50;
  let inserted = 0;
  for (let i = 0; i < products.length; i += BATCH) {
    const batch = products.slice(i, i + BATCH);
    const { error } = await supabase.from('products').insert(batch);
    if (error) {
      console.error(`❌  Failed to insert batch starting at ${i}:`, error.message);
      process.exit(1);
    }
    inserted += batch.length;
    console.log(`   ✓ Inserted ${inserted}/${products.length} products…`);
  }
  console.log(`✅  All ${inserted} products restored successfully.\n`);

  // ── 2. RESTORE CMS (sections / hero / seo) ────────────────────────────────
  const homepage = db.homepage || {};
  const sections = homepage.sections || [];
  const hero = homepage.hero || {};
  const seo = db.seo || {};

  // Upsert sections
  if (sections.length > 0 || Object.keys(hero).length > 0) {
    const { error: secErr } = await supabase.from('cms').upsert({ type: 'sections', data: sections });
    if (secErr) console.error('⚠️   Failed to restore sections:', secErr.message);
    else console.log('✅  CMS sections restored.');

    const { error: heroErr } = await supabase.from('cms').upsert({ type: 'hero', data: hero });
    if (heroErr) console.error('⚠️   Failed to restore hero:', heroErr.message);
    else console.log('✅  CMS hero restored.');
  }

  if (Object.keys(seo).length > 0) {
    const { error: seoErr } = await supabase.from('cms').upsert({ type: 'seo', data: seo });
    if (seoErr) console.error('⚠️   Failed to restore SEO:', seoErr.message);
    else console.log('✅  CMS SEO restored.');
  }

  console.log('\n🎉  Database restore complete!');
}

restore().catch(err => {
  console.error('❌  Unexpected error:', err);
  process.exit(1);
});
