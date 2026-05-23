import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const { currentUser, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    dateOfBirth: currentUser?.dateOfBirth || '',
    gender: currentUser?.gender || ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    await updateProfile(profileData);
    setIsUpdating(false);
    alert("Profile updated successfully!");
  };

  const tabs = [
    { id: 'profile', label: 'Profile Management' },
    { id: 'addresses', label: 'Address Book' },
    { id: 'orders', label: 'Order History' },
    { id: 'security', label: 'Security Settings' }
  ];

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

          {/* ADDRESS BOOK TAB */}
          {activeTab === 'addresses' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold uppercase tracking-wider">Address Book</h2>
                <button className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-0.5">Add New Address</button>
              </div>
              {currentUser?.addresses?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentUser.addresses.map((addr, idx) => (
                    <div key={idx} className="border border-gray-200 p-4 relative group">
                      <p className="font-semibold text-sm mb-1">{addr.name}</p>
                      <p className="text-sm text-gray-600">{addr.street}</p>
                      <p className="text-sm text-gray-600">{addr.city}, {addr.zip}</p>
                      <p className="text-sm text-gray-600">{addr.country}</p>
                      <div className="mt-4 flex gap-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        <button className="hover:text-black">Edit</button>
                        <button className="hover:text-red-600">Delete</button>
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

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold uppercase tracking-wider mb-6">Order History</h2>
              <div className="text-center py-12 bg-gray-50 border border-gray-100">
                <p className="text-sm text-gray-500">You have not placed any orders yet.</p>
                <button className="mt-4 text-[10px] font-bold uppercase tracking-widest border-b border-black pb-0.5" onClick={() => navigate('/')}>
                  Start Shopping
                </button>
              </div>
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
