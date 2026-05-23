import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY';

// Initialize the Supabase client with the Service Role key
// We use the service_role key to bypass Row Level Security since this server.js acts as an admin proxy.
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
