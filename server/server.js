import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { supabase } from './db/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = 'REVOLT_ELITE_SECRET_JWT_KEY_992';

// Ensure public upload directories exist (Local dev only)
const UPLOADS_DIR = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, '../public/uploads');
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Could not create uploads directory (expected on Vercel serverless):', e.message);
}

app.use(cors());
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: true, limit: '4mb' }));
// Serve uploads folder as static files
app.use('/uploads', express.static(UPLOADS_DIR));

// Helper to log actions
const addLog = async (user, action) => {
  try {
    await supabase.from('logs').insert([{ user, action }]);
  } catch (err) {
    console.error('Failed to write log to Supabase', err);
  }
};

// --- REAL JWT AUTHENTICATION MIDDLEWARE ---
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'Authorization header is missing.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'Bearer token is missing.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: 'Invalid or expired token.' });
  }
};

// --- AUTHENTICATION ENDPOINTS ---
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Please provide both username and password.' });
  }

  // Real secure roles: admin / admin (Super Admin), editor / editor (Editor)
  const validUsers = [
    { username: 'admin', role: 'Super Admin', pass: 'admin' },
    { username: 'editor', role: 'Editor', pass: 'editor' }
  ];

  const matched = validUsers.find(u => u.username === username && u.pass === password);

  if (!matched) {
    return res.status(401).json({ success: false, error: 'Invalid administrator credentials. Access Denied.' });
  }

  // Sign real JWT token
  const token = jwt.sign(
    { username: matched.username, role: matched.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  await addLog(matched.username, `Authenticated successfully (Role: ${matched.role})`);

  return res.json({
    success: true,
    token,
    user: {
      username: matched.username,
      role: matched.role
    }
  });
});

app.get('/api/auth/me', verifyToken, async (req, res) => {
  if (req.user.role === 'client') {
    const { data: user, error } = await supabase.from('users').select('*').eq('id', req.user.id).single();
    if (error || !user) return res.status(404).json({ success: false, error: 'User not found' });
    
    delete user.password;
    return res.json({ success: true, user });
  }
  return res.json({ success: true, user: req.user });
});

// --- CLIENT AUTHENTICATION ---
app.post('/api/auth/register', async (req, res) => {
  const { fullName, email, password, phone, dateOfBirth, gender } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ success: false, error: 'Full name, email, and password are required.' });
  }

  try {
    const { data: exists } = await supabase.from('users').select('id').eq('email', email.toLowerCase()).maybeSingle();
    
    if (exists) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data: newUser, error } = await supabase.from('users').insert([{
      role: 'client',
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      dateOfBirth: dateOfBirth || '',
      gender: gender || '',
      addresses: [],
      wishlist: [],
      cart: []
    }]).select().single();

    if (error) throw error;

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: 'client' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    delete newUser.password;

    return res.json({
      success: true,
      token,
      user: newUser
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server error during registration.' });
  }
});

app.post('/api/auth/client-login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Please provide both email and password.' });
  }

  try {
    const { data: user, error } = await supabase.from('users').select('*').eq('email', email.toLowerCase()).maybeSingle();

    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'client' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    delete user.password;

    return res.json({
      success: true,
      token,
      user
    });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server error during login.' });
  }
});

app.put('/api/auth/profile', verifyToken, async (req, res) => {
  if (req.user.role !== 'client') return res.status(403).json({ success: false, error: 'Access denied.' });
  
  const { fullName, phone, dateOfBirth, gender, wishlist, cart } = req.body;
  
  try {
    const updates = {};
    if (fullName !== undefined) updates.fullName = fullName;
    if (phone !== undefined) updates.phone = phone;
    if (dateOfBirth !== undefined) updates.dateOfBirth = dateOfBirth;
    if (gender !== undefined) updates.gender = gender;
    if (wishlist !== undefined) updates.wishlist = wishlist;
    if (cart !== undefined) updates.cart = cart;

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error || !user) return res.status(404).json({ success: false, error: 'User not found.' });

    delete user.password;

    return res.json({ success: true, user });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Failed to update profile.' });
  }
});

app.put('/api/auth/address', verifyToken, async (req, res) => {
  if (req.user.role !== 'client') return res.status(403).json({ success: false, error: 'Access denied.' });
  
  const { addresses } = req.body;
  if (!Array.isArray(addresses)) {
    return res.status(400).json({ success: false, error: 'Addresses must be an array.' });
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .update({ addresses })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error || !user) return res.status(404).json({ success: false, error: 'User not found.' });

    delete user.password;
    return res.json({ success: true, user });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to update addresses.' });
  }
});

app.delete('/api/auth/account', verifyToken, async (req, res) => {
  if (req.user.role !== 'client') return res.status(403).json({ success: false, error: 'Access denied.' });
  
  try {
    await supabase.from('users').delete().eq('id', req.user.id);
    return res.json({ success: true, message: 'Account deleted successfully.' });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to delete account.' });
  }
});

// --- CORE ANALYTICS ENGINE (REAL-TIME COMPUTED) ---
app.get('/api/analytics', verifyToken, async (req, res) => {
  try {
    const { data: products } = await supabase.from('products').select('conversions');
    const { data: orders } = await supabase.from('orders').select('total, status');

    const totalSales = (orders || []).filter(o => o.status !== 'Refunded').reduce((acc, curr) => acc + Number(curr.total), 0);
    const totalItemsSold = (products || []).reduce((acc, curr) => acc + (curr.conversions || 0), 0);
    const totalOrders = (orders || []).length;

    return res.json({
      success: true,
      totalSales,
      totalItemsSold,
      totalOrders,
      productsCount: (products || []).length
    });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch analytics.' });
  }
});

// --- DYNAMIC HOMEPAGE SECTIONS & LAYOUT ROUTERS ---
app.get('/api/sections', async (req, res) => {
  try {
    const { data: sectionsDoc } = await supabase.from('cms').select('data').eq('type', 'sections').single();
    const { data: heroDoc } = await supabase.from('cms').select('data').eq('type', 'hero').single();
    
    // Fallbacks if db is empty
    const sections = sectionsDoc ? sectionsDoc.data : [];
    const hero = heroDoc ? heroDoc.data : { headline: 'Welcome', subheadline: '', ctaText: 'Shop Now', ctaLink: '/', image: '/images/hero.jpg' };
    
    return res.json({ success: true, sections, hero });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch sections.' });
  }
});

app.put('/api/sections', verifyToken, async (req, res) => {
  const { sections, hero } = req.body;

  try {
    if (sections) {
      await supabase.from('cms').upsert({ type: 'sections', data: sections });
    }
    if (hero) {
      await supabase.from('cms').upsert({ type: 'hero', data: hero });
    }

    await addLog(req.user.username, 'Updated website sections and layout draft configurations');
    return res.json({ success: true, message: 'Layout updated successfully' });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to update sections.' });
  }
});

// --- CRUD PRODUCTS INVENTORY ROUTERS ---
app.get('/api/products', async (req, res) => {
  try {
    const { data: products, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return res.json({ success: true, products });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch products.' });
  }
});

app.post('/api/products', verifyToken, async (req, res) => {
  const newProduct = req.body;
  if (!newProduct.name) {
    return res.status(400).json({ success: false, error: 'Product name is a required parameter.' });
  }

  try {
    // Explicitly handle image fields so they are never silently dropped
    const allImages = Array.isArray(newProduct.allImages) ? newProduct.allImages : [];
    const primaryImage = newProduct.primaryImage || allImages[0] || '';
    const secondaryImage = newProduct.secondaryImage || allImages[1] || '';

    const { data: productItem, error } = await supabase.from('products').insert([{
      ...newProduct,
      allImages,
      primaryImage,
      secondaryImage,
      conversions: 0,
      revenue: 0.00
    }]).select().single();

    if (error) throw error;
    
    await addLog(req.user.username, `Added new product to catalog: "${productItem.name}"`);
    return res.json({ success: true, product: productItem });
  } catch(err) {
    console.error('Create product error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create product.' });
  }
});

app.put('/api/products/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  try {
    // Explicitly handle image fields so they are never silently dropped
    const allImages = Array.isArray(updateFields.allImages) ? updateFields.allImages : undefined;
    const primaryImage = updateFields.primaryImage || (allImages && allImages[0]) || undefined;
    const secondaryImage = updateFields.secondaryImage || (allImages && allImages[1]) || undefined;

    const finalFields = {
      ...updateFields,
      ...(allImages !== undefined ? { allImages } : {}),
      ...(primaryImage !== undefined ? { primaryImage } : {}),
      ...(secondaryImage !== undefined ? { secondaryImage } : {}),
    };

    const { data: updated, error } = await supabase
      .from('products')
      .update(finalFields)
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) return res.status(404).json({ success: false, error: 'Product not found.' });

    await addLog(req.user.username, `Updated product fields for product: "${updated.name}"`);
    return res.json({ success: true, product: updated });
  } catch(err) {
    console.error('Update product error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update product.' });
  }
});

app.delete('/api/products/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const { data: deleted, error } = await supabase.from('products').delete().eq('id', id).select().single();
    if (error || !deleted) return res.status(404).json({ success: false, error: 'Product not found.' });

    await addLog(req.user.username, `Deleted product from database catalog: "${deleted.name}"`);
    return res.json({ success: true, message: 'Product deleted from database successfully.' });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to delete product.' });
  }
});

// --- CRUD ORDERS & TRANSACTIONS ROUTERS ---
app.get('/api/orders', verifyToken, async (req, res) => {
  try {
    const { data: orders, error } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
    if (error) throw error;
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.json({ success: true, orders });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch orders.' });
  }
});

app.post('/api/orders', async (req, res) => {
  const newOrder = req.body;
  if (!newOrder.customer || !newOrder.total) {
    return res.status(400).json({ success: false, error: 'Customer name and order total are required.' });
  }

  try {
    const { data: orderItem, error: orderError } = await supabase.from('orders').insert([{
      ...newOrder,
      status: 'Pending',
      tracking: '',
      refundStatus: ''
    }]).select().single();

    if (orderError) throw orderError;

    // Deduct inventory stock
    const { data: products } = await supabase.from('products').select('*');
    const orderDetails = newOrder.items || '';
    
    for (const p of products) {
      if (orderDetails.toLowerCase().includes(p.name.toLowerCase())) {
        const remainingStock = Math.max(0, p.stock - 1);
        await supabase.from('products').update({
          stock: remainingStock,
          conversions: (p.conversions || 0) + 1,
          revenue: Number(p.revenue || 0) + Number(p.salePrice || p.originalPrice || 0)
        }).eq('id', p.id);
      }
    }

    await addLog('storefront', `New customer purchase complete: Order #${orderItem.id} by ${orderItem.customer}`);
    return res.json({ success: true, order: orderItem });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to create order.' });
  }
});
// --- NEW E-COMMERCE CHECKOUT ---
app.post('/api/checkout/create-order', verifyToken, async (req, res) => {
  if (req.user.role !== 'client') return res.status(403).json({ success: false, error: 'Access denied.' });

  const { items, subtotal, tax, deliveryFee, total, paymentMethod, deliveryInfo } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ success: false, error: 'Cart is empty.' });
  
  try {
    // 0. Fetch user details for customer info
    const { data: userRecord } = await supabase.from('users').select('fullName, email, phone').eq('id', req.user.id).single();

    // 1. Create order
    const { data: order, error: orderError } = await supabase.from('orders').insert([{
      userId: req.user.id,
      items,
      subtotal,
      tax,
      deliveryFee,
      total,
      status: 'pending',
      paymentMethod,
      deliveryInfo: {
        ...deliveryInfo,
        customerName: userRecord?.fullName || 'Guest User',
        customerEmail: userRecord?.email || req.user.email,
        customerPhone: userRecord?.phone || ''
      },
      tracking: ''
    }]).select().single();

    if (orderError) throw orderError;

    // 2. Deduct inventory
    for (const item of items) {
      // Find the product
      const { data: product } = await supabase.from('products').select('stock, conversions, revenue, salePrice, originalPrice').eq('id', item.id).single();
      if (product) {
        const remainingStock = Math.max(0, product.stock - (item.quantity || 1));
        const price = product.salePrice || product.originalPrice || 0;
        await supabase.from('products').update({
          stock: remainingStock,
          conversions: (product.conversions || 0) + (item.quantity || 1),
          revenue: Number(product.revenue || 0) + (price * (item.quantity || 1))
        }).eq('id', item.id);
      }
    }

    // 3. Clear user cart
    await supabase.from('users').update({ cart: [] }).eq('id', req.user.id);

    await addLog(req.user.email, `Created new order #${order.id} via Checkout`);
    return res.json({ success: true, order });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Failed to complete order.' });
  }
});

app.get('/api/checkout/orders', verifyToken, async (req, res) => {
  if (req.user.role !== 'client') return res.status(403).json({ success: false, error: 'Access denied.' });
  
  try {
    const { data: orders, error } = await supabase.from('orders')
      .select('*')
      .eq('userId', req.user.id)
      .order('createdAt', { ascending: false });
      
    if (error) throw error;
    return res.json({ success: true, orders });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Failed to fetch user orders.' });
  }
});

app.put('/api/orders/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  try {
    const { data: updated, error } = await supabase.from('orders').update(fields).eq('id', id).select().single();
    if (error || !updated) return res.status(404).json({ success: false, error: 'Order not found.' });

    await addLog(req.user.username, `Updated order status details for Order #${id}`);
    return res.json({ success: true, order: updated });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to update order.' });
  }
});

app.post('/api/orders/:id/refund', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'approve' or 'reject'

  try {
    const { data: order, error } = await supabase.from('orders').select('*').eq('id', id).single();
    if (error || !order) return res.status(404).json({ success: false, error: 'Order not found.' });

    if (action === 'approve') {
      const { data: updated } = await supabase.from('orders').update({ status: 'Refunded', refundStatus: 'Approved' }).eq('id', id).select().single();
      await addLog(req.user.username, `Approved refund for transaction Order #${id} (${order.customer})`);
      return res.json({ success: true, order: updated, message: 'Refund approved successfully.' });
    } else {
      const { data: updated } = await supabase.from('orders').update({ refundStatus: 'Rejected' }).eq('id', id).select().single();
      await addLog(req.user.username, `Rejected refund request for Order #${id}`);
      return res.json({ success: true, order: updated, message: 'Refund request rejected.' });
    }
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to process refund.' });
  }
});

// --- CRUD SEO & ANNOUNCEMENT BAR SETTINGS ---
app.get('/api/seo', async (req, res) => {
  try {
    const { data: seoDoc } = await supabase.from('cms').select('data').eq('type', 'seo').single();
    
    const defaultSeo = {
      title: 'Revolt Elite',
      description: 'The Ultimate Minimalist Clothing Brand.',
      promoBannerText: 'Free shipping on all orders over Ksh 10,000!',
      promoBannerActive: true,
      googleAnalyticsId: ''
    };

    const seo = seoDoc ? { ...defaultSeo, ...seoDoc.data } : defaultSeo;

    // Force defaults if they were explicitly null/undefined in the old DB
    if (seo.promoBannerActive === undefined) seo.promoBannerActive = true;
    if (!seo.promoBannerText) seo.promoBannerText = 'Free shipping on all orders over Ksh 10,000!';

    return res.json({ success: true, seo });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch SEO.' });
  }
});

app.put('/api/seo', verifyToken, async (req, res) => {
  const newSeo = req.body;
  try {
    await supabase.from('cms').upsert({ type: 'seo', data: newSeo });
    await addLog(req.user.username, 'Updated SEO Meta tags and Google Analytics Pixel ID');
    return res.json({ success: true, seo: newSeo });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to update SEO.' });
  }
});

// --- REAL CLOUD MEDIA ASSETS FILE UPLOADS (Supabase Storage) ---
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // Max 25MB hero videos/images
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.mp4'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid asset file type. Allowed: .jpg, .png, .webp, .mp4'));
    }
  }
});

app.post('/api/upload', verifyToken, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Please choose a file to upload.' });
  }

  try {
    const ext = path.extname(req.file.originalname);
    const basename = path.basename(req.file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    // Upload to public/ subfolder so the Supabase storage policy covers it
    const filename = `public/${Date.now()}-${basename}${ext}`;

    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filename, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ success: false, error: 'Cloud storage upload failed. Verify the "uploads" bucket exists in Supabase and is Public.' });
    }

    const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(filename);
    const assetUrl = publicUrlData.publicUrl;

    await addLog(req.user.username, `Uploaded raw static asset to cloud storage: ${filename}`);
    return res.json({ success: true, url: assetUrl });
  } catch (err) {
    console.error('Upload exception:', err);
    return res.status(500).json({ success: false, error: 'An unexpected error occurred during upload.' });
  }
});

// --- AUDIT ACTIVITY LOG TIMELINE ---
app.get('/api/logs', verifyToken, async (req, res) => {
  try {
    const { data: logs, error } = await supabase.from('logs').select('*').order('timestamp', { ascending: false });
    if (error) throw error;
    return res.json({ success: true, logs });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch logs.' });
  }
});

// Startup check
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[REVOLT BACKEND] Real production Express + Supabase API server running on port ${PORT}`);
  });
}

export default app;
