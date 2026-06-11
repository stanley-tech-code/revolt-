const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function backup(trigger = 'manual') {
  console.log(`🔄 Starting full database backup (Trigger: ${trigger})...`);
  
  const tables = ['users', 'products', 'orders', 'logs', 'cms', 'promos'];
  const backupData = {};
  
  for (const table of tables) {
    console.log(`📥 Fetching data from ${table}...`);
    // Need to fetch all data. Using pagination if necessary, but starting with a large limit.
    // Assuming less than 1000 rows for now, but we'll fetch up to 1000. 
    // For larger tables, we'd need a loop, but this is a simple implementation.
    const { data, error } = await supabase.from(table).select('*').limit(10000);
    
    if (error) {
      console.error(`❌ Error fetching ${table}:`, error.message);
      process.exit(1);
    }
    
    backupData[table] = data;
    console.log(`   ✓ Found ${data.length} records in ${table}.`);
  }
  
  const backupDir = path.join(__dirname, 'server', 'db', 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `backup-${timestamp}-${trigger}.json`);
  
  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
  console.log(`\n✅ Backup successfully saved to:\n${backupPath}`);
  
  return backupPath;
}

if (require.main === module) {
  const triggerArg = process.argv[2] || 'manual';
  backup(triggerArg).catch(err => {
    console.error('❌ Unexpected error during backup:', err);
    process.exit(1);
  });
}

module.exports = { backup };
