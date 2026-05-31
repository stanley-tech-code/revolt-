require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const privacyPolicy = `**Privacy Policy**

At Revolt, we are committed to protecting the privacy and security of our customers and site visitors. This Privacy Policy outlines how we collect, use, protect, and share your personal information.

**1. Information We Collect**
We collect information you provide directly to us, such as when you create an account, place an order, or subscribe to our newsletter. This includes your name, email address, shipping address, and payment information. We also collect data automatically through cookies to improve your browsing experience.

**2. How We Use Your Information**
Your data is used to process transactions, deliver products, communicate with you about your order, and (if you opted in) send you promotional offers. We use analytics to optimize our website and product offerings.

**3. Data Protection**
We implement state-of-the-art security measures to maintain the safety of your personal information. All payment transactions are encrypted and processed through secure gateways. We do not store your credit card information on our servers.

**4. Sharing Information**
We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information with our trusted affiliates and advertisers.

**5. Your Rights**
You have the right to access, correct, or delete your personal data at any time. You can also opt-out of marketing communications by clicking the "unsubscribe" link in any of our emails.`;

const termsOfService = `**Terms of Service**

Welcome to Revolt. By accessing or using our website and services, you agree to comply with and be bound by the following terms and conditions.

**1. General Conditions**
We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information) may be transferred unencrypted over various networks.

**2. Products and Pricing**
All descriptions of products or product pricing are subject to change at anytime without notice, at the sole discretion of us. We reserve the right to discontinue any product at any time.

**3. Accuracy of Billing and Account Information**
We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.

**4. Intellectual Property**
All content included on this site, such as text, graphics, logos, images, and software, is the property of Revolt and protected by international copyright laws.

**5. Governing Law**
These Terms of Service and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of the jurisdiction in which our headquarters are located.`;

const refundPolicy = `**Refund & Return Policy**

We want you to be completely satisfied with your purchase. If you are not entirely happy with your order, we are here to help.

**1. Returns**
You have 30 days to return an item from the date you received it. To be eligible for a return, your item must be unused, unwashed, and in the same condition that you received it. It must also be in the original packaging with all tags attached.

**2. Refunds**
Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item. If your return is approved, we will initiate a refund to your credit card (or original method of payment).

**3. Non-Returnable Items**
Certain items are exempt from being returned, such as intimate wear (underwear, bodysuits) for hygiene reasons, and clearance items.

**4. Shipping**
You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.`;

async function updatePolicies() {
  // First get the current settings
  const { data, error } = await supabase
    .from('cms')
    .select('*')
    .eq('type', 'settings')
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is not found
    console.error('Error fetching settings:', error);
    process.exit(1);
  }

  let settingsData = data ? data.data : {};
  if (!settingsData.legal) settingsData.legal = {};
  
  settingsData.legal.privacyPolicy = privacyPolicy;
  settingsData.legal.terms = termsOfService;
  settingsData.legal.refund = refundPolicy;

  const { error: updateError } = await supabase
    .from('cms')
    .upsert({ type: 'settings', data: settingsData });

  if (updateError) {
    console.error('Error updating policies:', updateError);
    process.exit(1);
  }

  console.log('✅ Successfully updated legal policies in CMS');
}

updatePolicies();
