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

// Helper to generate random dates within the last 30 days
function getRandomDate() {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date.toISOString();
}

async function seed() {
  console.log('--- Starting Mock Data Seeding ---');

  // Clear existing users, orders, logs (optional, but requested to "restore", so let's make sure we have clean mock data)
  console.log('Clearing old mock data...');
  await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 1. Seed Users
  console.log('Seeding Users...');
  const mockUsers = [
    { fullName: 'Sophia Lauren', email: 'sophia@example.com', password: 'hashedpassword', phone: '+1234567890', role: 'client', gender: 'Female', dateOfBirth: '1990-05-15' },
    { fullName: 'Jessica Miller', email: 'jessica@example.com', password: 'hashedpassword', phone: '+1987654321', role: 'client', gender: 'Female', dateOfBirth: '1985-10-22' },
    { fullName: 'Emma Watson', email: 'emma@example.com', password: 'hashedpassword', phone: '+1555555555', role: 'client', gender: 'Female', dateOfBirth: '1992-03-08' },
    { fullName: 'Liam Neeson', email: 'liam@example.com', password: 'hashedpassword', phone: '+1444333222', role: 'client', gender: 'Male', dateOfBirth: '1980-07-30' },
    { fullName: 'Olivia Wilde', email: 'olivia@example.com', password: 'hashedpassword', phone: '+1777888999', role: 'client', gender: 'Female', dateOfBirth: '1995-12-12' },
    { fullName: 'Suspended User', email: 'baduser@example.com', password: 'hashedpassword', phone: '+100000000', role: 'suspended', gender: 'Male', dateOfBirth: '2000-01-01' }
  ];

  const { data: users, error: userErr } = await supabase.from('users').insert(mockUsers).select();
  if (userErr) {
    console.error('Error inserting users:', userErr);
    process.exit(1);
  }
  console.log(`✅ Seeded ${users.length} users.`);

  // Fetch some products to link
  const { data: products } = await supabase.from('products').select('id, name, salePrice, originalPrice').limit(5);
  const prod1 = products && products.length > 0 ? products[0] : { id: 'prod-1', name: 'Mock Product 1', salePrice: 50 };
  const prod2 = products && products.length > 1 ? products[1] : { id: 'prod-2', name: 'Mock Product 2', salePrice: 100 };

  // 2. Seed Orders
  console.log('Seeding Orders...');
  const statuses = ['pending', 'processing', 'shipped', 'Delivered', 'Refunded', 'cancelled'];
  const mockOrders = [];

  for (let i = 0; i < 20; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const qty1 = Math.floor(Math.random() * 3) + 1;
    const qty2 = Math.floor(Math.random() * 2);
    
    const items = [
      { id: prod1.id, name: prod1.name, price: prod1.salePrice || prod1.originalPrice, quantity: qty1 }
    ];
    if (qty2 > 0) {
      items.push({ id: prod2.id, name: prod2.name, price: prod2.salePrice || prod2.originalPrice, quantity: qty2 });
    }

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const deliveryFee = 10;
    const total = subtotal + tax + deliveryFee;

    mockOrders.push({
      userId: user.id,
      items,
      subtotal,
      tax,
      deliveryFee,
      total,
      status,
      paymentMethod: 'Credit Card',
      deliveryInfo: {
        customerName: user.fullName,
        customerEmail: user.email,
        customerPhone: user.phone,
        address: '123 Main St, City, Country'
      },
      tracking: status === 'shipped' || status === 'Delivered' ? `TRK${Math.floor(Math.random()*1000000)}` : '',
      createdAt: getRandomDate()
    });
  }

  const { data: orders, error: orderErr } = await supabase.from('orders').insert(mockOrders).select();
  if (orderErr) {
    console.error('Error inserting orders:', orderErr);
    process.exit(1);
  }
  console.log(`✅ Seeded ${orders.length} orders.`);

  // 3. Seed Logs
  console.log('Seeding Logs...');
  const mockLogs = [
    { user: 'admin', action: 'Database initialized with mock data', timestamp: new Date().toISOString() },
    { user: 'admin', action: 'Reviewed financial reports', timestamp: getRandomDate() },
    { user: 'editor', action: 'Updated hero section CMS', timestamp: getRandomDate() },
  ];
  const { error: logErr } = await supabase.from('logs').insert(mockLogs);
  if (logErr) {
    console.error('Error inserting logs:', logErr);
  } else {
    console.log(`✅ Seeded ${mockLogs.length} logs.`);
  }

  console.log('🎉 Mock data restoration complete!');
}

seed().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
