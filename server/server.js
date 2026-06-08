import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { supabase } from './db/supabase.js';
import twilio from 'twilio';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

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

// Helper for sending email
const sendEmail = async (to, subject, html) => {
  console.log(`[EMAIL INITIATED] Attempting to send email to: ${to} | Subject: ${subject}`);
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER || 'test',
        pass: process.env.SMTP_PASS || 'test'
      }
    });
    
    // Verify connection config
    await transporter.verify();
    console.log('[EMAIL] SMTP connection verified successfully');

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Revolt Support" <support@revolt.com>',
      to,
      subject,
      html
    });
    console.log('[EMAIL SUCCESS] Message sent: %s', info.messageId);
  } catch (err) {
    console.error('[EMAIL ERROR] Failed to send email via nodemailer:', err);
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

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Please provide both username and password.' });
  }

  try {
    const { data: settingsDoc } = await supabase.from('cms').select('data').eq('type', 'settings').maybeSingle();
    let validUsers = [
      { username: 'admin', role: 'Super Admin', pass: 'admin' },
      { username: 'editor', role: 'Editor', pass: 'editor' },
      { username: 'fulfillment', role: 'Fulfillment', pass: 'fulfillment' },
      { username: 'support', role: 'Support', pass: 'support' },
      { username: 'marketing', role: 'Marketing', pass: 'marketing' }
    ];

    if (settingsDoc && settingsDoc.data && settingsDoc.data.adminUsers && settingsDoc.data.adminUsers.length > 0) {
      validUsers = settingsDoc.data.adminUsers;
    }

    const matched = validUsers.find(u => u.username === username && u.pass === password);

    if (!matched) {
      return res.status(401).json({ success: false, error: 'Invalid administrator credentials. Access Denied.' });
    }

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
  } catch(err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server error during admin login.' });
  }
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

    if (user.role === 'suspended') {
      return res.status(403).json({ success: false, error: 'Your account has been suspended. Please contact support.' });
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
    if (cart !== undefined) {
      updates.cart = cart;
      updates.cartUpdatedAt = new Date().toISOString();
    }

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
app.get('/api/init', async (req, res) => {
  try {
    const [
      { data: sectionsDoc },
      { data: heroDoc },
      { data: products },
      { data: seoDoc },
      { data: themeDoc },
      { data: assetsDoc },
      { data: socialDoc },
      { data: scriptsDoc },
      { data: notifDoc },
      { data: settingsDoc },
      { data: twilioDoc }
    ] = await Promise.all([
      supabase.from('cms').select('data').eq('type', 'sections').maybeSingle(),
      supabase.from('cms').select('data').eq('type', 'hero').maybeSingle(),
      supabase.from('products').select('*'),
      supabase.from('cms').select('data').eq('type', 'seo').maybeSingle(),
      supabase.from('cms').select('data').eq('type', 'theme').maybeSingle(),
      supabase.from('cms').select('data').eq('type', 'assets').maybeSingle(),
      supabase.from('cms').select('data').eq('type', 'social').maybeSingle(),
      supabase.from('cms').select('data').eq('type', 'scripts').maybeSingle(),
      supabase.from('cms').select('data').eq('type', 'notifications').maybeSingle(),
      supabase.from('cms').select('data').eq('type', 'settings').maybeSingle(),
      supabase.from('cms').select('data').eq('type', 'twilio_settings').maybeSingle()
    ]);

    const defaultHero = { headline: 'Welcome', subheadline: '', ctaText: 'Shop Now', ctaLink: '/', image: '/images/hero.jpg' };
    const defaultSeo = { title: 'Revolt Elite', description: 'The Ultimate Minimalist Clothing Brand.', promoBannerText: 'Free shipping on all orders over Ksh 10,000!', promoBannerActive: true, googleAnalyticsId: '' };

    return res.json({
      success: true,
      data: {
        homepage: {
          sections: sectionsDoc?.data || [],
          hero: heroDoc?.data || defaultHero
        },
        products: products || [],
        seo: seoDoc?.data ? { ...defaultSeo, ...seoDoc.data } : defaultSeo,
        theme: themeDoc?.data || null,
        assets: assetsDoc?.data || null,
        social: socialDoc?.data || null,
        scripts: scriptsDoc?.data || null,
        notifications: notifDoc?.data || null,
        settings: settingsDoc?.data || null,
        twilio_settings: twilioDoc?.data || null
      }
    });
  } catch(err) {
    console.error('Init error:', err);
    return res.status(500).json({ success: false, error: 'Failed to initialize app.' });
  }
});

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
    return res.status(500).json({ success: false, error: 'Failed to create notification.' });
  }
});

app.put('/api/customers/:id/optin', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { field, value } = req.body;
  if (!['smsOptIn', 'whatsappOptIn'].includes(field)) {
    return res.status(400).json({ success: false, error: 'Invalid field.' });
  }

  try {
    const { data: updated, error } = await supabase.from('users').update({ [field]: value }).eq('id', id).select().single();
    if (error) throw error;
    await addLog(req.user.username, `Updated ${field} to ${value} for customer ${id}`);
    return res.json({ success: true, user: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update customer opt-in status.' });
  }
});

// --- RETURNS ROUTES ---
app.get('/api/returns', async (req, res) => {
  try {
    const { data: doc, error } = await supabase.from('cms').select('data').eq('type', 'returns').single();
    if (error && error.code !== 'PGRST116') throw error;
    return res.json({ success: true, returns: doc ? doc.data : [] });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch returns.' });
  }
});

app.post('/api/returns', async (req, res) => {
  const newReturn = req.body;
  try {
    const { data: doc } = await supabase.from('cms').select('data').eq('type', 'returns').maybeSingle();
    const returnsList = doc?.data || [];
    
    const returnEntry = {
      id: newReturn.id || 'RET-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      ...newReturn,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    
    returnsList.unshift(returnEntry);
    await supabase.from('cms').upsert({ type: 'returns', data: returnsList });
    
    return res.json({ success: true, return: returnEntry });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to submit return.' });
  }
});

app.put('/api/returns/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const { data: doc } = await supabase.from('cms').select('data').eq('type', 'returns').maybeSingle();
    if (!doc) return res.status(404).json({ success: false, error: 'No returns found.' });
    
    let returnsList = doc.data;
    const index = returnsList.findIndex(r => r.id === id);
    if (index === -1) return res.status(404).json({ success: false, error: 'Return not found.' });
    
    returnsList[index].status = status;
    await supabase.from('cms').upsert({ type: 'returns', data: returnsList });
    
    return res.json({ success: true, return: returnsList[index] });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to update return.' });
  }
});

// --- MESSAGING / TICKETS ROUTES ---
app.get('/api/messages', verifyToken, async (req, res) => {
  try {
    const { data: doc, error } = await supabase.from('cms').select('data').eq('type', 'messages').single();
    if (error && error.code !== 'PGRST116') throw error;
    
    let messages = doc ? doc.data : [];
    
    // If it's a client, only return their messages
    if (req.user && req.user.role === 'client') {
      messages = messages.filter(m => m.email.toLowerCase() === req.user.email.toLowerCase());
    }
    
    return res.json({ success: true, messages });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch messages.' });
  }
});

app.post('/api/messages', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  }
  
  try {
    const { data: doc } = await supabase.from('cms').select('data').eq('type', 'messages').maybeSingle();
    const messagesList = doc?.data || [];
    
    const newTicket = {
      id: 'TKT-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message,
      status: 'new', // new, replied, closed
      date: new Date().toISOString(),
      replies: []
    };
    
    messagesList.unshift(newTicket);
    await supabase.from('cms').upsert({ type: 'messages', data: messagesList });
    
    return res.json({ success: true, ticket: newTicket });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to submit message.' });
  }
});

app.put('/api/messages/:id/reply', verifyToken, async (req, res) => {
  console.log(`[DEBUG] PUT /api/messages/${req.params.id}/reply hit by:`, req.user);
  const { id } = req.params;
  const { text } = req.body;
  if (!text) return res.status(400).json({ success: false, error: 'Reply text is required.' });

  try {
    const { data: doc } = await supabase.from('cms').select('data').eq('type', 'messages').maybeSingle();
    if (!doc) return res.status(404).json({ success: false, error: 'No messages found.' });
    
    let messagesList = doc.data;
    const index = messagesList.findIndex(m => m.id === id);
    if (index === -1) return res.status(404).json({ success: false, error: 'Ticket not found.' });
    
    const isClient = req.user.role === 'client';
    
    // Prevent client from replying to someone else's ticket
    if (isClient && messagesList[index].email.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({ success: false, error: 'Unauthorized.' });
    }

    const newReply = {
      text,
      from: isClient ? 'client' : 'admin',
      senderName: isClient ? messagesList[index].name : (req.user.username || 'Support Team'),
      date: new Date().toISOString()
    };
    
    messagesList[index].replies = messagesList[index].replies || [];
    messagesList[index].replies.push(newReply);
    messagesList[index].status = isClient ? 'new' : 'replied';
    messagesList[index].lastUpdated = new Date().toISOString();
    
    await supabase.from('cms').upsert({ type: 'messages', data: messagesList });
    
    // Log admin action and send email
    if (!isClient) {
      await addLog(req.user.username, `Replied to ticket ${id}`);
      
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Response to your message (Ticket ${id})</h2>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #333; margin-bottom: 20px;">
            <p style="white-space: pre-wrap;">${text}</p>
          </div>
          <hr />
          <h3>Original Message</h3>
          <p><strong>Subject:</strong> ${messagesList[index].subject}</p>
          <div style="color: #666; white-space: pre-wrap;">
            ${messagesList[index].message}
          </div>
        </div>
      `;
      // Dispatch email and wait for result
      await sendEmail(messagesList[index].email, `Re: ${messagesList[index].subject} (Ticket ${id})`, emailHtml);
    }
    
    return res.json({ success: true, ticket: messagesList[index] });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to add reply.' });
  }
});

app.put('/api/messages/:id/status', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (req.user.role === 'client') return res.status(403).json({ success: false, error: 'Unauthorized.' });

  try {
    const { data: doc } = await supabase.from('cms').select('data').eq('type', 'messages').maybeSingle();
    let messagesList = doc?.data || [];
    const index = messagesList.findIndex(m => m.id === id);
    if (index === -1) return res.status(404).json({ success: false, error: 'Ticket not found.' });
    
    messagesList[index].status = status;
    messagesList[index].lastUpdated = new Date().toISOString();
    
    await supabase.from('cms').upsert({ type: 'messages', data: messagesList });
    await addLog(req.user.username, `Updated ticket ${id} status to ${status}`);
    
    return res.json({ success: true, ticket: messagesList[index] });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to update ticket status.' });
  }
});

// --- GENERIC CMS ROUTES ---
app.get('/api/cms/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { data: doc, error } = await supabase.from('cms').select('data').eq('type', type).single();
    if (error && error.code !== 'PGRST116') throw error; // ignore not found
    return res.json({ success: true, data: doc ? doc.data : null });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch CMS block.' });
  }
});

app.put('/api/cms/:type', verifyToken, async (req, res) => {
  try {
    const { type } = req.params;
    const { data } = req.body;
    console.log(`[DEBUG] PUT /api/cms/${type} payload:`, JSON.stringify(data));
    await supabase.from('cms').upsert({ type, data });
    await addLog(req.user.username, `Updated generic CMS configuration for type: ${type}`);
    return res.json({ success: true });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to update CMS block.' });
  }
});

app.get('/robots.txt', async (req, res) => {
  try {
    const { data: doc } = await supabase.from('cms').select('data').eq('type', 'seo_globals').single();
    const txt = doc?.data?.robotsTxt || 'User-agent: *\nAllow: /';
    res.type('text/plain');
    res.send(txt);
  } catch(err) {
    res.type('text/plain');
    res.send('User-agent: *\nAllow: /');
  }
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const { data: products } = await supabase.from('products').select('id, name');
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://revolt.com/</loc></url>
  <url><loc>https://revolt.com/other/shop-the-collection</loc></url>
`;
    if (products) {
      products.forEach(p => {
        // use slug if we have it later, for now id
        xml += `  <url><loc>https://revolt.com/product/${p.id}</loc></url>\n`;
      });
    }
    xml += `</urlset>`;
    res.type('application/xml');
    res.send(xml);
  } catch(err) {
    res.type('application/xml');
    res.send('<?xml version="1.0" encoding="UTF-8"?><urlset></urlset>');
  }
});

// --- BACKUP / RESTORE / FACTORY RESET ---
app.get('/api/backup', verifyToken, async (req, res) => {
  if (req.user.role !== 'Super Admin' && req.user.role !== 'Editor') {
    return res.status(403).json({ success: false, error: 'Access denied' });
  }
  try {
    const { data: cms } = await supabase.from('cms').select('*');
    const { data: products } = await supabase.from('products').select('*');
    const backupData = { cms, products };
    const jsonStr = JSON.stringify(backupData, null, 2);
    res.setHeader('Content-disposition', `attachment; filename=revolt_live_backup_${new Date().toISOString().split('T')[0]}.json`);
    res.setHeader('Content-type', 'application/json');
    res.send(jsonStr);
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Backup failed.' });
  }
});

app.post('/api/restore', verifyToken, async (req, res) => {
  if (req.user.role !== 'Super Admin') {
    return res.status(403).json({ success: false, error: 'Access denied' });
  }
  try {
    const { cms, products } = req.body;
    if (cms && Array.isArray(cms)) {
      for (const block of cms) {
        await supabase.from('cms').upsert({ type: block.type, data: block.data });
      }
    }
    if (products && Array.isArray(products)) {
      for (const product of products) {
        await supabase.from('products').upsert(product);
      }
    }
    await addLog(req.user.username, 'Restored database from backup file.');
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Restore failed.' });
  }
});

app.post('/api/factory-reset', verifyToken, async (req, res) => {
  if (req.user.role !== 'Super Admin') {
    return res.status(403).json({ success: false, error: 'Access denied' });
  }
  try {
    await supabase.from('cms').delete().neq('type', 'INVALID');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000').neq('role', 'client'); // wait let's just wipe clients, or all except admin if any are stored there. Users in Supabase includes clients. 
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('logs').delete().neq('id', 0);

    await addLog(req.user.username, 'Performed factory reset of the database.');
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Factory reset failed.' });
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
app.get('/api/track-order/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch orders and find by prefix since Supabase UUID columns don't support ilike queries directly.
    const { data: orders, error } = await supabase.from('orders').select('id, items, total, status, deliveryInfo, tracking, createdAt').order('createdAt', { ascending: false }).limit(2000);
    
    if (error) throw error;
    
    const searchTerm = id.toLowerCase().trim();
    const order = orders.find(o => o.id.toLowerCase().startsWith(searchTerm) || o.id.replace(/-/g, '').toLowerCase().startsWith(searchTerm));

    if (!order) return res.status(404).json({ success: false, error: 'Order not found.' });

    // Strip out sensitive deliveryInfo data, keep only the timeline
    const publicDeliveryInfo = {
      timeline: order.deliveryInfo?.timeline || []
    };

    const trackingData = {
      ...order,
      deliveryInfo: publicDeliveryInfo
    };

    return res.json({ success: true, order: trackingData });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch order tracking info.' });
  }
});

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
app.post('/api/checkout/create-order', async (req, res) => {
  const { items, subtotal, tax, deliveryFee, total, paymentMethod, deliveryInfo } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ success: false, error: 'Cart is empty.' });
  
  // Optional auth
  let userId = '00000000-0000-0000-0000-000000000000'; // fallback guest user ID or null
  let customerName = deliveryInfo?.address?.name || 'Guest User';
  let customerEmail = 'guest@example.com';
  let customerPhone = '';

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.role === 'client') {
        userId = decoded.id;
        const { data: userRecord } = await supabase.from('users').select('fullName, email, phone').eq('id', userId).single();
        if (userRecord) {
          customerName = userRecord.fullName || customerName;
          customerEmail = userRecord.email || customerEmail;
          customerPhone = userRecord.phone || customerPhone;
        }
      }
    } catch(e) {
      // ignore invalid token, process as guest
    }
  }

  try {
    // 1. Create order
    const { data: order, error: orderError } = await supabase.from('orders').insert([{
      userId: userId,
      items,
      subtotal,
      tax,
      deliveryFee,
      total,
      status: 'pending',
      paymentMethod,
      deliveryInfo: {
        ...deliveryInfo,
        customerName,
        customerEmail,
        customerPhone
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

    // 3. Clear user cart if logged in
    if (userId !== '00000000-0000-0000-0000-000000000000') {
      await supabase.from('users').update({ cart: [] }).eq('id', userId);
    }

    await addLog(customerEmail, `Created new order #${order.id} via Checkout`);
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

    // Trigger Notification Automations
    if (fields.status) {
      try {
        const { data: notifDoc } = await supabase.from('cms').select('data').eq('type', 'notifications').single();
        const automations = notifDoc?.data?.automations || [];
        const triggerEvent = `ORDER_${fields.status.toUpperCase()}`;
        const auto = automations.find(a => a.trigger === triggerEvent && a.active);
        
        if (auto) {
           const targetEmail = updated.deliveryInfo?.customerEmail || 'customer@example.com';
           await addLog(targetEmail, `[NOTIFICATION] Channel:${auto.channel || 'Email'} | Status:Delivered | Template:${auto.templateId} | Campaign:Automation | Content:Automated trigger for ${triggerEvent}`);
        }
      } catch(e) {
        console.error('Failed to trigger notification automation', e);
      }
    }

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

      // Trigger Refund Automation
      try {
        const { data: notifDoc } = await supabase.from('cms').select('data').eq('type', 'notifications').single();
        const automations = notifDoc?.data?.automations || [];
        const auto = automations.find(a => a.trigger === 'ORDER_REFUNDED' && a.active);
        if (auto) {
           const targetEmail = updated.deliveryInfo?.customerEmail || 'customer@example.com';
           await addLog(targetEmail, `[NOTIFICATION] Channel:${auto.channel || 'Email'} | Status:Delivered | Template:${auto.templateId} | Campaign:Automation | Content:Automated trigger for ORDER_REFUNDED`);
        }
      } catch(e) {}

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

// --- TWILIO HELPERS & ROUTES ---
const getTwilioClient = async () => {
  const { data: doc } = await supabase.from('cms').select('data').eq('type', 'twilio_settings').single();
  if (doc?.data?.sid && doc?.data?.authToken) {
    return { client: twilio(doc.data.sid, doc.data.authToken), config: doc.data };
  }
  return { client: null, config: null };
};

app.post('/api/twilio/webhook', async (req, res) => {
  const { SmsSid, MessageStatus, From, Body } = req.body;
  try {
    if (MessageStatus) {
      // It's a delivery status update
      await addLog('System', `[TWILIO] Webhook - Message ${SmsSid} status changed to: ${MessageStatus}`);
    } else if (Body && From) {
      // It's an inbound reply (Two-way SMS)
      // Automatically handle STOP/UNSUBSCRIBE here if we want to store it in customer record
      const isOptOut = ['stop', 'unsubscribe', 'cancel', 'quit'].includes(Body.trim().toLowerCase());
      if (isOptOut) {
        // Opt-out logic (find customer by phone, update record)
        const { data: user } = await supabase.from('users').select('id, fullName').eq('phone', From).maybeSingle();
        if (user) {
          await supabase.from('users').update({ smsOptIn: false }).eq('id', user.id);
          await addLog(user.fullName, `[TWILIO] Customer opted out of SMS messages.`);
        }
      }
      
      // Store in conversations / logs
      await addLog('Inbox', `[TWILIO_INBOUND] From: ${From} | Message: ${Body}`);
    }
    return res.status(200).send('<Response></Response>');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error');
  }
});

app.get('/api/twilio/conversations', verifyToken, async (req, res) => {
  try {
    const { data: logs, error } = await supabase.from('logs').select('*').like('action', '%[TWILIO_INBOUND]%').order('timestamp', { ascending: false });
    if (error) throw error;
    return res.json({ success: true, logs });
  } catch(err) {
    return res.status(500).json({ success: false });
  }
});

// --- NOTIFICATIONS & LOGS ---
app.get('/api/notifications/logs', verifyToken, async (req, res) => {
  try {
    const { data: logs, error } = await supabase.from('logs').select('*').like('action', '%[NOTIFICATION]%').order('timestamp', { ascending: false });
    if (error) throw error;
    return res.json({ success: true, logs });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch notification logs.' });
  }
});

app.post('/api/notifications/send', verifyToken, async (req, res) => {
  const { customer, phone, channel, templateId, content, campaignId } = req.body;
  try {
    const cleanContent = content ? content.substring(0, 100).replace(/\n/g, ' ') : '';
    
    const { client, config } = await getTwilioClient();
    let twilioSid = 'Mock_SID';
    let status = 'Delivered';

    if (client && config && phone && (channel === 'SMS' || channel === 'WhatsApp')) {
      try {
        const fromNumber = channel === 'WhatsApp' ? `whatsapp:${config.senderPhone}` : (config.messagingServiceSid || config.senderPhone);
        const toNumber = channel === 'WhatsApp' ? `whatsapp:${phone}` : phone;
        
        const msgOptions = {
          body: content || 'No content provided',
          to: toNumber
        };
        
        if (config.messagingServiceSid && channel !== 'WhatsApp') {
          msgOptions.messagingServiceSid = config.messagingServiceSid;
        } else {
          msgOptions.from = fromNumber;
        }

        // Test mode / Mock checking (to prevent burning credits during dev if requested)
        if (config.testMode) {
          twilioSid = `TEST_${Date.now()}`;
          console.log(`[TWILIO TEST MODE] Would send: ${JSON.stringify(msgOptions)}`);
        } else {
          const message = await client.messages.create(msgOptions);
          twilioSid = message.sid;
          status = message.status;
        }
      } catch (twilioErr) {
        console.error('Twilio Error:', twilioErr);
        status = `Failed: ${twilioErr.message}`;
      }
    }

    await addLog(customer, `[NOTIFICATION] Channel:${channel || 'Email'} | Status:${status} | Template:${templateId || 'None'} | Campaign:${campaignId || 'Broadcast'} | TwilioSID:${twilioSid} | Content:${cleanContent}...`);
    return res.json({ success: true, twilioSid, status });
  } catch(err) {
    return res.status(500).json({ success: false });
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

// --- ANALYTICS AND TRAFFIC ---
app.post('/api/track-visit', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const { data: trafficDoc } = await supabase.from('cms').select('data').eq('type', 'traffic').single();
    let traffic = trafficDoc?.data || {};
    traffic[today] = (traffic[today] || 0) + 1;
    await supabase.from('cms').upsert({ type: 'traffic', data: traffic });
    return res.json({ success: true });
  } catch(err) {
    return res.status(500).json({ success: false });
  }
});

app.get('/api/analytics', verifyToken, async (req, res) => {
  if (req.user.role !== 'Super Admin' && req.user.role !== 'Editor') {
    return res.status(403).json({ success: false });
  }
  try {
    const [{ data: orders }, { data: products }, { data: trafficDoc }] = await Promise.all([
      supabase.from('orders').select('total, items'),
      supabase.from('products').select('id'),
      supabase.from('cms').select('data').eq('type', 'traffic').single()
    ]);
    const totalSales = (orders || []).reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    const totalItemsSold = (orders || []).reduce((acc, order) => {
      if (order.items && Array.isArray(order.items)) {
        return acc + order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      }
      return acc;
    }, 0);
    
    return res.json({
      success: true,
      totalSales,
      totalOrders: (orders || []).length,
      totalItemsSold,
      productsCount: (products || []).length,
      traffic: trafficDoc?.data || {}
    });
  } catch(err) {
    return res.status(500).json({ success: false });
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

// --- CUSTOMER MANAGEMENT ---
app.get('/api/customers', verifyToken, async (req, res) => {
  if (req.user.role !== 'Super Admin' && req.user.role !== 'Editor') return res.status(403).json({ success: false, error: 'Access denied.' });
  try {
    const { data: customers, error } = await supabase.from('users').select('id, fullName, email, phone, dateOfBirth, gender, role, addresses, createdat, cart, "cartUpdatedAt"').in('role', ['client', 'suspended']).order('createdat', { ascending: false });
    if (error) throw error;
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.json({ success: true, customers });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch customers.' });
  }
});

app.put('/api/customers/:id/status', verifyToken, async (req, res) => {
  if (req.user.role !== 'Super Admin' && req.user.role !== 'Editor') return res.status(403).json({ success: false, error: 'Access denied.' });
  const { id } = req.params;
  const { status } = req.body; // 'client' or 'suspended'
  try {
    const { data: updated, error } = await supabase.from('users').update({ role: status }).eq('id', id).select('id, fullName, email, phone, dateOfBirth, gender, role, addresses, createdAt').single();
    if (error || !updated) return res.status(404).json({ success: false, error: 'Customer not found.' });
    await addLog(req.user.username, `${status === 'suspended' ? 'Suspended' : 'Reactivated'} customer account: ${updated.email}`);
    return res.json({ success: true, customer: updated });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to update customer status.' });
  }
});

app.delete('/api/customers/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'Super Admin') return res.status(403).json({ success: false, error: 'Access denied. Super Admin required.' });
  const { id } = req.params;
  try {
    // Option A: Anonymize to preserve order history
    const { data: updated, error } = await supabase.from('users').update({
      fullName: 'Deleted User',
      email: `deleted_${Date.now()}@revolt.com`,
      phone: '',
      dateOfBirth: '',
      gender: '',
      addresses: [],
      password: '',
      role: 'deleted'
    }).eq('id', id).select('email').single();
    if (error || !updated) return res.status(404).json({ success: false, error: 'Customer not found.' });
    await addLog(req.user.username, `Anonymized/Deleted customer account ID: ${id}`);
    return res.json({ success: true });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to delete customer.' });
  }
});

// --- PROMO CODES & DISCOUNTS ---

// GET all promos (admin only)
app.get('/api/promos', verifyToken, async (req, res) => {
  try {
    const { data: promos, error } = await supabase.from('promos').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return res.json({ success: true, promos });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch promos.' });
  }
});

// POST create promo (admin only)
app.post('/api/promos', verifyToken, async (req, res) => {
  if (req.user.role !== 'Super Admin') return res.status(403).json({ success: false, error: 'Super Admin access required.' });

  const { code, discountType, discountValue, expiresAt, usageLimit, active } = req.body;

  if (!code || !discountType || discountValue === undefined) {
    return res.status(400).json({ success: false, error: 'Code, discount type and value are required.' });
  }

  const normalizedCode = code.trim().toUpperCase();

  try {
    // Check for duplicate code
    const { data: existing } = await supabase.from('promos').select('id').eq('code', normalizedCode).maybeSingle();
    if (existing) return res.status(409).json({ success: false, error: `Promo code "${normalizedCode}" already exists.` });

    const { data: promo, error } = await supabase.from('promos').insert([{
      code: normalizedCode,
      discountType,          // 'percentage' | 'fixed'
      discountValue: Number(discountValue),
      expiresAt: expiresAt || null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      usageCount: 0,
      active: active !== undefined ? active : true,
    }]).select().single();

    if (error) throw error;

    await addLog(req.user.username, `Created promo code "${normalizedCode}" (${discountType}: ${discountValue})`);
    return res.json({ success: true, promo });
  } catch(err) {
    console.error('Create promo error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create promo.' });
  }
});

// PUT update promo (admin only)
app.put('/api/promos/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'Super Admin') return res.status(403).json({ success: false, error: 'Super Admin access required.' });

  const { id } = req.params;
  const fields = req.body;

  try {
    if (fields.code) fields.code = fields.code.trim().toUpperCase();

    const { data: updated, error } = await supabase.from('promos').update(fields).eq('id', id).select().single();
    if (error || !updated) return res.status(404).json({ success: false, error: 'Promo not found.' });

    await addLog(req.user.username, `Updated promo code "${updated.code}"`);
    return res.json({ success: true, promo: updated });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to update promo.' });
  }
});

// DELETE promo (admin only)
app.delete('/api/promos/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'Super Admin') return res.status(403).json({ success: false, error: 'Super Admin access required.' });

  const { id } = req.params;
  try {
    const { data: deleted, error } = await supabase.from('promos').delete().eq('id', id).select().single();
    if (error || !deleted) return res.status(404).json({ success: false, error: 'Promo not found.' });

    await addLog(req.user.username, `Deleted promo code "${deleted.code}"`);
    return res.json({ success: true });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to delete promo.' });
  }
});

// POST validate / apply a promo code at checkout (public)
app.post('/api/promos/validate', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ success: false, error: 'Promo code is required.' });

  try {
    const { data: promo, error } = await supabase.from('promos').select('*').eq('code', code.trim().toUpperCase()).maybeSingle();

    if (error || !promo) return res.status(404).json({ success: false, error: 'Invalid promo code.' });
    if (!promo.active) return res.status(400).json({ success: false, error: 'This promo code is inactive.' });
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) return res.status(400).json({ success: false, error: 'This promo code has expired.' });
    if (promo.usageLimit !== null && promo.usageCount >= promo.usageLimit) return res.status(400).json({ success: false, error: 'This promo code has reached its usage limit.' });

    // Increment usage count
    await supabase.from('promos').update({ usageCount: promo.usageCount + 1 }).eq('id', promo.id);

    return res.json({
      success: true,
      promo: {
        code: promo.code,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
      }
    });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Failed to validate promo.' });
  }
});

app.get('/api/debug-env', (req, res) => {
  res.json({
    hasUrl: !!process.env.SUPABASE_URL,
    hasKey: !!process.env.SUPABASE_SERVICE_KEY,
    urlValue: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 15) + '...' : 'MISSING',
    nodeEnv: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL
  });
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

// --- NEWSLETTER ROUTES ---
app.post('/api/newsletter/subscribe', async (req, res) => {
  const { email, source } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'A valid email is required.' });
  }

  try {
    const { data: doc } = await supabase.from('cms').select('data').eq('type', 'subscribers').maybeSingle();
    let subscribers = doc?.data || [];
    
    // Check if already subscribed
    if (subscribers.find(sub => sub.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ success: false, error: 'Email is already subscribed.' });
    }

    const newSubscriber = {
      id: 'SUB-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      email: email.toLowerCase(),
      date: new Date().toISOString(),
      source: source || 'unknown'
    };

    subscribers.push(newSubscriber);
    
    await supabase.from('cms').upsert({ type: 'subscribers', data: subscribers });
    
    // Optional: Send welcome email
    const welcomeHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; text-align: center; padding: 40px 20px;">
        <h1 style="text-transform: uppercase; letter-spacing: 2px;">Welcome to Revolt</h1>
        <p style="color: #666; font-size: 16px; margin-top: 20px;">You're in. You will now receive early access to drops, members-only releases, and editorial updates.</p>
        <p style="margin-top: 40px; font-size: 12px; color: #999;">© ${new Date().getFullYear()} Revolt Studio. All Rights Reserved.</p>
      </div>
    `;
    sendEmail(email, 'Welcome to Revolt', welcomeHtml);

    return res.json({ success: true, subscriber: newSubscriber });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to subscribe.' });
  }
});

app.get('/api/newsletter', verifyToken, async (req, res) => {
  try {
    const { data: doc } = await supabase.from('cms').select('data').eq('type', 'subscribers').maybeSingle();
    return res.json({ success: true, subscribers: doc?.data || [] });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch subscribers.' });
  }
});

app.delete('/api/newsletter/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const { data: doc } = await supabase.from('cms').select('data').eq('type', 'subscribers').maybeSingle();
    if (!doc) return res.status(404).json({ success: false, error: 'No subscribers found.' });
    
    const subscribers = doc.data.filter(s => s.id !== id);
    await supabase.from('cms').upsert({ type: 'subscribers', data: subscribers });
    await addLog(req.user.username, `Deleted subscriber ${id}`);
    
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to delete subscriber.' });
  }
});

app.post('/api/newsletter/send', verifyToken, async (req, res) => {
  const { subject, html } = req.body;
  if (!subject || !html) return res.status(400).json({ success: false, error: 'Subject and message are required.' });

  try {
    const { data: doc } = await supabase.from('cms').select('data').eq('type', 'subscribers').maybeSingle();
    const subscribers = doc?.data || [];
    
    if (subscribers.length === 0) return res.status(400).json({ success: false, error: 'No subscribers to send to.' });
    
    // Send emails (In a production environment with SendGrid this would be batched or use BCC, 
    // but for small lists looping with NodeMailer works as a starting point)
    let sentCount = 0;
    for (const sub of subscribers) {
      // Small delay to prevent flooding the local SMTP or Gmail limits too aggressively in a loop
      await new Promise(r => setTimeout(r, 200)); 
      sendEmail(sub.email, subject, html);
      sentCount++;
    }
    
    await addLog(req.user.username, `Sent newsletter campaign "${subject}" to ${sentCount} subscribers`);
    return res.json({ success: true, sentCount });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to send campaign.' });
  }
});

// Startup check
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[REVOLT BACKEND] Real production Express + Supabase API server running on port ${PORT}`);
  });
}

export default app;
