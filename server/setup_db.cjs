require('dotenv').config();
const { Client } = require('pg');

async function createSessionsTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database.');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS public.sessions (
        session_id text PRIMARY KEY,
        is_registered boolean DEFAULT false,
        path text,
        device text,
        last_active timestamp with time zone DEFAULT now()
      );
    `;
    
    await client.query(createTableQuery);
    console.log('Sessions table created or already exists.');

    // Index on last_active to speed up queries for active sessions
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_sessions_last_active 
      ON public.sessions(last_active);
    `);
    console.log('Index created.');

  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    await client.end();
  }
}

createSessionsTable();
