import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase } from './db/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrate = async () => {
  console.log('--- Starting Migration to Supabase ---');

  const dbPath = path.join(__dirname, 'db', 'database.json');
  if (!fs.existsSync(dbPath)) {
    console.error('database.json not found!');
    process.exit(1);
  }

  const raw = fs.readFileSync(dbPath, 'utf8');
  const data = JSON.parse(raw);

  try {
    // We assume the tables are completely empty or we ignore errors for duplicates.

    // Migrate Users
    if (data.users && data.users.length > 0) {
      const { error } = await supabase.from('users').insert(data.users.map(u => {
        const { id, ...rest } = u; // remove old string id to let postgres generate uuid
        return rest;
      }));
      if (error) console.error('Error migrating users:', error);
      else console.log(`Migrated ${data.users.length} users.`);
    }

    // Migrate Products
    if (data.products && data.products.length > 0) {
      const { error } = await supabase.from('products').insert(data.products.map(p => {
        const { id, ...rest } = p;
        return rest;
      }));
      if (error) console.error('Error migrating products:', error);
      else console.log(`Migrated ${data.products.length} products.`);
    }

    // Migrate Orders
    if (data.orders && data.orders.length > 0) {
      const { error } = await supabase.from('orders').insert(data.orders.map(o => {
        const { id, ...rest } = o;
        return rest;
      }));
      if (error) console.error('Error migrating orders:', error);
      else console.log(`Migrated ${data.orders.length} orders.`);
    }

    // Migrate Logs
    if (data.logs && data.logs.length > 0) {
      const { error } = await supabase.from('logs').insert(data.logs.map(l => {
        const { id, ...rest } = l;
        return rest;
      }));
      if (error) console.error('Error migrating logs:', error);
      else console.log(`Migrated ${data.logs.length} logs.`);
    }

    // Migrate CMS (Sections, Hero, SEO)
    if (data.homepage) {
      if (data.homepage.sections) await supabase.from('cms').upsert({ type: 'sections', data: data.homepage.sections });
      if (data.homepage.hero) await supabase.from('cms').upsert({ type: 'hero', data: data.homepage.hero });
    }
    if (data.seo) {
      await supabase.from('cms').upsert({ type: 'seo', data: data.seo });
    }
    console.log(`Migrated CMS data.`);

    console.log('--- Migration Complete ---');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

migrate();
