import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

export default function Checkout() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal, appliedPromo, applyPromo, removePromo } = useStore();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Promo State
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  // Delivery State
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState('standard'); // standard, express, same-day
  const [deliveryFee, setDeliveryFee] = useState(500); // base standard fee in KES

  // Inline Address Form State
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    city: '',
    area: '',
    building: '',
    mapsPin: { lat: -1.2921, lng: 36.8219 }, // Default to Nairobi
    instructions: ''
  });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "MOCK_API_KEY_FOR_DEV" // User would replace this with real key
  });

  const onMapClick = useCallback((e) => {
    setNewAddress(prev => ({
      ...prev,
      mapsPin: { lat: e.latLng.lat(), lng: e.latLng.lng() }
    }));
  }, []);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('card'); // card, mpesa, airtel
  const [mpesaPhone, setMpesaPhone] = useState(currentUser?.phone || '');
  const [airtelPhone, setAirtelPhone] = useState(currentUser?.phone || '');
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
    if (!res.success) {
      setPromoError(res.error);
    } else {
      setPromoInput('');
    }
    setPromoLoading(false);
  };

  // Update delivery fee when method changes
  useEffect(() => {
    if (deliveryMethod === 'standard') setDeliveryFee(500);
    else if (deliveryMethod === 'express') setDeliveryFee(1000);
    else if (deliveryMethod === 'same-day') setDeliveryFee(2000);
    else setDeliveryFee(0); // click-and-collect
  }, [deliveryMethod]);

  const handleNextStep = () => {
    if (step === 1 && cartItems.length === 0) return;
    if (step === 2 && (!currentUser?.addresses || currentUser.addresses.length === 0)) {
      setError("Please save your delivery location before proceeding.");
      return;
    }
    setError(null);
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.phone || !newAddress.city || !newAddress.area) {
      setError("Please fill in all required delivery fields.");
      return;
    }
    setSavingAddress(true);
    setError(null);
    try {
      const token = localStorage.getItem('revolt_client_token');
      const updatedAddresses = [...(currentUser?.addresses || []), {
        name: newAddress.name,
        phone: newAddress.phone,
        city: newAddress.city,
        street: newAddress.area, // Mapping area to existing street field
        building: newAddress.building,
        mapsPin: newAddress.mapsPin,
        instructions: newAddress.instructions,
        zip: '00100', // Default mock zip
        country: 'Kenya'
      }];

      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ addresses: updatedAddresses })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      // Force context refresh by updating local user if possible, or assume it updates via AuthContext
      setIsAddingNewAddress(false);
      setSelectedAddressIdx(updatedAddresses.length - 1);
      // We wait for the AuthContext to fetch the updated user in background
      // For immediate UI update, we might need a refreshProfile method.
      window.location.reload(); // Quick hack to refresh context if reload isn't disruptive here. Wait, reload resets cart if not persisted? StoreContext uses localStorage. So reload is fine, but UX is better without.
      // Better: just trigger a refetch or optimistic update if the context provides it.
      // The context has no direct 'refreshUser', so we'll just reload the page for now to ensure db sync.
    } catch (err) {
      setError(err.message);
    }
    setSavingAddress(false);
  };

  // Advanced AI Recommendation Logic (V2)
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

    const minIdx = Math.min(bustIdx, waistIdx, hipsIdx);
    const spread = Math.max(bustIdx, waistIdx, hipsIdx) - minIdx;
    if (spread >= 2) {
      if (bustIdx > hipsIdx) notes.push("Fuller bust; tailor notes may be needed for bottoms.");
      if (hipsIdx > bustIdx) notes.push("Fuller hips; tailor notes may be needed for tops.");
    }

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const primarySize = sizes[recommendedIdx];
    const secondarySize = recommendedIdx < 5 ? sizes[recommendedIdx + 1] : sizes[Math.max(0, recommendedIdx - 1)];

    return { size: primarySize, secondarySize, notes };
  };

  const handlePrevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const triggerPayment = () => {
    if (!currentUser) return;
    if (paymentMethod === 'mpesa') {
      if (!mpesaPhone) {
        setError('Please enter your M-Pesa phone number.');
        return;
      }
      setShowMpesaPrompt(true);
    } else {
      processActualOrder();
    }
  };

  const processActualOrder = async () => {
    setShowMpesaPrompt(false);
    setLoading(true);
    setError(null);

    // Mocking Payment Processing Wait
    await new Promise(res => setTimeout(res, 2000));

    const selectedAddress = currentUser?.addresses?.[selectedAddressIdx] || { name: 'Guest User', street: '123 Fake Street', city: 'Fake City', zip: '00000', country: 'Kenya' };

    try {
      const token = localStorage.getItem('revolt_client_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
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
          deliveryInfo: {
            method: deliveryMethod,
            address: selectedAddress,
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
      if (!data.success) {
        throw new Error(data.error || 'Checkout failed');
      }

      setOrderConfirmed(data.order);
      clearCart();
      setStep(4);
      
      // Wait a bit, then redirect to home
      setTimeout(() => {
        window.location.href = '/';
      }, 5000);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (step === 4 && orderConfirmed) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-6">Order Confirmed</h1>
        <p className="text-gray-600 mb-8">Thank you for shopping with REVOLT. Your order #{orderConfirmed.id.slice(0,8)} has been placed successfully.</p>
        
        <div className="border border-gray-200 p-8 text-left max-w-2xl mx-auto mb-8 bg-gray-50">
          <h3 className="font-bold uppercase tracking-widest mb-4">Receipt Summary</h3>
          <p className="text-sm mb-2"><span className="font-semibold">Payment Method:</span> {paymentMethod.toUpperCase()}</p>
          <p className="text-sm mb-2"><span className="font-semibold">Delivery To:</span> {orderConfirmed.deliveryInfo.address.name} ({orderConfirmed.deliveryInfo.address.street})</p>
          <p className="text-sm mb-2"><span className="font-semibold">Total Paid:</span> Ksh {total.toLocaleString()}</p>
          {orderConfirmed.deliveryInfo?.appliedPromo && (
            <p className="text-sm mb-6 text-green-600">
              <span className="font-semibold">Promo Applied:</span> {orderConfirmed.deliveryInfo.appliedPromo.code} (-Ksh {orderConfirmed.deliveryInfo.discount?.toLocaleString()})
            </p>
          )}
          {!orderConfirmed.deliveryInfo?.appliedPromo && <div className="mb-6"></div>}
          
          <h4 className="font-bold text-xs uppercase tracking-wider mb-2">Items</h4>
          <ul className="text-sm space-y-2">
            {orderConfirmed.items.map((item, idx) => (
              <li key={idx} className="flex justify-between border-b border-gray-200 pb-2">
                <span>{item.quantity}x {item.name} ({item.size}, {item.color})</span>
                <span>Ksh {((item.salePrice || item.originalPrice) * item.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <button onClick={() => navigate('/')} className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
          Continue Shopping
        </button>
        <p className="text-xs text-gray-400 mt-4">You will be redirected to your account in 5 seconds...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 flex flex-col lg:flex-row gap-12">
      
      {/* LEFT COLUMN: Checkout Steps */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-8">Checkout</h1>
        
        {/* Step Progress Indicator */}
        <div className="flex items-center gap-4 mb-12 text-xs font-bold uppercase tracking-widest text-gray-400">
          <span className={step >= 1 ? 'text-black' : ''}>1. Cart</span>
          <span className="w-8 h-px bg-gray-200"></span>
          <span className={step >= 2 ? 'text-black' : ''}>2. Delivery</span>
          <span className="w-8 h-px bg-gray-200"></span>
          <span className={step >= 3 ? 'text-black' : ''}>3. Payment</span>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-8 border border-red-200 text-sm">
            {error}
          </div>
        )}

        {/* STEP 1: CART REVIEW */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Review Your Cart</h2>
            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item, idx) => (
                  <div key={item.id || idx} className="flex gap-4 border border-gray-200 p-4 bg-white relative">
                    <img src={item.primaryImage || item.image} alt={item.name} className="w-24 h-32 object-cover" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold uppercase text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">Size: {item.size} | Color: {item.color}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-300">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100">-</button>
                          <span className="px-4 text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
                        </div>
                        <p className="font-bold text-sm">Ksh {((item.salePrice || item.originalPrice || item.price) * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleNextStep}
                disabled={cartItems.length === 0}
                className="bg-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50"
              >
                Proceed to Delivery
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DELIVERY */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Delivery Information</h2>
            
            {(!currentUser?.addresses || currentUser.addresses.length === 0 || isAddingNewAddress) ? (
              <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest">Add New Delivery Location</h3>
                  {currentUser?.addresses?.length > 0 && (
                    <button onClick={() => setIsAddingNewAddress(false)} className="text-[10px] uppercase font-bold text-gray-500 hover:text-black">Cancel</button>
                  )}
                </div>
                
                <form onSubmit={handleSaveAddress} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Full Name *</label>
                      <input type="text" required value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Phone Number *</label>
                      <input type="tel" required value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">County / City *</label>
                      <input type="text" required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Area / Estate / Neighborhood *</label>
                      <input type="text" required value={newAddress.area} onChange={e => setNewAddress({...newAddress, area: e.target.value})} className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Building Name / Appt / House No</label>
                    <input type="text" value={newAddress.building} onChange={e => setNewAddress({...newAddress, building: e.target.value})} className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black" />
                  </div>

                  <div className="mt-6 mb-4 border border-gray-300 bg-white">
                    <div className="p-4 border-b border-gray-200">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em]">Google Maps Pin Location</label>
                      <p className="text-[10px] text-gray-500 mt-1">Tap the map to drop a pin at your exact delivery location.</p>
                    </div>
                    <div className="h-64 w-full bg-gray-100">
                      {isLoaded ? (
                        <GoogleMap
                          mapContainerStyle={{ width: '100%', height: '100%' }}
                          center={newAddress.mapsPin}
                          zoom={13}
                          onClick={onMapClick}
                          options={{ disableDefaultUI: true, zoomControl: true }}
                        >
                          <Marker position={newAddress.mapsPin} />
                        </GoogleMap>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <p className="text-xs text-gray-400">Loading Map...</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Delivery Instructions / Notes (Optional)</label>
                    <textarea value={newAddress.instructions} onChange={e => setNewAddress({...newAddress, instructions: e.target.value})} placeholder="e.g. Leave at reception, Call upon arrival" className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black min-h-[80px]" />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={savingAddress} className="bg-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50">
                      {savingAddress ? 'Saving...' : 'Save Delivery Location'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Choose a Delivery Location</h3>
                <div className="grid grid-cols-1 gap-4">
                  {currentUser.addresses.map((addr, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedAddressIdx(idx)}
                      className={`border p-4 cursor-pointer transition-colors ${selectedAddressIdx === idx ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-400'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm mb-1">{addr.name}</p>
                          <p className="text-xs text-gray-600">{addr.building ? `${addr.building}, ` : ''}{addr.street}</p>
                          <p className="text-xs text-gray-600">{addr.city}</p>
                          <p className="text-[10px] text-gray-500 mt-2">📞 {addr.phone}</p>
                          {addr.instructions && <p className="text-[10px] text-gray-500 mt-1 italic">Note: {addr.instructions}</p>}
                        </div>
                        {selectedAddressIdx === idx && (
                          <span className="bg-black text-white text-[9px] uppercase tracking-widest px-2 py-1 font-bold">Selected</span>
                        )}
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setIsAddingNewAddress(true)}
                    className="border border-dashed border-gray-300 p-4 text-center hover:border-black hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest">+ Add New Delivery Location</span>
                  </button>
                </div>
              </div>
            )}

            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 mt-8">Delivery Method</h3>
            <div className="space-y-3 mb-8">
              <label className={`flex items-center justify-between border p-4 cursor-pointer transition-colors ${deliveryMethod === 'standard' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="delivery" checked={deliveryMethod === 'standard'} onChange={() => setDeliveryMethod('standard')} className="text-black focus:ring-black" />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider">Standard Delivery</p>
                    <p className="text-xs text-gray-500">2-3 Business Days</p>
                  </div>
                </div>
                <p className="text-sm font-bold">Ksh 500</p>
              </label>

              <label className={`flex items-center justify-between border p-4 cursor-pointer transition-colors ${deliveryMethod === 'express' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="delivery" checked={deliveryMethod === 'express'} onChange={() => setDeliveryMethod('express')} className="text-black focus:ring-black" />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider">Express Delivery</p>
                    <p className="text-xs text-gray-500">Next Business Day</p>
                  </div>
                </div>
                <p className="text-sm font-bold">Ksh 1,000</p>
              </label>
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={handlePrevStep} className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black">
                Back to Cart
              </button>
              <button 
                onClick={handleNextStep}
                disabled={isAddingNewAddress}
                className="bg-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Payment</h2>
            
            <div className="flex gap-2 border-b border-gray-200 mb-8 overflow-x-auto pb-px">
              <button onClick={() => setPaymentMethod('card')} className={`px-6 py-3 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${paymentMethod === 'card' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}>Credit / Debit Card</button>
              <button onClick={() => setPaymentMethod('mpesa')} className={`px-6 py-3 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${paymentMethod === 'mpesa' ? 'border-b-2 border-[#4CAF50] text-[#4CAF50]' : 'text-gray-400 hover:text-[#4CAF50]'}`}>M-Pesa</button>
              <button onClick={() => setPaymentMethod('airtel')} className={`px-6 py-3 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${paymentMethod === 'airtel' ? 'border-b-2 border-[#E53935] text-[#E53935]' : 'text-gray-400 hover:text-[#E53935]'}`}>Airtel Money</button>
            </div>

            <div className="min-h-[250px] border border-gray-200 p-8 bg-gray-50 mb-8 relative">
              {loading && (
                <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center backdrop-blur-sm">
                  <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest animate-pulse">Processing Payment...</p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 text-blue-800 text-xs border border-blue-200 mb-6 flex items-start gap-3">
                    <span className="text-lg">ℹ️</span>
                    <p>This is a simulated Checkout. No real charges will be made. You can click "Pay Now" to simulate a successful transaction.</p>
                  </div>
                  <input type="text" placeholder="Cardholder Name" className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black" />
                  <input type="text" placeholder="Card Number (0000 0000 0000 0000)" className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black" />
                  <div className="flex gap-4">
                    <input type="text" placeholder="MM/YY" className="w-1/2 border border-gray-300 p-3 text-sm focus:outline-none focus:border-black" />
                    <input type="text" placeholder="CVV" className="w-1/2 border border-gray-300 p-3 text-sm focus:outline-none focus:border-black" />
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-4">🔒 Secured by Stripe</p>
                </div>
              )}

              {paymentMethod === 'mpesa' && (
                <div className="text-center py-6">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/1200px-M-PESA_LOGO-01.svg.png" alt="M-Pesa" className="h-12 mx-auto mb-6 object-contain grayscale opacity-80" />
                  <p className="text-sm mb-4">Enter your M-Pesa registered number. We will send an STK push directly to your phone.</p>
                  <input type="tel" value={mpesaPhone} onChange={e => setMpesaPhone(e.target.value)} placeholder="e.g. 0712345678" className="w-full max-w-sm mx-auto border border-gray-300 p-3 text-center text-sm focus:outline-none focus:border-[#4CAF50] block" />
                </div>
              )}

              {paymentMethod === 'airtel' && (
                <div className="text-center py-6">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Airtel_logo.svg/512px-Airtel_logo.svg.png" alt="Airtel" className="h-10 mx-auto mb-6 object-contain grayscale opacity-80" />
                  <p className="text-sm mb-4">Enter your Airtel Money registered number. A payment prompt will appear on your screen.</p>
                  <input type="tel" value={airtelPhone} onChange={e => setAirtelPhone(e.target.value)} placeholder="e.g. 0732345678" className="w-full max-w-sm mx-auto border border-gray-300 p-3 text-center text-sm focus:outline-none focus:border-[#E53935] block" />
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <button onClick={handlePrevStep} disabled={loading} className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black">
                Back to Delivery
              </button>
              <button 
                onClick={triggerPayment}
                disabled={loading}
                className="bg-black text-white px-10 py-4 text-[12px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-transform active:scale-95 flex items-center gap-2"
              >
                Pay Ksh {total.toLocaleString()}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Order Summary Sticky Sidebar */}
      {step < 4 && (
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className="sticky top-32 border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold uppercase tracking-widest mb-6 text-sm border-b border-gray-200 pb-4">Order Summary</h3>
            
            <div className="mb-6">
              {!appliedPromo ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo Code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="flex-1 border border-gray-300 p-2 text-xs uppercase tracking-wider focus:outline-none focus:border-black"
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={promoLoading || !promoInput.trim()}
                    className="bg-black text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
                  >
                    {promoLoading ? '...' : 'Apply'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 text-green-700 border border-green-200 p-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase tracking-wider">{appliedPromo.code}</span>
                    <span className="bg-green-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">
                      {appliedPromo.discountType === 'percentage' ? `${appliedPromo.discountValue}% OFF` : `Ksh ${appliedPromo.discountValue} OFF`}
                    </span>
                  </div>
                  <button onClick={removePromo} className="text-green-800 hover:text-black font-bold uppercase text-[10px] tracking-widest">&times; Remove</button>
                </div>
              )}
              {promoError && <p className="text-red-500 text-[10px] mt-2 uppercase tracking-widest">{promoError}</p>}
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>Ksh {subtotal.toLocaleString()}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Discount</span>
                  <span>- Ksh {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>VAT (16%)</span>
                <span>Ksh {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? 'Free' : `Ksh ${deliveryFee.toLocaleString()}`}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="flex justify-between items-end">
                <span className="font-bold uppercase tracking-widest text-sm">Total</span>
                <span className="font-bold text-2xl">Ksh {total.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Display small items preview if not on cart step */}
            {step > 1 && (
              <div className="border-t border-gray-200 pt-6 mt-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">In Your Bag</p>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {cartItems.map((item, idx) => (
                    <div key={item.id || idx} className="flex gap-3">
                      <img src={item.primaryImage || item.image} alt={item.name} className="w-12 h-16 object-cover bg-gray-100" />
                      <div>
                        <p className="text-xs font-bold uppercase">{item.name}</p>
                        <p className="text-[10px] text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* M-PESA STK PUSH SIMULATION MODAL */}
      {showMpesaPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-sm rounded-lg shadow-2xl overflow-hidden animate-fade-in relative">
            <div className="bg-[#4CAF50] text-white text-center py-4 relative">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/1200px-M-PESA_LOGO-01.svg.png" alt="M-Pesa" className="h-8 mx-auto brightness-0 invert" />
            </div>
            <div className="p-6 text-center">
              <p className="text-sm font-semibold mb-2 text-gray-800">Safaricom</p>
              <p className="text-sm mb-6 text-gray-600">Do you want to pay Ksh {total.toLocaleString()} to REVOLT STORE? Enter M-PESA PIN</p>
              <input 
                type="password" 
                maxLength="4"
                placeholder="PIN" 
                className="w-32 mx-auto text-center border-b-2 border-gray-300 text-2xl tracking-[0.5em] focus:outline-none focus:border-[#4CAF50] mb-8 py-2 block" 
              />
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowMpesaPrompt(false)}
                  className="flex-1 py-3 text-sm font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-100 transition-colors rounded"
                >
                  Cancel
                </button>
                <button 
                  onClick={processActualOrder}
                  className="flex-1 py-3 text-sm font-bold uppercase tracking-wider bg-[#4CAF50] text-white hover:bg-[#43a047] transition-colors rounded shadow-lg shadow-green-200"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
