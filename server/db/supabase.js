import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL && process.env.SUPABASE_URL.startsWith('http') 
  ? process.env.SUPABASE_URL 
  : 'https://dummy.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'dummy_key';

let supabaseClient;
try {
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
} catch (e) {
  console.error("Supabase init error:", e);
  // fallback so app doesn't crash
  supabaseClient = createClient('https://dummy.supabase.co', 'dummy_key');
}

export const supabase = supabaseClient;
