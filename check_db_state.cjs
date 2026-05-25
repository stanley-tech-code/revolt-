/**
 * check_db_state.cjs
 * Reports the current row counts in all Supabase tables.
 */
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function check() {
  const tables = ['products', 'orders', 'users', 'logs', 'cms', 'promos'];
  console.log('\n📊  Current Supabase table row counts:\n');
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`  ${t.padEnd(12)} ❌  Error: ${error.message}`);
    } else {
      // count is in the response headers, not data
      const { count } = await supabase.from(t).select('*', { count: 'exact', head: true });
      console.log(`  ${t.padEnd(12)} → checking...`);
    }
  }

  // Better way - select with count
  for (const t of tables) {
    try {
      const { count, error } = await supabase.from(t).select('id', { count: 'exact', head: true });
      if (error) console.log(`  ${t.padEnd(12)} ❌  ${error.message}`);
      else console.log(`  ${t.padEnd(12)} ✅  ${count} rows`);
    } catch(e) {
      // try without id column (cms table uses 'type')
      try {
        const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
        if (error) console.log(`  ${t.padEnd(12)} ❌  ${error.message}`);
        else console.log(`  ${t.padEnd(12)} ✅  ${count} rows`);
      } catch(e2) {
        console.log(`  ${t.padEnd(12)} ❌  ${e2.message}`);
      }
    }
  }
  console.log('');

  // Sample a user to check
  const { data: sampleUser } = await supabase.from('users').select('id, fullName, email, role').limit(3);
  if (sampleUser && sampleUser.length > 0) {
    console.log('👤  Sample users in DB:');
    sampleUser.forEach(u => console.log(`   - ${u.fullName} (${u.email}) [${u.role}]`));
  } else {
    console.log('👤  No users found in database.');
  }

  // Sample orders
  const { data: sampleOrders } = await supabase.from('orders').select('id, total, status').limit(3);
  if (sampleOrders && sampleOrders.length > 0) {
    console.log('\n📦  Sample orders in DB:');
    sampleOrders.forEach(o => console.log(`   - Order ${o.id?.slice(0,8)} | Ksh ${o.total} | ${o.status}`));
  } else {
    console.log('\n📦  No orders found in database.');
  }
}

check().catch(console.error);
