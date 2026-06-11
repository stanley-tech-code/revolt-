import { supabase } from './server/db/supabase.js';

async function testAuth() {
  console.log('--- STARTING E2E AUTH TEST ---');
  const baseUrl = 'http://localhost:5001/api/auth';
  const testEmail = `test_auth_${Date.now()}@revolt.com`;
  const testPhone = '+1234567890';
  const testPassword = 'Password123!';
  const newPassword = 'NewPassword456!';

  // 1. Try to register without phone
  console.log('1. Testing registration WITHOUT phone...');
  let res = await fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName: 'Test User', email: testEmail, password: testPassword })
  });
  let data = await res.json();
  if (!data.success && data.error.includes('phone number are required')) {
    console.log('✅ Registration blocked correctly when phone is missing.');
  } else {
    console.error('❌ Registration did not block missing phone!', data);
    return;
  }

  // 2. Try to register with phone
  console.log('\n2. Testing registration WITH phone...');
  res = await fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName: 'Test User', email: testEmail, password: testPassword, phone: testPhone })
  });
  data = await res.json();
  if (data.success && data.token) {
    console.log('✅ Registration succeeded with phone.');
  } else {
    console.error('❌ Registration failed!', data);
    return;
  }

  // 3. Test forgot password
  console.log('\n3. Testing Forgot Password...');
  res = await fetch(`${baseUrl}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail })
  });
  data = await res.json();
  if (data.success) {
    console.log('✅ Forgot Password request succeeded.');
  } else {
    console.error('❌ Forgot Password request failed!', data);
    return;
  }

  // Wait a moment for DB write
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 4. Retrieve token from CMS table directly
  console.log('\n4. Extracting token from DB...');
  const { data: resetsDoc } = await supabase.from('cms').select('data').eq('type', 'password_resets').single();
  const resetToken = resetsDoc?.data?.[testEmail]?.token;
  if (resetToken) {
    console.log(`✅ Token found: ${resetToken}`);
  } else {
    console.error('❌ Token not found in CMS table!', resetsDoc);
    return;
  }

  // 5. Reset Password
  console.log('\n5. Testing Reset Password...');
  res = await fetch(`${baseUrl}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, token: resetToken, newPassword })
  });
  data = await res.json();
  if (data.success) {
    console.log('✅ Password Reset succeeded.');
  } else {
    console.error('❌ Password Reset failed!', data);
    return;
  }

  // 6. Test login with new password
  console.log('\n6. Testing Login with NEW password...');
  res = await fetch(`${baseUrl}/client-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: newPassword })
  });
  data = await res.json();
  if (data.success) {
    console.log('✅ Login succeeded with new password!');
  } else {
    console.error('❌ Login failed with new password!', data);
  }

  console.log('\n--- E2E TEST COMPLETE ---');
}

testAuth();
