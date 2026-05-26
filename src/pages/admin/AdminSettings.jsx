import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';

export default function AdminSettings() {
  const { draftDb, updateDraft, publishChanges, discardChanges, isLoading } = useCms();
  const [activeTab, setActiveTab] = useState('general');

  const settings = draftDb.settings || {
    shipping: { zones: [], fees: [], pickupLocations: [] },
    payments: { gateways: [], currency: 'KES', taxMode: 'exclusive' },
    localization: { language: 'en', timeFormat: '24h' },
    legal: { cookieBannerEnabled: true, privacyPolicy: '', terms: '', refund: '' },
    maintenance: { active: false, message: 'We are currently upgrading our store. Check back soon!' },
    developer: { webhookUrls: [] }
  };

  const updateSetting = (category, field, value) => {
    updateDraft((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [category]: {
          ...(prev.settings?.[category] || {}),
          [field]: value
        }
      }
    }));
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
                      value={settings.localization.language} 
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
                      value={settings.localization.timeFormat} 
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
                <div className="grid grid-cols-1 gap-4">
                  <input type="email" placeholder="Support Email (e.g., support@revolt.com)" className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm outline-none" />
                  <input type="tel" placeholder="Support Phone (+254...)" className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm outline-none" />
                  <textarea rows="3" placeholder="Physical Address or Headquarters" className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm outline-none"></textarea>
                  <input type="text" placeholder="Google Maps Embed Link" className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm outline-none" />
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
                <div className="border border-[#000000]/10 p-4 bg-[#f9f9f9] flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm">Nairobi Metro</h3>
                    <p className="text-xs text-[#000000]/50">Flat rate: Ksh 500</p>
                  </div>
                  <button className="text-[10px] font-bold uppercase underline">Edit</button>
                </div>
                <button className="mt-4 text-[10px] font-bold uppercase bg-[#000000] text-white px-4 py-2 hover:bg-[#000000]/80">+ Add Zone</button>
              </section>

              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Pickup Locations</h2>
                <p className="text-xs text-[#000000]/60 mb-4">Manage store or warehouse locations available for local pickup.</p>
                <div className="border border-[#000000]/10 p-4 bg-[#f9f9f9] flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm">Revolt Flagship Store (CBD)</h3>
                    <p className="text-xs text-[#000000]/50">Mon-Sat, 9AM-6PM</p>
                  </div>
                  <button className="text-[10px] font-bold uppercase underline">Edit</button>
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
                      <input type="checkbox" defaultChecked={['M-Pesa Express', 'Cash on Delivery'].includes(gw)} className="w-5 h-5 accent-[#000000]" />
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
                      value={settings.payments.currency} 
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
                      value={settings.payments.taxMode} 
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
                <div className="overflow-x-auto border border-[#000000]/10">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-[#f9f9f9] border-b border-[#000000]/10 text-[10px] font-bold uppercase tracking-[0.1em] text-[#000000]/60">
                      <tr>
                        <th className="px-4 py-3">Username</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#000000]/10">
                      <tr>
                        <td className="px-4 py-3 font-medium">admin</td>
                        <td className="px-4 py-3">Super Admin</td>
                        <td className="px-4 py-3 text-green-600 font-bold text-[10px] uppercase">Active</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">editor</td>
                        <td className="px-4 py-3">Editor</td>
                        <td className="px-4 py-3 text-green-600 font-bold text-[10px] uppercase">Active</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">fulfillment</td>
                        <td className="px-4 py-3">Fulfillment</td>
                        <td className="px-4 py-3 text-green-600 font-bold text-[10px] uppercase">Active</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">support</td>
                        <td className="px-4 py-3">Support</td>
                        <td className="px-4 py-3 text-green-600 font-bold text-[10px] uppercase">Active</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">marketing</td>
                        <td className="px-4 py-3">Marketing</td>
                        <td className="px-4 py-3 text-green-600 font-bold text-[10px] uppercase">Active</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
              
              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Security Rules</h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 accent-[#000000]" />
                    <span className="font-bold text-sm">Force Two-Factor Authentication (2FA) for all Admins</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#000000]" />
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
                    checked={settings.legal.cookieBannerEnabled} 
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
                  value={settings.legal.privacyPolicy}
                  onChange={e => updateSetting('legal', 'privacyPolicy', e.target.value)}
                  placeholder="Enter Privacy Policy text here..." 
                  className="w-full bg-[#f9f9f9] border border-[#000000]/20 p-4 text-sm outline-none"
                ></textarea>
              </section>

              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Terms & Conditions</h2>
                <textarea 
                  rows="6" 
                  value={settings.legal.terms}
                  onChange={e => updateSetting('legal', 'terms', e.target.value)}
                  placeholder="Enter Terms & Conditions text here..." 
                  className="w-full bg-[#f9f9f9] border border-[#000000]/20 p-4 text-sm outline-none"
                ></textarea>
              </section>
              
              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Refund Policy</h2>
                <textarea 
                  rows="6" 
                  value={settings.legal.refund}
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
                    checked={settings.maintenance.active} 
                    onChange={e => updateSetting('maintenance', 'active', e.target.checked)} 
                    className="w-5 h-5 accent-[#000000]" 
                  />
                  <span className="font-bold text-sm text-red-600">Activate Maintenance Mode Overlay</span>
                </label>
                {settings.maintenance.active && (
                  <input 
                    type="text" 
                    value={settings.maintenance.message}
                    onChange={e => updateSetting('maintenance', 'message', e.target.value)}
                    placeholder="Maintenance message..." 
                    className="w-full bg-white border border-red-500 px-4 py-3 text-sm outline-none" 
                  />
                )}
              </section>

              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Webhooks</h2>
                <div className="flex gap-2">
                  <input type="url" placeholder="https://your-server.com/webhook" className="flex-1 bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm outline-none" />
                  <button className="bg-[#000000] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider">Add</button>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Data Management</h2>
                <div className="flex gap-4">
                  <button className="flex-1 bg-[#f5f5f5] text-[#000000] border border-[#000000]/20 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#e0e0e0] transition-colors">
                    Export Full Backup (JSON)
                  </button>
                  <button className="flex-1 bg-red-50 text-red-600 border border-red-200 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-100 transition-colors">
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
