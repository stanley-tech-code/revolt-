import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useCms } from '../context/CmsContext';
import { useAnalytics } from '../context/AnalyticsContext';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { kenyaGeoData } from '../data/kenyaGeoData';

export default function Checkout() {
  const { cartItems, removeFromCart, clearCart, getCartTotal, appliedPromo, applyPromo, removePromo } = useStore();
  const { currentUser, updateProfile } = useAuth();
  const { db } = useCms();
  const { trackEvent } = useAnalytics();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cartItems.length > 0) {
      trackEvent('begin_checkout', {
        currency: 'KES',
        value: getCartTotal(),
        items: cartItems.map(item => ({ item_id: item.id, item_name: item.name, price: item.price, quantity: item.quantity }))
      });
    }
  }, []);

  // Promo State
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  // Location State
  const [locationMode, setLocationMode] = useState('manual'); // 'current' or 'manual'
  const [locationDetected, setLocationDetected] = useState(false);
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

  const [selectedSavedAddressIdx, setSelectedSavedAddressIdx] = useState(currentUser?.addresses?.length > 0 ? 0 : 'new');

  // Dynamic Delivery Fee
  const deliveryFee = React.useMemo(() => {
    if (!db.settings?.shipping?.zones || db.settings.shipping.zones.length === 0) return 500;
    
    let countyToCheck = addressData.county || '';
    if (selectedSavedAddressIdx !== null && selectedSavedAddressIdx !== 'new' && currentUser?.addresses) {
      countyToCheck = currentUser.addresses[selectedSavedAddressIdx].city || '';
    }

    const matchedZone = db.settings.shipping.zones.find(z => 
      z.name.toLowerCase() === (countyToCheck || '').toLowerCase()
    );
    return matchedZone ? Number(matchedZone.fee) : 500;
  }, [db.settings?.shipping?.zones, addressData.county, selectedSavedAddressIdx, currentUser]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyDIjIbkD-3tHyolYBMA9wcbVlWpWIDS5XE"
  });

  const onMapClick = useCallback((e) => {
    setAddressData(prev => ({
      ...prev,
      mapsPin: { lat: e.latLng.lat(), lng: e.latLng.lng() }
    }));
    setLocationDetected(true);
  }, []);

  const handleUseCurrentLocation = () => {
    setLocationMode('current');
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAddressData(prev => ({
            ...prev,
            mapsPin: { lat: position.coords.latitude, lng: position.coords.longitude }
          }));
          setLocationDetected(true);
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
  const taxRate = db.settings?.payments?.taxRate ? Number(db.settings.payments.taxRate) / 100 : 0.16;
  const tax = discountedSubtotal * taxRate; // Dynamic VAT
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

    setShowMpesaPrompt(false);
    setLoading(true);
    setError(null);

    // Mock Process Wait
    await new Promise(res => setTimeout(res, 2000));

    try {
      const token = localStorage.getItem('revolt_client_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      let finalDeliveryInfo = {
        method: 'deliver',
        address: {},
        appliedPromo: appliedPromo || null,
        discount: discount || 0
      };

      if (selectedSavedAddressIdx !== null && selectedSavedAddressIdx !== 'new' && currentUser?.addresses) {
        const savedAddr = currentUser.addresses[selectedSavedAddressIdx];
        finalDeliveryInfo.address = {
          name: contactInfo.fullName,
          phone: contactInfo.phone,
          street: savedAddr.street,
          city: savedAddr.city,
          country: savedAddr.country || 'Kenya',
          instructions: savedAddr.directions
        };
      } else {
        const fullAddress = locationMode === 'manual' 
          ? `${addressData.building ? addressData.building + ', ' : ''}${addressData.houseNo ? addressData.houseNo + ', ' : ''}${addressData.area ? addressData.area + ', ' : ''}${addressData.county}`
          : 'GPS Location Pin';

        finalDeliveryInfo.address = {
          name: contactInfo.fullName,
          phone: contactInfo.phone,
          street: fullAddress,
          city: addressData.county || 'Nairobi',
          country: 'Kenya',
          mapsPin: addressData.mapsPin,
          instructions: addressData.instructions
        };

        // AUTO SAVE NEW ADDRESS silently
        if (currentUser) {
          const newSavedAddr = {
            name: `Address ${currentUser.addresses ? currentUser.addresses.length + 1 : 1}`,
            street: fullAddress,
            city: addressData.county || 'Nairobi',
            zip: '',
            country: 'Kenya',
            phone: contactInfo.phone,
            directions: addressData.instructions,
            pinLink: ''
          };
          const updatedAddresses = [...(currentUser.addresses || []), newSavedAddr];
          updateProfile({ addresses: updatedAddresses }).catch(console.error);
        }
      }

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
          deliveryInfo: finalDeliveryInfo
        })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Checkout failed');

      trackEvent('purchase', {
        transaction_id: data.order.id,
        currency: 'KES',
        value: total,
        items: cartItems.map(item => ({ item_id: item.id, item_name: item.name, price: item.price, quantity: item.quantity }))
      });

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

  const isStep1Valid = () => {
    if (selectedSavedAddressIdx !== null && selectedSavedAddressIdx !== 'new') return true;
    if (locationMode === 'current' && locationDetected) return true;
    if (locationMode === 'manual' && addressData.county && addressData.subCounty && addressData.constituency && addressData.area) return true;
    return false;
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
          <button onClick={() => navigate('/account')} className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-6">Checkout</h1>
        <p className="text-gray-500 mb-8">Your cart is empty.</p>
        <button onClick={() => navigate('/')} className="bg-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800">
          Start Shopping
        </button>
      </div>
    );
  }

  // --- MAIN CHECKOUT WIZARD VIEW ---
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        
        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-8 text-center">Checkout</h1>
        
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <span className={step >= 1 ? 'text-black' : ''}>1. Delivery</span>
          <span className="w-8 h-px bg-gray-300"></span>
          <span className={step >= 2 ? 'text-black' : ''}>2. Summary</span>
          <span className="w-8 h-px bg-gray-300"></span>
          <span className={step >= 3 ? 'text-black' : ''}>3. Payment</span>
        </div>

        <div className="text-center mb-8">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Step {step} of 3</span>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 border border-red-200 text-sm mb-6">
            {error}
          </div>
        )}

        <div className="bg-white p-6 md:p-10 border border-gray-200 shadow-sm mb-8">
          
          {/* =========================================
              STEP 1: DELIVERY ADDRESS
          ========================================= */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Delivery Address</h2>
              
              {currentUser?.addresses?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-gray-500">Saved Addresses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentUser.addresses.map((addr, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setSelectedSavedAddressIdx(idx)}
                        className={`p-4 border cursor-pointer transition-colors ${selectedSavedAddressIdx === idx ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-400'}`}
                      >
                        <p className="font-bold text-sm uppercase tracking-wider mb-1">{addr.name || `Address ${idx + 1}`}</p>
                        <p className="text-xs text-gray-600">{addr.street}</p>
                        <p className="text-xs text-gray-600">{addr.city}{addr.zip ? `, ${addr.zip}` : ''}</p>
                      </div>
                    ))}
                    <div 
                      onClick={() => setSelectedSavedAddressIdx('new')}
                      className={`p-4 border cursor-pointer transition-colors flex items-center justify-center ${selectedSavedAddressIdx === 'new' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-400'}`}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider">+ Add New Address</span>
                    </div>
                  </div>
                </div>
              )}

              {(selectedSavedAddressIdx === 'new' || !currentUser?.addresses?.length) && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-fade-in">
                    <button 
                      onClick={() => setLocationMode('manual')}
                      className={`p-6 border-2 transition-colors text-center ${locationMode === 'manual' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}
                    >
                      <span className="text-2xl block mb-2">✍️</span>
                      <span className="block font-bold text-sm uppercase tracking-wider">Enter Manually</span>
                      <span className="block text-[10px] text-gray-500 mt-1">Type your address details</span>
                    </button>

                    <button 
                      onClick={handleUseCurrentLocation}
                      className={`p-6 border-2 transition-colors text-center ${locationMode === 'current' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}
                    >
                      <span className="text-2xl block mb-2">📍</span>
                      <span className="block font-bold text-sm uppercase tracking-wider">Use Current Location</span>
                      <span className="block text-[10px] text-gray-500 mt-1">Recommended for accuracy</span>
                    </button>
                  </div>

              {locationMode === 'current' && (
                <div className="animate-fade-in mb-8">
                  <div className="bg-blue-50 border border-blue-200 p-4 text-blue-800 text-sm flex items-center gap-3">
                    <span className="text-xl">📍</span>
                    {locationDetected ? (
                      <span>Location detected: {addressData.mapsPin.lat.toFixed(4)}, {addressData.mapsPin.lng.toFixed(4)}</span>
                    ) : (
                      <span>Waiting for location permission...</span>
                    )}
                  </div>
                  
                  {/* Small Map Preview */}
                  {locationDetected && (
                    <div className="mt-4 h-48 w-full bg-gray-100 border border-gray-200">
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
                  )}
                  
                  <div className="mt-6">
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-700">Delivery Instructions / Notes (Optional)</label>
                    <textarea value={addressData.instructions} onChange={e => setAddressData({...addressData, instructions: e.target.value})} placeholder="e.g. Leave at reception" className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none min-h-[80px]" />
                  </div>
                </div>
              )}

              {locationMode === 'manual' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-700">County *</label>
                      <select 
                        value={addressData.county} 
                        onChange={e => setAddressData({...addressData, county: e.target.value, subCounty: '', constituency: ''})} 
                        className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none bg-white"
                      >
                        <option value="">Select County</option>
                        {Object.keys(kenyaGeoData).sort().map(county => (
                          <option key={county} value={county}>{county}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-700">Sub County *</label>
                      <select 
                        value={addressData.subCounty} 
                        onChange={e => setAddressData({...addressData, subCounty: e.target.value, constituency: ''})} 
                        disabled={!addressData.county}
                        className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <option value="">Select Sub County</option>
                        {addressData.county && kenyaGeoData[addressData.county] && Object.keys(kenyaGeoData[addressData.county]).sort().map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-700">Ward / Constituency *</label>
                      <select 
                        value={addressData.constituency} 
                        onChange={e => setAddressData({...addressData, constituency: e.target.value})} 
                        disabled={!addressData.subCounty}
                        className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <option value="">Select Ward / Constituency</option>
                        {addressData.subCounty && kenyaGeoData[addressData.county]?.[addressData.subCounty]?.map(ward => (
                          <option key={ward} value={ward}>{ward}</option>
                        ))}
                      </select>
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
                </>
              )}
            </div>
          )}

          {/* =========================================
              STEP 2: ORDER SUMMARY / ITEMS
          ========================================= */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 border border-gray-200 p-4">
                    <img src={item.primaryImage || item.image} alt={item.name} className="w-20 h-24 object-cover bg-gray-100" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-sm font-bold uppercase line-clamp-2">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Size: {item.size} | Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold mt-2">Ksh {((item.salePrice || item.originalPrice || item.price) * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border border-gray-200 p-6 bg-gray-50 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Product Subtotal</span>
                  <span>Ksh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{db.copy?.checkout?.deliveryLabel || 'Delivery Fee'}</span>
                  <span>Ksh {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{db.copy?.checkout?.taxLabel || 'Tax (VAT)'}</span>
                  <span>Ksh {tax.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-bold">
                    <span>Discount</span>
                    <span>-Ksh {discount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center mt-4">
                  <span className="font-bold uppercase tracking-widest">Total</span>
                  <span className="text-xl font-bold">Ksh {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2">Promo Code</p>
                {!appliedPromo ? (
                  <div className="flex gap-2">
                    <input type="text" value={promoInput} onChange={e => setPromoInput(e.target.value.toUpperCase())} placeholder="Enter code" className="flex-1 border border-gray-300 p-3 text-sm focus:border-black outline-none" />
                    <button onClick={handleApplyPromo} disabled={promoLoading} className="bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50">
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-green-50 text-green-800 p-4 text-sm border border-green-200">
                    <span className="font-bold">✓ {appliedPromo.code} Applied</span>
                    <button onClick={removePromo} className="underline hover:no-underline">Remove</button>
                  </div>
                )}
                {promoError && <p className="text-red-500 text-[10px] mt-2">{promoError}</p>}
              </div>

            </div>
          )}

          {/* =========================================
              STEP 3: PAYMENT / CONFIRMATION
          ========================================= */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Contact & Payment</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-700">Full Name *</label>
                  <input type="text" value={contactInfo.fullName} onChange={e => setContactInfo({...contactInfo, fullName: e.target.value})} className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-700">Phone Number *</label>
                  <input type="tel" value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})} placeholder="07XXXXXXXX" className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-700">Email Address *</label>
                  <input type="email" value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none" />
                </div>
              </div>

              <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Payment Method</h3>
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

            </div>
          )}

        </div>

        {/* =========================================
            NAVIGATION BUTTONS
        ========================================= */}
        <div className="flex justify-between items-center border-t border-gray-200 pt-6">
          {step > 1 ? (
            <button 
              onClick={() => { setStep(step - 1); window.scrollTo(0,0); }} 
              className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-2"
            >
              <span>←</span> Previous
            </button>
          ) : (
            <div></div> // Spacer to keep Next button on the right
          )}
          
          {step < 3 ? (
            <button 
              onClick={() => { setStep(step + 1); window.scrollTo(0,0); }}
              disabled={step === 1 && !isStep1Valid()}
              className="bg-black text-white px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next Step <span>→</span>
            </button>
          ) : (
            <button 
              onClick={handlePlaceOrderClick}
              disabled={loading}
              className="bg-black text-white px-10 py-4 text-[12px] font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          )}
        </div>

      </div>

      {/* MPESA PROMPT MODAL */}
      {showMpesaPrompt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 max-w-sm w-full text-center">
            <img src={db.copy?.checkout?.mpesaLogo || "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/1200px-M-PESA_LOGO-01.svg.webp"} alt="M-Pesa" className="h-12 mx-auto mb-6 object-contain grayscale" />
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
