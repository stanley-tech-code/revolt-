const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function wipe() {
  console.log('--- Wiping Users, Orders, Logs, and Promos ---');
  console.log('⚠️ Products and CMS will NOT be wiped.');
  
  const tablesToWipe = ['orders', 'logs', 'promos', 'users'];
  
  for (const table of tablesToWipe) {
    console.log(`🗑️  Clearing ${table}...`);
    // Since 'id' is a uuid for all these tables, we use a dummy neq query to clear all rows.
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (error) {
      console.error(`❌ Error clearing ${table}:`, error);
    } else {
      console.log(`   ✅ ${table} cleared.`);
    }
  }
  
  console.log('\n🎉 Required tables have been wiped. You have a clean slate.');
}

wipe().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
