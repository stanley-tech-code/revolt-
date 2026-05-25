/**
 * create_promos_table.cjs
 * Creates the promos table in Supabase if it doesn't already exist.
 * Safe to run at any time — will NOT drop or overwrite any data.
 * Run with: node create_promos_table.cjs
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌  Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function createPromosTable() {
  // Test if promos table already exists by querying it
  const { error: testError } = await supabase.from('promos').select('id').limit(1);

  if (!testError) {
    console.log('✅  promos table already exists and is accessible in Supabase!');
    return;
  }

  // Table doesn't exist — print the SQL to run manually
  console.log('⚠️   The promos table does not exist yet.');
  console.log('');
  console.log('👉  Please run this SQL in your Supabase SQL Editor (supabase.com → SQL Editor):');
  console.log('');
  console.log(`CREATE TABLE IF NOT EXISTS public.promos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  "discountType" text NOT NULL CHECK ("discountType" IN ('percentage', 'fixed')),
  "discountValue" numeric NOT NULL CHECK ("discountValue" > 0),
  "expiresAt" timestamp with time zone DEFAULT NULL,
  "usageLimit" integer DEFAULT NULL,
  "usageCount" integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.promos DISABLE ROW LEVEL SECURITY;`);
}

createPromosTable().catch(err => {
  console.error('❌  Unexpected error:', err);
  process.exit(1);
});
