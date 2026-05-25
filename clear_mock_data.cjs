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

async function clearData() {
  console.log('--- Clearing Users, Orders, and Logs Data ---');

  // Clear existing users, orders, logs
  const { error: orderErr } = await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (orderErr) console.error('Error clearing orders:', orderErr);
  else console.log('✅ Orders cleared.');

  const { error: userErr } = await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (userErr) console.error('Error clearing users:', userErr);
  else console.log('✅ Users cleared.');

  const { error: logErr } = await supabase.from('logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (logErr) console.error('Error clearing logs:', logErr);
  else console.log('✅ Logs cleared.');

  console.log('🎉 All generated data has been deleted. You have a clean slate.');
}

clearData().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
