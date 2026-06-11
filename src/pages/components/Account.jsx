import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCms } from '../../context/CmsContext';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const { currentUser, logout, updateProfile, updateAddresses } = useAuth();
  const { db } = useCms();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Address Book state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressIdx, setEditingAddressIdx] = useState(null);
  const [addressData, setAddressData] = useState({
    name: '', street: '', city: '', zip: '', country: '', phone: '', directions: '', pinLink: ''
  });
  
  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Tickets state
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    dateOfBirth: currentUser?.dateOfBirth || '',
    gender: currentUser?.gender || ''
  });

  // Fit Profile state (V2)
  const [fitStep, setFitStep] = useState(1);
  const [fitProfile, setFitProfile] = useState({
    unit: currentUser?.measurements?.unit || 'cm',
    age: currentUser?.measurements?.age || '',
    height: currentUser?.measurements?.height || '',
    weight: currentUser?.measurements?.weight || '',
    bust: currentUser?.measurements?.bust || '',
    underBust: currentUser?.measurements?.underBust || '',
    waist: currentUser?.measurements?.waist || '',
    hips: currentUser?.measurements?.hips || '',
    thighs: currentUser?.measurements?.thighs || '',
    shoulder: currentUser?.measurements?.shoulder || '',
    torso: currentUser?.measurements?.torso || '',
    fitPreference: currentUser?.measurements?.fitPreference || '',
    bodyShape: currentUser?.measurements?.bodyShape || '',
    fitConcerns: currentUser?.measurements?.fitConcerns || [],
    shoppingIntent: currentUser?.measurements?.shoppingIntent || ''
  });
  const [isSavingMeasurements, setIsSavingMeasurements] = useState(false);
  const [showFitResults, setShowFitResults] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    await updateProfile(profileData);
    setIsUpdating(false);
    alert("Profile updated successfully!");
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    
    const currentAddresses = [...(currentUser?.addresses || [])];
    
    if (editingAddressIdx !== null) {
      currentAddresses[editingAddressIdx] = addressData;
    } else {
      currentAddresses.push(addressData);
    }
    
    await updateAddresses(currentAddresses);
    setShowAddressForm(false);
    setEditingAddressIdx(null);
    setAddressData({ name: '', street: '', city: '', zip: '', country: '', phone: '', directions: '', pinLink: '' });
  };

  const handleDeleteAddress = async (idx) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    const currentAddresses = [...(currentUser?.addresses || [])];
    currentAddresses.splice(idx, 1);
    await updateAddresses(currentAddresses);
  };

  const handleEditAddress = (idx) => {
    const addr = currentUser.addresses[idx];
    setAddressData(addr);
    setEditingAddressIdx(idx);
    setShowAddressForm(true);
  };

  const tabs = [
    { id: 'profile', label: 'My Profile' },
    { id: 'fit-profile', label: 'Fit Profile' },
    { id: 'orders', label: 'Order History' },
    { id: 'addresses', label: 'Address Book' },
    { id: 'tickets', label: 'Support Tickets' },
  ];

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (activeTab === 'orders' && currentUser) {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await fetch('/api/checkout/orders', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('revolt_client_token')}` }
          });
          const data = await res.json();
          if (data.success) {
            setOrders(data.orders);
          }
        } catch (err) {
          console.error('Failed to fetch orders', err);
        }
        setLoadingOrders(false);
      };
      fetchOrders();
    } else if (activeTab === 'tickets' && currentUser) {
      const fetchTickets = async () => {
        setLoadingTickets(true);
        try {
          const res = await fetch('/api/messages', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('revolt_client_token')}` }
          });
          const data = await res.json();
          if (data.success) {
            setTickets(data.messages);
          }
        } catch (err) {
          console.error('Failed to fetch tickets', err);
        }
        setLoadingTickets(false);
      };
      fetchTickets();
      setSelectedTicket(null); // Reset selection when clicking tab
    }
  }, [activeTab, currentUser]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    
    try {
      const res = await fetch(`/api/messages/${selectedTicket.id}/reply`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('revolt_client_token')}`
        },
        body: JSON.stringify({ text: replyText })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedTicket(data.ticket);
        setTickets(tickets.map(t => t.id === data.ticket.id ? data.ticket : t));
        setReplyText('');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to send reply');
    }
  };

  const handleSaveMeasurements = async (e) => {
    e.preventDefault();
    setIsSavingMeasurements(true);
    await updateProfile({ measurements: fitProfile });
    setIsSavingMeasurements(false);
    setShowFitResults(true);
  };

  const toggleFitConcern = (concern) => {
    const concerns = [...fitProfile.fitConcerns];
    if (concerns.includes(concern)) {
      setFitProfile({ ...fitProfile, fitConcerns: concerns.filter(c => c !== concern) });
    } else {
      setFitProfile({ ...fitProfile, fitConcerns: [...concerns, concern] });
    }
  };

  // Advanced AI Recommendation Engine (V2)
  const calculateRecommendation = () => {
    const { bust, waist, hips, fitPreference, shoppingIntent } = fitProfile;
    const b = Number(bust);
    const w = Number(waist);
    const h = Number(hips);

    if (!b || !w || !h) return { primarySize: null, secondarySize: null, confidence: 0, notes: [] };

    const factor = fitProfile.unit === 'in' ? 2.54 : 1;
    const b_cm = b * factor;
    const w_cm = w * factor;
    const h_cm = h * factor;

    const getDimSize = (val, thresholds) => {
      if (val <= thresholds.xs) return 0;
      if (val <= thresholds.s) return 1;
      if (val <= thresholds.m) return 2;
      if (val <= thresholds.l) return 3;
      if (val <= thresholds.xl) return 4;
      return 5; // XXL
    };

    const bustIdx = getDimSize(b_cm, { xs: 85, s: 91, m: 97, l: 105, xl: 113 });
    const waistIdx = getDimSize(w_cm, { xs: 66, s: 71, m: 77, l: 85, xl: 93 });
    const hipsIdx = getDimSize(h_cm, { xs: 91, s: 97, m: 103, l: 111, xl: 119 });

    let recommendedIdx = Math.max(bustIdx, waistIdx, hipsIdx);
    let notes = [];

    if (shoppingIntent === 'Top') {
      recommendedIdx = Math.max(bustIdx, waistIdx);
    } else if (shoppingIntent === 'Skirt') {
      recommendedIdx = Math.max(waistIdx, hipsIdx);
    }

    if (fitPreference === 'Relaxed' || fitPreference === 'Oversized') {
      recommendedIdx = Math.min(5, recommendedIdx + 1);
      notes.push(`Sized up for a ${fitPreference.toLowerCase()} fit.`);
    } else if (fitPreference === 'Snug') {
      notes.push("You prefer a snug fit. This size should hug your curves perfectly.");
    }

    const minIdx = Math.min(bustIdx, waistIdx, hipsIdx);
    const spread = Math.max(bustIdx, waistIdx, hipsIdx) - minIdx;
    
    if (spread >= 2) {
      if (bustIdx > hipsIdx) notes.push("You have a fuller bust relative to your hips; consider sizing up in tops or separating sets.");
      if (hipsIdx > bustIdx) notes.push("You have fuller hips relative to your bust; tailor notes may be required for a perfect fit on dresses.");
    }

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const primarySize = sizes[recommendedIdx];
    const secondarySize = recommendedIdx < 5 ? sizes[recommendedIdx + 1] : sizes[Math.max(0, recommendedIdx - 1)];

    let confidence = 95;
    if (spread === 0) confidence = 98; 
    else if (spread === 1) confidence = 89;
    else if (spread === 2) confidence = 78;
    else confidence = 65; 

    return { primarySize, secondarySize, confidence, notes };
  };

  const aiRec = calculateRecommendation();

  // Silhouette rendering removed per user request

  return (
    <main className="w-full min-h-screen bg-canvas text-[#1a1a1a] pt-12 px-6 pb-24">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-12">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="mb-8">
            <h1 className="text-2xl font-bold uppercase tracking-wider mb-1">My Account</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest">{currentUser?.email}</p>
          </div>
          
          <nav className="flex flex-col gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${
                  activeTab === tab.id ? 'bg-[#1a1a1a] text-white' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => navigate('/components/wishlist')}
              className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Wishlist
            </button>
            <button
              onClick={logout}
              className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-red-600 hover:bg-red-50 mt-4 transition-colors border border-red-100"
            >
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 bg-white p-8 border border-gray-200">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold uppercase tracking-wider mb-6">Profile Management</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black bg-transparent"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-gray-400">Email Address (Cannot be changed)</label>
                  <input
                    type="email"
                    disabled
                    className="w-full border-b border-gray-200 py-3 text-sm text-gray-400 bg-transparent"
                    value={currentUser?.email}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black bg-transparent"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
                <div className="flex gap-6">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Date of Birth</label>
                    <input
                      type="date"
                      className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black bg-transparent"
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Gender</label>
                    <select
                      className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black bg-transparent"
                      value={profileData.gender}
                      onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-[#1a1a1a] text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors disabled:opacity-50 mt-4"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* FIT PROFILE (AI) TAB */}
          {activeTab === 'fit-profile' && (
            <div className="animate-fade-in max-w-2xl mx-auto">
              <h2 className="text-xl font-bold uppercase tracking-wider mb-2 text-center">Fit Profile</h2>
              <p className="text-xs text-gray-500 mb-8 text-center max-w-lg mx-auto leading-relaxed">
                Let's get to know you. By completing this profile, we will recommend your perfect size and help you avoid returns.
              </p>

              {!showFitResults ? (
                <div className="bg-white border border-gray-200 p-8 shadow-sm">
                  {/* Progress Bar */}
                  <div className="flex justify-between mb-8 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-0 h-0.5 bg-black -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: `${((fitStep - 1) / 2) * 100}%` }}></div>
                    {[1, 2, 3].map(s => (
                      <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${fitStep >= s ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {s}
                      </div>
                    ))}
                  </div>

                  {fitStep === 1 && (
                    <div className="space-y-6 animate-fade-in">
                      <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Step 1: Basic Info</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Age</label>
                          <input type="number" className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black bg-transparent" value={fitProfile.age} onChange={e => setFitProfile({...fitProfile, age: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Unit Preference</label>
                          <div className="flex gap-4 mt-2">
                            <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="unit" checked={fitProfile.unit === 'cm'} onChange={() => setFitProfile({...fitProfile, unit: 'cm'})} /> cm/kg</label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="unit" checked={fitProfile.unit === 'in'} onChange={() => setFitProfile({...fitProfile, unit: 'in'})} /> inches/lbs</label>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => setFitStep(2)} className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest mt-6 hover:bg-gray-800 transition-colors">Continue to Measurements</button>
                    </div>
                  )}

                  {fitStep === 2 && (
                    <div className="space-y-6 animate-fade-in">
                      <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Step 2: Body Measurements ({fitProfile.unit})</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Height</label>
                          <input type="number" required className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black bg-transparent" value={fitProfile.height} onChange={e => setFitProfile({...fitProfile, height: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Weight</label>
                          <input type="number" required className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black bg-transparent" value={fitProfile.weight} onChange={e => setFitProfile({...fitProfile, weight: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Bust / Chest</label>
                          <p className="text-[9px] text-gray-400 mb-1">Fullest part of chest</p>
                          <input type="number" required className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black bg-transparent" value={fitProfile.bust} onChange={e => setFitProfile({...fitProfile, bust: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Under-bust</label>
                          <p className="text-[9px] text-gray-400 mb-1">Just below the chest</p>
                          <input type="number" className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black bg-transparent" value={fitProfile.underBust} onChange={e => setFitProfile({...fitProfile, underBust: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Waist</label>
                          <p className="text-[9px] text-gray-400 mb-1">Narrowest point</p>
                          <input type="number" required className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black bg-transparent" value={fitProfile.waist} onChange={e => setFitProfile({...fitProfile, waist: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Hips</label>
                          <p className="text-[9px] text-gray-400 mb-1">Fullest part</p>
                          <input type="number" required className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black bg-transparent" value={fitProfile.hips} onChange={e => setFitProfile({...fitProfile, hips: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Shoulder Width</label>
                          <p className="text-[9px] text-gray-400 mb-1">Across the back</p>
                          <input type="number" className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black bg-transparent" value={fitProfile.shoulder} onChange={e => setFitProfile({...fitProfile, shoulder: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Torso Length</label>
                          <p className="text-[9px] text-gray-400 mb-1">Shoulder to waist</p>
                          <input type="number" className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black bg-transparent" value={fitProfile.torso} onChange={e => setFitProfile({...fitProfile, torso: e.target.value})} />
                        </div>
                      </div>
                      <div className="flex gap-4 mt-6">
                        <button onClick={() => setFitStep(1)} className="w-1/3 border border-black text-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">Back</button>
                        <button onClick={() => setFitStep(3)} className="w-2/3 bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">Continue</button>
                      </div>
                    </div>
                  )}

                  {fitStep === 3 && (
                    <div className="space-y-6 animate-fade-in">
                      <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Step 3: Fit Preferences</h3>
                      
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3">How do you like your clothes to fit?</label>
                        <div className="flex flex-wrap gap-3">
                          {['Snug', 'Fitted', 'Relaxed', 'Oversized'].map(opt => (
                            <button key={opt} onClick={() => setFitProfile({...fitProfile, fitPreference: opt})} className={`px-4 py-2 border text-xs ${fitProfile.fitPreference === opt ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>{opt}</button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3">What's your body shape?</label>
                        <div className="flex flex-wrap gap-3">
                          {['Hourglass', 'Pear', 'Apple', 'Rectangle', 'Petite', 'Athletic'].map(opt => (
                            <button key={opt} onClick={() => setFitProfile({...fitProfile, bodyShape: opt})} className={`px-4 py-2 border text-xs ${fitProfile.bodyShape === opt ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>{opt}</button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Any fit concerns? (Select all that apply)</label>
                        <div className="flex flex-wrap gap-3">
                          {['Wide hips', 'Broad shoulders', 'Short torso', 'Long legs', 'Fuller bust'].map(opt => (
                            <button key={opt} onClick={() => toggleFitConcern(opt)} className={`px-4 py-2 border text-xs ${fitProfile.fitConcerns.includes(opt) ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>{opt}</button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4 mt-6">
                        <button onClick={() => setFitStep(2)} className="w-1/3 border border-black text-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">Back</button>
                        <button onClick={handleSaveMeasurements} disabled={isSavingMeasurements} className="w-2/3 bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50">
                          {isSavingMeasurements ? 'Analyzing...' : 'Analyze My Fit'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 shadow-sm animate-fade-in p-8">
                  <div className="max-w-md mx-auto">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Fit Analysis</h3>
                      <button onClick={() => {setShowFitResults(false); setFitStep(1);}} className="text-[10px] font-bold uppercase tracking-widest border-b border-gray-300 pb-0.5 hover:border-black transition-colors">Edit Profile</button>
                    </div>
                    
                    {aiRec.primarySize ? (
                      <div>
                        <div className="flex items-end gap-4 mb-2">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-green-700">Primary Match</p>
                            <p className="text-5xl font-bold tracking-tight mt-1">{aiRec.primarySize}</p>
                          </div>
                          <div className="pb-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Backup</p>
                            <p className="text-xl font-bold text-gray-600">{aiRec.secondarySize}</p>
                          </div>
                        </div>

                        <div className="mt-6">
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span>Confidence Score</span>
                            <span className="text-green-700">{aiRec.confidence}%</span>
                          </div>
                          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-green-600 h-full transition-all duration-1000 ease-out" style={{ width: `${aiRec.confidence}%` }}></div>
                          </div>
                        </div>

                        {aiRec.notes.length > 0 && (
                          <div className="mt-8 bg-[#f0fdf4] border border-[#bbf7d0] p-4 rounded-sm">
                            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-green-800 mb-2 flex items-center gap-2">
                              <span>✓</span> Tailor Notes & Insights
                            </p>
                            <ul className="space-y-2">
                              {aiRec.notes.map((note, i) => (
                                <li key={i} className="text-xs text-green-900 leading-relaxed">• {note}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 py-4">Insufficient data to generate recommendation.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold uppercase tracking-widest mb-8 border-b border-black inline-block pb-1">Order History</h2>
              
              {loadingOrders ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 border border-gray-100">
                  <p className="text-sm text-gray-500 mb-4">You haven't placed any orders yet.</p>
                  <button onClick={() => navigate('/')} className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-0.5">Start Shopping</button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="border border-gray-200 p-6">
                      <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider mb-1">Order #{order.id.slice(0,8)}</p>
                          <p className="text-[10px] text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">Ksh {Number(order.total).toLocaleString()}</p>
                          <span className={`inline-block mt-1 px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${order.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-4 items-center">
                            {item.image && <img src={item.image} alt={item.name} className="w-12 h-16 object-cover bg-gray-50" />}
                            <div className="flex-1">
                              <p className="text-xs font-bold uppercase">{item.name}</p>
                              <p className="text-[10px] text-gray-500">Qty: {item.quantity || 1} | Size: {item.size} | Color: {item.color}</p>
                            </div>
                            <p className="text-xs font-bold">Ksh {((item.salePrice || item.originalPrice || item.price || 0) * (item.quantity || 1)).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                      
                      {order.tracking && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                            Tracking: <a href={`${db.settings?.shipping?.trackingUrlBase || 'https://track.revolt.com/'}${order.tracking}`} target="_blank" rel="noreferrer" className="underline">{order.tracking}</a>
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADDRESS BOOK TAB */}
          {activeTab === 'addresses' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold uppercase tracking-wider">Address Book</h2>
                {!showAddressForm && (
                  <button 
                    onClick={() => {
                      setAddressData({ name: '', street: '', city: '', zip: '', country: '', phone: '', directions: '', pinLink: '' });
                      setEditingAddressIdx(null);
                      setShowAddressForm(true);
                    }}
                    className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-0.5"
                  >
                    Add New Address
                  </button>
                )}
              </div>
              
              {showAddressForm ? (
                <form onSubmit={handleSaveAddress} className="space-y-6 max-w-lg border border-gray-200 p-6 bg-gray-50">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4">{editingAddressIdx !== null ? 'Edit Address' : 'New Address'}</h3>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Address Name / Label</label>
                    <input type="text" required placeholder="e.g., Home, Office" className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black bg-transparent" value={addressData.name} onChange={e => setAddressData({...addressData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Street Address & Apartment</label>
                    <input type="text" required placeholder="e.g., 123 Main St, Apt 4B" className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black bg-transparent" value={addressData.street} onChange={e => setAddressData({...addressData, street: e.target.value})} />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">City</label>
                      <input type="text" required className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black bg-transparent" value={addressData.city} onChange={e => setAddressData({...addressData, city: e.target.value})} />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Postal Code / Zip</label>
                      <input type="text" required className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black bg-transparent" value={addressData.zip} onChange={e => setAddressData({...addressData, zip: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Country</label>
                    <input type="text" required className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black bg-transparent" value={addressData.country} onChange={e => setAddressData({...addressData, country: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Delivery Phone Number</label>
                    <input type="tel" required placeholder="e.g., +254..." className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black bg-transparent" value={addressData.phone} onChange={e => setAddressData({...addressData, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Delivery Directions (Optional)</label>
                    <textarea placeholder="Write specific directions on how to find your place, gate codes, etc." rows="2" className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black bg-transparent resize-none" value={addressData.directions} onChange={e => setAddressData({...addressData, directions: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Location Pin Link (Optional)</label>
                    <input type="url" placeholder="e.g., https://goo.gl/maps/..." className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black bg-transparent" value={addressData.pinLink} onChange={e => setAddressData({...addressData, pinLink: e.target.value})} />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="bg-[#1a1a1a] text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors">
                      Save Address
                    </button>
                    <button type="button" onClick={() => setShowAddressForm(false)} className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : currentUser?.addresses?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentUser.addresses.map((addr, idx) => (
                    <div key={idx} className="border border-gray-200 p-4 relative group">
                      <p className="font-semibold text-sm mb-1">{addr.name}</p>
                      <p className="text-sm text-gray-600">{addr.street}</p>
                      <p className="text-sm text-gray-600">{addr.city}, {addr.zip}</p>
                      <p className="text-sm text-gray-600 mb-2">{addr.country}</p>
                      
                      {(addr.phone || addr.directions || addr.pinLink) && (
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                          {addr.phone && <p className="text-xs text-gray-500"><span className="font-bold uppercase tracking-wider text-[9px] mr-2">Phone:</span>{addr.phone}</p>}
                          {addr.directions && <p className="text-xs text-gray-500"><span className="font-bold uppercase tracking-wider text-[9px] mr-2">Directions:</span>{addr.directions}</p>}
                          {addr.pinLink && (
                            <a href={addr.pinLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                              📍 View Location Pin
                            </a>
                          )}
                        </div>
                      )}

                      <div className="mt-5 flex gap-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        <button onClick={() => handleEditAddress(idx)} className="hover:text-black">Edit</button>
                        <button onClick={() => handleDeleteAddress(idx)} className="hover:text-red-600">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 border border-gray-100">
                  <p className="text-sm text-gray-500">You have no saved addresses.</p>
                </div>
              )}
            </div>
          )}

          {/* SUPPORT TICKETS TAB */}
          {activeTab === 'tickets' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold uppercase tracking-wider">{selectedTicket ? 'Ticket Details' : 'Support Tickets'}</h2>
                {selectedTicket && (
                  <button onClick={() => setSelectedTicket(null)} className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-0.5">
                    &larr; Back to List
                  </button>
                )}
              </div>
              
              {loadingTickets ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Loading tickets...</p>
                </div>
              ) : selectedTicket ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Ticket {selectedTicket.id}</p>
                        <h3 className="text-lg font-bold">{selectedTicket.subject}</h3>
                      </div>
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        selectedTicket.status === 'open' ? 'bg-blue-100 text-blue-800' :
                        selectedTicket.status === 'answered' ? 'bg-yellow-100 text-yellow-800' :
                        selectedTicket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {selectedTicket.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="bg-white p-4 border border-gray-100">
                      <p className="text-xs font-bold uppercase tracking-wider mb-2">Original Message <span className="text-[9px] text-gray-400 font-normal normal-case ml-2">{new Date(selectedTicket.date).toLocaleString()}</span></p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedTicket.message}</p>
                    </div>
                    
                    <div className="mt-4 space-y-4">
                      {selectedTicket.replies?.map((reply, idx) => (
                        <div key={idx} className={`p-4 border ${reply.from === 'client' ? 'bg-white border-gray-200 ml-12' : 'bg-blue-50 border-blue-100 mr-12'}`}>
                          <p className="text-xs font-bold uppercase tracking-wider mb-2">
                            {reply.senderName} <span className="text-[9px] text-gray-400 font-normal normal-case ml-2">{new Date(reply.date).toLocaleString()}</span>
                          </p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{reply.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {selectedTicket.status !== 'resolved' && selectedTicket.status !== 'archived' && (
                    <form onSubmit={handleReplySubmit} className="mt-6 border border-gray-200 p-6">
                      <label className="block text-[10px] font-bold uppercase tracking-widest mb-3">Add a Reply</label>
                      <textarea 
                        required 
                        rows="3" 
                        value={replyText} 
                        onChange={(e) => setReplyText(e.target.value)} 
                        className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black resize-y mb-4"
                        placeholder="Type your reply here..."
                      ></textarea>
                      <button type="submit" className="bg-[#1a1a1a] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors">
                        Send Reply
                      </button>
                    </form>
                  )}
                  {(selectedTicket.status === 'resolved' || selectedTicket.status === 'archived') && (
                    <div className="text-center p-4 bg-gray-50 border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-500">
                      This ticket is closed and cannot be replied to.
                    </div>
                  )}
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 border border-gray-100">
                  <p className="text-sm text-gray-500 mb-4">You have no support tickets.</p>
                  <button onClick={() => navigate('/help/contact')} className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-0.5">Contact Support</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map(ticket => (
                    <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="border border-gray-200 p-5 hover:border-black cursor-pointer transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-sm group-hover:text-blue-600 transition-colors">{ticket.subject}</h3>
                        <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${
                          ticket.status === 'open' ? 'bg-blue-100 text-blue-800' :
                          ticket.status === 'answered' ? 'bg-yellow-100 text-yellow-800' :
                          ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2 truncate max-w-lg">{ticket.message}</p>
                      <div className="flex justify-between items-center text-[10px] text-gray-400">
                        <span>{ticket.id} &bull; {new Date(ticket.date).toLocaleDateString()}</span>
                        {ticket.replies?.length > 0 && <span>{ticket.replies.length} replies</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold uppercase tracking-wider mb-6">Security Settings</h2>
              <form className="space-y-6 max-w-sm mb-12">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Current Password</label>
                  <input type="password" required className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black bg-transparent" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">New Password</label>
                  <input type="password" required className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black bg-transparent" />
                </div>
                <button type="submit" className="bg-[#1a1a1a] text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors">
                  Update Password
                </button>
              </form>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-red-600 mb-2">Danger Zone</h3>
                <p className="text-xs text-gray-500 mb-4 max-w-sm">Once you delete your account, there is no going back. Please be certain.</p>
                <button className="text-[10px] font-bold uppercase tracking-widest text-red-600 border border-red-200 px-4 py-2 hover:bg-red-50 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
