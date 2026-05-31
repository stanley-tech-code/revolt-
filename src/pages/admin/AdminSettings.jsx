import React, { useState, useEffect, useRef } from 'react';
import { useCms } from '../../context/CmsContext';

export default function AdminSettings() {
  const { draftDb, updateDraft, publishChanges, discardChanges, isLoading, backupDatabase, restoreDatabase, factoryResetDatabase } = useCms();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('general');

  // Initialize settings if they don't exist
  const defaultSettings = {
    shipping: { zones: [], fees: [], pickupLocations: [] },
    payments: { gateways: ['M-Pesa Express', 'Cash on Delivery'], currency: 'KES', taxMode: 'exclusive' },
    localization: { language: 'en', timeFormat: '24h' },
    legal: { cookieBannerEnabled: true, privacyPolicy: '', terms: '', refund: '' },
    maintenance: { active: false, message: 'We are currently upgrading our store. Check back soon!' },
    developer: { webhookUrls: [] },
    adminUsers: [
      { username: 'admin', role: 'Super Admin', pass: 'admin' },
      { username: 'editor', role: 'Editor', pass: 'editor' },
      { username: 'fulfillment', role: 'Fulfillment', pass: 'fulfillment' },
      { username: 'support', role: 'Support', pass: 'support' },
      { username: 'marketing', role: 'Marketing', pass: 'marketing' }
    ]
  };

  const settings = {
    ...defaultSettings,
    ...(draftDb.settings || {})
  };

  // Local state for forms
  const [newZone, setNewZone] = useState({ name: '', fee: '' });
  const [newPickup, setNewPickup] = useState({ name: '', hours: '' });
  const [newWebhook, setNewWebhook] = useState('');
  const [newAdmin, setNewAdmin] = useState({ username: '', role: 'Editor', pass: '' });
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const updateSetting = (category, field, value) => {
    updateDraft((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...(prev.settings || defaultSettings),
        [category]: {
          ...(prev.settings?.[category] || defaultSettings[category]),
          [field]: value
        }
      }
    }));
  };

  // Generic array update
  const addToArray = (category, field, item) => {
    const currentArray = settings[category]?.[field] || [];
    updateSetting(category, field, [...currentArray, item]);
  };

  const removeFromArray = (category, field, index) => {
    const currentArray = [...(settings[category]?.[field] || [])];
    currentArray.splice(index, 1);
    updateSetting(category, field, currentArray);
  };

  // Admin users array update (top-level setting field)
  const addAdmin = () => {
    if (!newAdmin.username || !newAdmin.pass) return;
    const currentAdmins = settings.adminUsers || defaultSettings.adminUsers;
    updateDraft((prev) => ({
      ...prev,
      settings: {
        ...(prev.settings || defaultSettings),
        adminUsers: [...currentAdmins, { ...newAdmin }]
      }
    }));
    setNewAdmin({ username: '', role: 'Editor', pass: '' });
  };

  const removeAdmin = (index) => {
    const currentAdmins = [...(settings.adminUsers || defaultSettings.adminUsers)];
    currentAdmins.splice(index, 1);
    updateDraft((prev) => ({
      ...prev,
      settings: {
        ...(prev.settings || defaultSettings),
        adminUsers: currentAdmins
      }
    }));
  };

  const toggleGateway = (gateway) => {
    const currentGateways = settings.payments.gateways || [];
    if (currentGateways.includes(gateway)) {
      updateSetting('payments', 'gateways', currentGateways.filter(g => g !== gateway));
    } else {
      updateSetting('payments', 'gateways', [...currentGateways, gateway]);
    }
  };

  const handlePublish = async () => {
    if (window.confirm("Publishing will push all configuration changes live. Continue?")) {
      await publishChanges();
    }
  };

  const renderTabs = () => {
    const tabs = [
      { id: 'general', label: 'General & Localization' },
      { id: 'shipping', label: 'Shipping & Delivery' },
      { id: 'payments', label: 'Taxes & Payments' },
      { id: 'security', label: 'Users & Security' },
      { id: 'legal', label: 'Legal & Compliance' },
      { id: 'advanced', label: 'Advanced & Developer' }
    ];

    return (
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-1 pr-6 border-r border-[#000000]/10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === tab.id ? 'bg-[#000000] text-white' : 'text-[#000000]/60 hover:bg-[#000000]/5 hover:text-[#000000]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#000000]">Store Settings</h1>
          <p className="text-sm text-[#000000]/60 mt-2">Manage shipping, payments, legal compliance, and system preferences.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={discardChanges} disabled={isLoading} className="bg-[#f5f5f5] text-[#000000] border border-[#000000]/20 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#e0e0e0] transition-colors">
            Discard
          </button>
          <button onClick={handlePublish} disabled={isLoading} className="bg-[#000000] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#000000]/80 transition-colors">
            {isLoading ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 border border-[#000000]/10 flex flex-col md:flex-row min-h-[600px]">
        {renderTabs()}

        <div className="flex-1 md:pl-8 pt-6 md:pt-0 max-w-4xl space-y-10">
          
          {/* GENERAL & LOCALIZATION */}
          {activeTab === 'general' && (
            <div className="space-y-8 animate-fade-in">
              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Localization Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Default Store Language</label>
                    <select 
                      value={settings.localization?.language || 'en'} 
                      onChange={e => updateSetting('localization', 'language', e.target.value)} 
                      className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm outline-none"
                    >
                      <option value="en">English (US)</option>
                      <option value="en-gb">English (UK)</option>
                      <option value="sw">Swahili</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Time Format</label>
                    <select 
                      value={settings.localization?.timeFormat || '24h'} 
                      onChange={e => updateSetting('localization', 'timeFormat', e.target.value)} 
                      className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm outline-none"
                    >
                      <option value="12h">12-hour (AM/PM)</option>
                      <option value="24h">24-hour</option>
                    </select>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Contact Information</h2>
                <p className="text-xs text-[#000000]/60 mb-4">This information appears in your footer, receipts, and contact page.</p>
                
                <div className="space-y-6">
                  {/* EMAILS */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Support Emails</label>
                    <div className="space-y-2 mb-2">
                      {(settings.localization?.supportEmails || (settings.localization?.supportEmail ? [settings.localization.supportEmail] : [])).map((email, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-[#f9f9f9] border border-[#000000]/10 px-4 py-2 text-sm">
                          <span>{email}</span>
                          <button onClick={() => {
                            const arr = [...(settings.localization?.supportEmails || (settings.localization?.supportEmail ? [settings.localization.supportEmail] : []))];
                            arr.splice(idx, 1);
                            updateSetting('localization', 'supportEmails', arr);
                            // Clear legacy field to prevent it from reappearing
                            if (settings.localization?.supportEmail) updateSetting('localization', 'supportEmail', '');
                          }} className="text-[10px] font-bold uppercase text-red-500 hover:underline">Remove</button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Add new email..." className="flex-1 bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm outline-none" />
                      <button onClick={() => {
                        if (newEmail) {
                          const arr = [...(settings.localization?.supportEmails || (settings.localization?.supportEmail ? [settings.localization.supportEmail] : []))];
                          updateSetting('localization', 'supportEmails', [...arr, newEmail]);
                          setNewEmail('');
                          if (settings.localization?.supportEmail) updateSetting('localization', 'supportEmail', '');
                        }
                      }} className="bg-[#000000] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-[#000000]/80">Add</button>
                    </div>
                  </div>

                  {/* PHONES */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Support Phone Numbers</label>
                    <div className="space-y-2 mb-2">
                      {(settings.localization?.supportPhones || (settings.localization?.supportPhone ? [settings.localization.supportPhone] : [])).map((phone, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-[#f9f9f9] border border-[#000000]/10 px-4 py-2 text-sm">
                          <span>{phone}</span>
                          <button onClick={() => {
                            const arr = [...(settings.localization?.supportPhones || (settings.localization?.supportPhone ? [settings.localization.supportPhone] : []))];
                            arr.splice(idx, 1);
                            updateSetting('localization', 'supportPhones', arr);
                            if (settings.localization?.supportPhone) updateSetting('localization', 'supportPhone', '');
                          }} className="text-[10px] font-bold uppercase text-red-500 hover:underline">Remove</button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="Add new phone number..." className="flex-1 bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm outline-none" />
                      <button onClick={() => {
                        if (newPhone) {
                          const arr = [...(settings.localization?.supportPhones || (settings.localization?.supportPhone ? [settings.localization.supportPhone] : []))];
                          updateSetting('localization', 'supportPhones', [...arr, newPhone]);
                          setNewPhone('');
                          if (settings.localization?.supportPhone) updateSetting('localization', 'supportPhone', '');
                        }
                      }} className="bg-[#000000] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-[#000000]/80">Add</button>
                    </div>
                  </div>

                  {/* ADDRESS & MAP */}
                  <div className="grid grid-cols-1 gap-4 pt-4 border-t border-[#000000]/10">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Physical Address</label>
                      <textarea rows="3" value={settings.localization?.address || ''} onChange={e => updateSetting('localization', 'address', e.target.value)} placeholder="Physical Address or Headquarters" className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm outline-none"></textarea>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Google Maps Embed Link (Src URL)</label>
                      <input type="text" value={settings.localization?.mapsLink || ''} onChange={e => updateSetting('localization', 'mapsLink', e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm outline-none" />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* SHIPPING & DELIVERY */}
          {activeTab === 'shipping' && (
            <div className="space-y-8 animate-fade-in">
              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Delivery Zones</h2>
                <p className="text-xs text-[#000000]/60 mb-4">Define regions where you deliver, and set flat-rate fees.</p>
                <div className="space-y-2 mb-4">
                  {(settings.shipping?.zones || []).map((zone, idx) => (
                    <div key={idx} className="border border-[#000000]/10 p-4 bg-[#f9f9f9] flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-sm">{zone.name}</h3>
                        <p className="text-xs text-[#000000]/50">Flat rate: {settings.payments?.currency || 'KES'} {zone.fee}</p>
                      </div>
                      <button onClick={() => removeFromArray('shipping', 'zones', idx)} className="text-[10px] font-bold uppercase text-red-500 hover:underline">Remove</button>
                    </div>
                  ))}
                  {(!settings.shipping?.zones || settings.shipping.zones.length === 0) && (
                    <p className="text-sm italic text-gray-400">No delivery zones added yet.</p>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  <input type="text" placeholder="Zone Name (e.g. Nairobi Metro)" value={newZone.name} onChange={e => setNewZone({...newZone, name: e.target.value})} className="flex-1 bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm outline-none" />
                  <input type="number" placeholder="Fee" value={newZone.fee} onChange={e => setNewZone({...newZone, fee: e.target.value})} className="w-32 bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm outline-none" />
                  <button onClick={() => { if(newZone.name) { addToArray('shipping', 'zones', newZone); setNewZone({name: '', fee: ''}); } }} className="text-[10px] font-bold uppercase bg-[#000000] text-white px-4 py-2 hover:bg-[#000000]/80">+ Add Zone</button>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Pickup Locations</h2>
                <p className="text-xs text-[#000000]/60 mb-4">Manage store or warehouse locations available for local pickup.</p>
                <div className="space-y-2 mb-4">
                  {(settings.shipping?.pickupLocations || []).map((loc, idx) => (
                    <div key={idx} className="border border-[#000000]/10 p-4 bg-[#f9f9f9] flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-sm">{loc.name}</h3>
                        <p className="text-xs text-[#000000]/50">{loc.hours}</p>
                      </div>
                      <button onClick={() => removeFromArray('shipping', 'pickupLocations', idx)} className="text-[10px] font-bold uppercase text-red-500 hover:underline">Remove</button>
                    </div>
                  ))}
                  {(!settings.shipping?.pickupLocations || settings.shipping.pickupLocations.length === 0) && (
                    <p className="text-sm italic text-gray-400">No pickup locations added yet.</p>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  <input type="text" placeholder="Location Name" value={newPickup.name} onChange={e => setNewPickup({...newPickup, name: e.target.value})} className="flex-1 bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm outline-none" />
                  <input type="text" placeholder="Operating Hours" value={newPickup.hours} onChange={e => setNewPickup({...newPickup, hours: e.target.value})} className="flex-1 bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm outline-none" />
                  <button onClick={() => { if(newPickup.name) { addToArray('shipping', 'pickupLocations', newPickup); setNewPickup({name: '', hours: ''}); } }} className="text-[10px] font-bold uppercase bg-[#000000] text-white px-4 py-2 hover:bg-[#000000]/80">+ Add Location</button>
                </div>
              </section>
            </div>
          )}

          {/* TAXES & PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-8 animate-fade-in">
              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Payment Gateways</h2>
                <p className="text-xs text-[#000000]/60 mb-4">Enable or disable payment methods displayed at checkout.</p>
                <div className="space-y-3">
                  {['M-Pesa Express', 'Stripe (Card Payments)', 'PayPal', 'Flutterwave', 'Cash on Delivery'].map((gw) => (
                    <label key={gw} className="flex items-center gap-3 cursor-pointer p-3 border border-[#000000]/10 bg-[#f9f9f9] hover:bg-white transition-colors">
                      <input 
                        type="checkbox" 
                        checked={(settings.payments?.gateways || []).includes(gw)} 
                        onChange={() => toggleGateway(gw)}
                        className="w-5 h-5 accent-[#000000]" 
                      />
                      <span className="font-bold text-sm">{gw}</span>
                    </label>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Tax Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Base Currency</label>
                    <select 
                      value={settings.payments?.currency || 'KES'} 
                      onChange={e => updateSetting('payments', 'currency', e.target.value)} 
                      className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm outline-none"
                    >
                      <option value="KES">KES - Kenyan Shilling</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Tax Mode</label>
                    <select 
                      value={settings.payments?.taxMode || 'exclusive'} 
                      onChange={e => updateSetting('payments', 'taxMode', e.target.value)} 
                      className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm outline-none"
                    >
                      <option value="inclusive">Prices include tax</option>
                      <option value="exclusive">Add tax at checkout</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* USERS & SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-8 animate-fade-in">
              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Admin Accounts</h2>
                <div className="overflow-x-auto border border-[#000000]/10 mb-4">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-[#f9f9f9] border-b border-[#000000]/10 text-[10px] font-bold uppercase tracking-[0.1em] text-[#000000]/60">
                      <tr>
                        <th className="px-4 py-3">Username</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#000000]/10">
                      {(settings.adminUsers || []).map((admin, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-medium">{admin.username}</td>
                          <td className="px-4 py-3">
                            <span className="bg-[#000000]/5 px-2 py-1 rounded text-xs">{admin.role}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {admin.username !== 'admin' && (
                              <button onClick={() => removeAdmin(idx)} className="text-red-500 font-bold text-[10px] uppercase hover:underline">Revoke</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <h3 className="font-bold text-sm mb-2">Add New Administrator</h3>
                <div className="flex gap-2 items-center">
                  <input type="text" placeholder="Username" value={newAdmin.username} onChange={e => setNewAdmin({...newAdmin, username: e.target.value})} className="flex-1 bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm outline-none" />
                  <input type="password" placeholder="Password" value={newAdmin.pass} onChange={e => setNewAdmin({...newAdmin, pass: e.target.value})} className="flex-1 bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm outline-none" />
                  <select value={newAdmin.role} onChange={e => setNewAdmin({...newAdmin, role: e.target.value})} className="bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm outline-none">
                    <option value="Super Admin">Super Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Support">Support</option>
                    <option value="Fulfillment">Fulfillment</option>
                  </select>
                  <button onClick={addAdmin} className="text-[10px] font-bold uppercase bg-[#000000] text-white px-4 py-2 hover:bg-[#000000]/80">Add</button>
                </div>
              </section>
              
              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Security Rules</h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.security?.force2FA || false} 
                      onChange={e => updateSetting('security', 'force2FA', e.target.checked)}
                      className="w-5 h-5 accent-[#000000]" 
                    />
                    <span className="font-bold text-sm">Force Two-Factor Authentication (2FA) for all Admins</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.security?.restrictIPs || true} 
                      onChange={e => updateSetting('security', 'restrictIPs', e.target.checked)}
                      className="w-5 h-5 accent-[#000000]" 
                    />
                    <span className="font-bold text-sm">Restrict Admin Logins to Trusted IPs</span>
                  </label>
                </div>
              </section>
            </div>
          )}

          {/* LEGAL & COMPLIANCE */}
          {activeTab === 'legal' && (
            <div className="space-y-8 animate-fade-in">
              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Cookie Consent</h2>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.legal?.cookieBannerEnabled ?? true} 
                    onChange={e => updateSetting('legal', 'cookieBannerEnabled', e.target.checked)} 
                    className="w-5 h-5 accent-[#000000]" 
                  />
                  <span className="font-bold text-sm">Enable Cookie Banner on Storefront</span>
                </label>
              </section>

              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Privacy Policy</h2>
                <textarea 
                  rows="6" 
                  value={settings.legal?.privacyPolicy || ''}
                  onChange={e => updateSetting('legal', 'privacyPolicy', e.target.value)}
                  placeholder="Enter Privacy Policy text here..." 
                  className="w-full bg-[#f9f9f9] border border-[#000000]/20 p-4 text-sm outline-none"
                ></textarea>
              </section>

              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Terms & Conditions</h2>
                <textarea 
                  rows="6" 
                  value={settings.legal?.terms || ''}
                  onChange={e => updateSetting('legal', 'terms', e.target.value)}
                  placeholder="Enter Terms & Conditions text here..." 
                  className="w-full bg-[#f9f9f9] border border-[#000000]/20 p-4 text-sm outline-none"
                ></textarea>
              </section>
              
              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Refund Policy</h2>
                <textarea 
                  rows="6" 
                  value={settings.legal?.refund || ''}
                  onChange={e => updateSetting('legal', 'refund', e.target.value)}
                  placeholder="Enter Refund Policy text here..." 
                  className="w-full bg-[#f9f9f9] border border-[#000000]/20 p-4 text-sm outline-none"
                ></textarea>
              </section>
            </div>
          )}

          {/* ADVANCED & DEVELOPER */}
          {activeTab === 'advanced' && (
            <div className="space-y-8 animate-fade-in">
              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Maintenance Mode</h2>
                <p className="text-xs text-[#000000]/60 mb-4">Temporarily lock the storefront. Admins can still access the dashboard.</p>
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input 
                    type="checkbox" 
                    checked={settings.maintenance?.active || false} 
                    onChange={e => updateSetting('maintenance', 'active', e.target.checked)} 
                    className="w-5 h-5 accent-[#000000]" 
                  />
                  <span className="font-bold text-sm text-red-600">Activate Maintenance Mode Overlay</span>
                </label>
                {settings.maintenance?.active && (
                  <input 
                    type="text" 
                    value={settings.maintenance?.message || ''}
                    onChange={e => updateSetting('maintenance', 'message', e.target.value)}
                    placeholder="Maintenance message..." 
                    className="w-full bg-white border border-red-500 px-4 py-3 text-sm outline-none" 
                  />
                )}
              </section>

              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Webhooks</h2>
                <div className="space-y-2 mb-4">
                  {(settings.developer?.webhookUrls || []).map((url, idx) => (
                    <div key={idx} className="border border-[#000000]/10 p-3 bg-[#f9f9f9] flex justify-between items-center text-sm">
                      <span className="font-mono text-xs">{url}</span>
                      <button onClick={() => removeFromArray('developer', 'webhookUrls', idx)} className="text-[10px] font-bold uppercase text-red-500 hover:underline">Remove</button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="url" value={newWebhook} onChange={e => setNewWebhook(e.target.value)} placeholder="https://your-server.com/webhook" className="flex-1 bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm outline-none" />
                  <button onClick={() => { if(newWebhook) { addToArray('developer', 'webhookUrls', newWebhook); setNewWebhook(''); } }} className="bg-[#000000] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-[#000000]/80">Add</button>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Data Management</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={backupDatabase} className="flex-1 bg-[#f5f5f5] text-[#000000] border border-[#000000]/20 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#e0e0e0] transition-colors">
                    Export Full Backup (JSON)
                  </button>
                  <input 
                    type="file" 
                    accept=".json" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = async (ev) => {
                          await restoreDatabase(ev.target.result);
                        };
                        reader.readAsText(file);
                      }
                      e.target.value = ''; // Reset input
                    }} 
                  />
                  <button onClick={() => fileInputRef.current.click()} className="flex-1 bg-[#f5f5f5] text-[#000000] border border-[#000000]/20 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#e0e0e0] transition-colors">
                    Import Backup (JSON)
                  </button>
                  <button onClick={async () => {
                    if (window.confirm("Are you sure you want to perform a factory reset? This will WIPE ALL DATA from the database forever!")) {
                      await factoryResetDatabase();
                    }
                  }} className="flex-1 bg-red-50 text-red-600 border border-red-200 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-100 transition-colors">
                    Factory Reset Database
                  </button>
                </div>
              </section>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
