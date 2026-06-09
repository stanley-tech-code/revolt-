import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

export default function Checkout() {
  const { cartItems, removeFromCart, clearCart, getCartTotal, appliedPromo, applyPromo, removePromo } = useStore();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Promo State
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  // Delivery State
  const [deliveryMethod, setDeliveryMethod] = useState('deliver'); // only "deliver" now
  const [deliveryFee, setDeliveryFee] = useState(500); 

  // Location State
  const [locationMode, setLocationMode] = useState('manual'); // 'current' or 'manual'
  const [addressData, setAddressData] = useState({
    county: '',
    subCounty: '',
    constituency: '',
    ward: '',
    area: '',
    building: '',
    houseNo: '',
    instructions: '',
    mapsPin: { lat: -1.2921, lng: 36.8219 } // Default Nairobi
  });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyDIjIbkD-3tHyolYBMA9wcbVlWpWIDS5XE"
  });

  const onMapClick = useCallback((e) => {
    setAddressData(prev => ({
      ...prev,
      mapsPin: { lat: e.latLng.lat(), lng: e.latLng.lng() }
    }));
  }, []);

  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAddressData(prev => ({
            ...prev,
            mapsPin: { lat: position.coords.latitude, lng: position.coords.longitude }
          }));
          setLocationMode('current');
        },
        (err) => {
          alert("Unable to retrieve your location. Please check browser permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Contact Info
  const [contactInfo, setContactInfo] = useState({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || ''
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('mpesa'); // mpesa, card, cod
  const [mpesaPhone, setMpesaPhone] = useState(currentUser?.phone || '');
  const [showMpesaPrompt, setShowMpesaPrompt] = useState(false);
  
  const subtotal = getCartTotal();
  
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'percentage') {
      discount = subtotal * (appliedPromo.discountValue / 100);
    } else {
      discount = appliedPromo.discountValue;
    }
  }
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const tax = discountedSubtotal * 0.16; // 16% VAT
  const total = discountedSubtotal + tax + deliveryFee;

  const [orderConfirmed, setOrderConfirmed] = useState(null);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    const res = await applyPromo(promoInput);
    if (!res.success) setPromoError(res.error);
    else setPromoInput('');
    setPromoLoading(false);
  };

  // AI Recommendation Logic (V2)
  const getAiRecommendation = () => {
    if (!currentUser?.measurements) return null;
    const { bust, waist, hips, fitPreference, shoppingIntent, unit } = currentUser.measurements;
    const b = Number(bust); const w = Number(waist); const h = Number(hips);
    if (!b || !w || !h) return null;
    const factor = unit === 'in' ? 2.54 : 1;
    const b_cm = b * factor; const w_cm = w * factor; const h_cm = h * factor;

    const getDimSize = (val, thresholds) => {
      if (val <= thresholds.xs) return 0;
      if (val <= thresholds.s) return 1;
      if (val <= thresholds.m) return 2;
      if (val <= thresholds.l) return 3;
      if (val <= thresholds.xl) return 4;
      return 5;
    };

    const bustIdx = getDimSize(b_cm, { xs: 85, s: 91, m: 97, l: 105, xl: 113 });
    const waistIdx = getDimSize(w_cm, { xs: 66, s: 71, m: 77, l: 85, xl: 93 });
    const hipsIdx = getDimSize(h_cm, { xs: 91, s: 97, m: 103, l: 111, xl: 119 });

    let recommendedIdx = Math.max(bustIdx, waistIdx, hipsIdx);
    let notes = [];

    if (shoppingIntent === 'Top') recommendedIdx = Math.max(bustIdx, waistIdx);
    else if (shoppingIntent === 'Skirt') recommendedIdx = Math.max(waistIdx, hipsIdx);

    if (fitPreference === 'Relaxed' || fitPreference === 'Oversized') {
      recommendedIdx = Math.min(5, recommendedIdx + 1);
      notes.push(`Sized up for a ${fitPreference.toLowerCase()} fit.`);
    }

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    return { 
      size: sizes[recommendedIdx], 
      secondarySize: recommendedIdx < 5 ? sizes[recommendedIdx + 1] : sizes[Math.max(0, recommendedIdx - 1)], 
      notes 
    };
  };

  const processActualOrder = async () => {
    // Validation
    if (!contactInfo.fullName || !contactInfo.phone || !contactInfo.email) {
      setError("Please fill in all contact information.");
      window.scrollTo(0,0);
      return;
    }
    const kenyaPhoneRegex = /^(07|01|254)\d{8}$/;
    if (!kenyaPhoneRegex.test(contactInfo.phone)) {
      setError("Please enter a valid Kenyan phone number (e.g. 0712345678).");
      window.scrollTo(0,0);
      return;
    }
    if (locationMode === 'manual' && (!addressData.county || !addressData.area)) {
      setError("Please provide at least your County and Area/Estate for delivery.");
      window.scrollTo(0,0);
      return;
    }

    setShowMpesaPrompt(false);
    setLoading(true);
    setError(null);

    // Mock Process Wait
    await new Promise(res => setTimeout(res, 2000));

    try {
      const token = localStorage.getItem('revolt_client_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const fullAddress = `${addressData.building ? addressData.building + ', ' : ''}${addressData.houseNo ? addressData.houseNo + ', ' : ''}${addressData.area ? addressData.area + ', ' : ''}${addressData.county}`;

      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items: cartItems,
          subtotal: discountedSubtotal,
          tax,
          deliveryFee,
          total,
          paymentMethod,
          deliveryInfo: {
            method: 'deliver',
            address: {
              name: contactInfo.fullName,
              phone: contactInfo.phone,
              street: fullAddress || 'Current Location Pin',
              city: addressData.county || 'Nairobi',
              country: 'Kenya',
              mapsPin: addressData.mapsPin,
              instructions: addressData.instructions
            },
            appliedPromo: appliedPromo || null,
            discount: discount || 0,
            measurements: currentUser?.measurements || null,
            aiRecommendedSize: getAiRecommendation()?.size || null,
            aiSecondarySize: getAiRecommendation()?.secondarySize || null,
            aiFitNotes: getAiRecommendation()?.notes || []
          }
        })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Checkout failed');

      setOrderConfirmed(data.order);
      clearCart();
      window.scrollTo(0,0);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handlePlaceOrderClick = () => {
    if (paymentMethod === 'mpesa' && !mpesaPhone) {
      setMpesaPhone(contactInfo.phone); // default to contact phone
      setShowMpesaPrompt(true);
    } else {
      processActualOrder();
    }
  };

  // --- ORDER CONFIRMATION VIEW ---
  if (orderConfirmed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 animate-fade-in text-center">
        <div className="mb-8">
          <span className="text-6xl">🎉</span>
        </div>
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Order Confirmed</h1>
        <p className="text-gray-600 mb-8">Thank you, {contactInfo.fullName}! Your order is being processed.</p>
        
        <div className="border border-gray-200 p-6 md:p-10 text-left bg-white shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Order Number</p>
              <p className="font-bold text-lg mb-6">RVT-{orderConfirmed.id.slice(0,6).toUpperCase()}</p>
              
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Expected Delivery</p>
              <p className="font-bold mb-6">Within 2-3 Business Days</p>

              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Payment Status</p>
              <p className="font-bold text-green-700">Paid ({paymentMethod.toUpperCase()})</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Delivery Address</p>
              <p className="text-sm text-gray-800 leading-relaxed mb-6">
                {orderConfirmed.deliveryInfo.address.name}<br/>
                {orderConfirmed.deliveryInfo.address.street}<br/>
                {orderConfirmed.deliveryInfo.address.city}, {orderConfirmed.deliveryInfo.address.country}<br/>
                📞 {orderConfirmed.deliveryInfo.address.phone}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={() => navigate('/components/account')} className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
            Track Order
          </button>
          <button onClick={() => navigate('/')} className="border border-gray-300 text-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // --- EMPTY CART VIEW ---
  if (cartItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-6">Checkout</h1>
        <p className="text-gray-500 mb-8">Your cart is empty.</p>
        <button onClick={() => navigate('/')} className="bg-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800">
          Start Shopping
        </button>
      </div>
    );
  }

  // --- MAIN CHECKOUT VIEW ---
  return (
    <div className="bg-gray-50 min-h-screen pb-32 lg:pb-12">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 flex flex-col lg:flex-row gap-8">
        
        {/* MAIN COLUMN */}
        <div className="flex-1 space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-4">Checkout</h1>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 border border-red-200 text-sm">
              {error}
            </div>
          )}

          {/* STEP 1: DELIVERY METHOD */}
          <section className="bg-white p-6 md:p-8 border border-gray-200 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Step 1: Delivery Method</h2>
            <div className="border-2 border-black p-6 cursor-pointer bg-gray-50 relative">
              <div className="absolute top-4 right-4 w-5 h-5 rounded-full border-4 border-black bg-white"></div>
              <p className="text-lg font-bold mb-1">🚚 Deliver to My Location</p>
              <p className="text-xs text-gray-500">Fast, secure delivery to your doorstep.</p>
            </div>
          </section>

          {/* STEP 2: LOCATION SELECTION */}
          <section className="bg-white p-6 md:p-8 border border-gray-200 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Step 2: Location Selection</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button 
                onClick={handleUseCurrentLocation}
                className={`p-6 border-2 transition-colors text-center ${locationMode === 'current' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}
              >
                <span className="text-2xl block mb-2">📍</span>
                <span className="block font-bold text-sm uppercase tracking-wider">Use Current Location</span>
                <span className="block text-[10px] text-gray-500 mt-1">Recommended for accuracy</span>
              </button>

              <button 
                onClick={() => setLocationMode('manual')}
                className={`p-6 border-2 transition-colors text-center ${locationMode === 'manual' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}
              >
                <span className="text-2xl block mb-2">✍️</span>
                <span className="block font-bold text-sm uppercase tracking-wider">Enter Manually</span>
                <span className="block text-[10px] text-gray-500 mt-1">Type your address details</span>
              </button>
            </div>

            {locationMode === 'manual' && (
              <div className="space-y-4 animate-fade-in border border-gray-100 p-6 bg-gray-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-700">County *</label>
                    <input type="text" value={addressData.county} onChange={e => setAddressData({...addressData, county: e.target.value})} placeholder="e.g. Nairobi" className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-700">Sub County</label>
                    <input type="text" value={addressData.subCounty} onChange={e => setAddressData({...addressData, subCounty: e.target.value})} placeholder="e.g. Westlands" className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-700">Constituency</label>
                    <input type="text" value={addressData.constituency} onChange={e => setAddressData({...addressData, constituency: e.target.value})} className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-700">Ward (Optional)</label>
                    <input type="text" value={addressData.ward} onChange={e => setAddressData({...addressData, ward: e.target.value})} className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-700">Estate / Area *</label>
                    <input type="text" value={addressData.area} onChange={e => setAddressData({...addressData, area: e.target.value})} placeholder="e.g. Kileleshwa" className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-700">Building / Apartment</label>
                    <input type="text" value={addressData.building} onChange={e => setAddressData({...addressData, building: e.target.value})} placeholder="e.g. Sunset Apts" className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-700">House / Unit No.</label>
                    <input type="text" value={addressData.houseNo} onChange={e => setAddressData({...addressData, houseNo: e.target.value})} placeholder="e.g. B4" className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-700">Additional Instructions</label>
                  <textarea value={addressData.instructions} onChange={e => setAddressData({...addressData, instructions: e.target.value})} placeholder="e.g. Leave at reception" className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none min-h-[80px]" />
                </div>
              </div>
            )}
          </section>

          {/* STEP 3: MAP PREVIEW */}
          <section className="bg-white p-6 md:p-8 border border-gray-200 shadow-sm relative overflow-hidden">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Step 3: Map Confirmation</h2>
            
            <div className="flex flex-col md:flex-row gap-6 bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <div className="w-full md:w-1/2 h-48 bg-gray-200 rounded overflow-hidden">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={addressData.mapsPin}
                    zoom={15}
                    onClick={onMapClick}
                    options={{ disableDefaultUI: true, zoomControl: true }}
                  >
                    <Marker position={addressData.mapsPin} />
                  </GoogleMap>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">Loading Map...</div>
                )}
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Pin Location</p>
                <p className="font-bold text-sm mb-4">
                  {locationMode === 'current' ? 'Using Live GPS Coordinates' : (addressData.area ? `${addressData.area}, ${addressData.county}` : 'Manual Address Pending')}
                </p>
                
                <div className="flex justify-between border-t border-gray-200 pt-4 mb-2">
                  <span className="text-xs text-gray-600">Estimated Time</span>
                  <span className="text-xs font-bold">2-3 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Delivery Fee</span>
                  <span className="text-xs font-bold">Ksh {deliveryFee}</span>
                </div>
              </div>
            </div>
          </section>

          {/* STEP 4: CONTACT INFO */}
          <section className="bg-white p-6 md:p-8 border border-gray-200 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Step 4: Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-700">Full Name *</label>
                <input type="text" value={contactInfo.fullName} onChange={e => setContactInfo({...contactInfo, fullName: e.target.value})} className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-700">Phone Number *</label>
                <input type="tel" value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})} placeholder="07XXXXXXXX" className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-700">Email Address *</label>
                <input type="email" value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none" />
              </div>
            </div>
          </section>

          {/* STEP 6: PAYMENT METHOD */}
          <section className="bg-white p-6 md:p-8 border border-gray-200 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Step 5: Payment Method</h2>
            
            <div className="space-y-4">
              {/* M-PESA */}
              <label className={`block border p-4 cursor-pointer transition-colors ${paymentMethod === 'mpesa' ? 'border-[#4CAF50] bg-green-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="payment" checked={paymentMethod === 'mpesa'} onChange={() => setPaymentMethod('mpesa')} className="text-[#4CAF50] focus:ring-[#4CAF50]" />
                  <span className="font-bold text-sm tracking-wider">M-PESA (Default)</span>
                </div>
                {paymentMethod === 'mpesa' && (
                  <div className="mt-4 pl-7 animate-fade-in">
                    <p className="text-xs text-gray-600 mb-2">We will send an STK push to this number when you place the order.</p>
                    <input type="tel" value={mpesaPhone} onChange={e => setMpesaPhone(e.target.value)} placeholder="07XXXXXXXX" className="w-full md:w-1/2 border border-green-300 p-2 text-sm focus:border-[#4CAF50] outline-none bg-white" />
                  </div>
                )}
              </label>

              {/* CARD */}
              <label className={`block border p-4 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="text-black focus:ring-black" />
                  <span className="font-bold text-sm tracking-wider">Credit / Debit Card</span>
                </div>
              </label>

              {/* COD */}
              <label className={`block border p-4 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="text-black focus:ring-black" />
                  <span className="font-bold text-sm tracking-wider">Cash on Delivery</span>
                </div>
              </label>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: STICKY ORDER SUMMARY */}
        <div className="w-full lg:w-[380px] flex-shrink-0">
          <div className="sticky top-24 bg-white border border-gray-200 shadow-sm p-6 mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <img src={item.primaryImage || item.image} alt={item.name} className="w-16 h-20 object-cover bg-gray-100" />
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase line-clamp-2">{item.name}</p>
                    <p className="text-[10px] text-gray-500 mt-1">Size: {item.size} | Qty: {item.quantity}</p>
                    <p className="text-xs font-bold mt-1">Ksh {((item.salePrice || item.originalPrice || item.price) * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Product Subtotal</span>
                <span>Ksh {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span>Ksh {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (VAT 16%)</span>
                <span>Ksh {tax.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-bold">
                  <span>Discount</span>
                  <span>-Ksh {discount.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Promo Code */}
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2">Promo Code</p>
              {!appliedPromo ? (
                <div className="flex gap-2">
                  <input type="text" value={promoInput} onChange={e => setPromoInput(e.target.value.toUpperCase())} placeholder="Enter code" className="flex-1 border border-gray-300 p-2 text-sm focus:border-black outline-none" />
                  <button onClick={handleApplyPromo} disabled={promoLoading} className="bg-black text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50">
                    Apply
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center bg-green-50 text-green-800 p-3 text-xs border border-green-200">
                  <span className="font-bold">✓ {appliedPromo.code}</span>
                  <button onClick={removePromo} className="underline hover:no-underline">Remove</button>
                </div>
              )}
              {promoError && <p className="text-red-500 text-[10px] mt-2">{promoError}</p>}
            </div>

            <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-6">
              <span className="font-bold uppercase tracking-widest">Total</span>
              <span className="text-xl font-bold">Ksh {total.toLocaleString()}</span>
            </div>

            {/* Desktop Place Order Button (hidden on mobile, shown in bottom bar instead) */}
            <button 
              onClick={handlePlaceOrderClick}
              disabled={loading}
              className="hidden lg:flex w-full bg-black text-white py-4 justify-center items-center gap-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>

      </div>

      {/* MOBILE FIXED BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 flex justify-between items-center">
        <div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Amount</p>
          <p className="text-lg font-bold">Ksh {total.toLocaleString()}</p>
        </div>
        <button 
          onClick={handlePlaceOrderClick}
          disabled={loading}
          className="bg-black text-white px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </div>

      {/* MPESA PROMPT MODAL */}
      {showMpesaPrompt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 max-w-sm w-full text-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/1200px-M-PESA_LOGO-01.svg.png" alt="M-Pesa" className="h-12 mx-auto mb-6 object-contain grayscale" />
            <h3 className="font-bold uppercase tracking-widest mb-4">Complete Payment</h3>
            <p className="text-sm text-gray-600 mb-6">An STK push has been sent to <span className="font-bold">{mpesaPhone || contactInfo.phone}</span>. Please enter your PIN to complete the transaction.</p>
            <div className="w-8 h-8 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin mx-auto mb-6"></div>
            <button onClick={processActualOrder} className="text-[10px] text-gray-500 uppercase tracking-widest hover:text-black">
              Simulate Success
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
