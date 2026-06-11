const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function testStorage() {
  console.log('Checking buckets...');
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Error listing buckets:', error);
  } else {
    console.log('Buckets:', buckets.map(b => b.name));
    
    if (!buckets.find(b => b.name === 'backups')) {
      console.log('Creating backups bucket...');
      const { data, error: createError } = await supabase.storage.createBucket('backups', { public: false });
      if (createError) console.error('Error creating bucket:', createError);
      else console.log('Bucket created successfully!');
    } else {
      console.log('backups bucket already exists.');
    }
  }
}

testStorage();
