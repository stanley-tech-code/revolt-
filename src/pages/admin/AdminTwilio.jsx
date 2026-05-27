import React from 'react';
import { useCms } from '../../context/CmsContext';

export default function AdminTwilio() {
  const { draftDb, updateDraft, publishChanges, discardChanges, isLoading } = useCms();
  const twilioSettings = draftDb.twilio_settings || { sid: '', authToken: '', senderPhone: '', messagingServiceSid: '', testMode: true };

  const handlePublish = async () => {
    await publishChanges('twilio_settings', draftDb.twilio_settings);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#000000]">Twilio Integration</h1>
          <p className="text-sm text-[#000000]/60 mt-2">Manage your Twilio API keys and sender configurations.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={discardChanges} disabled={isLoading} className="bg-[#f5f5f5] text-[#000000] border border-[#000000]/20 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#e0e0e0] transition-colors">
            Discard
          </button>
          <button onClick={handlePublish} disabled={isLoading} className="bg-[#000000] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#000000]/80 transition-colors">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 md:p-10 border border-[#000000]/10 space-y-8">
        <section>
          <h2 className="text-lg font-bold uppercase tracking-wider border-b border-[#000000]/10 pb-2 mb-4">API Configuration</h2>
          <p className="text-xs text-[#000000]/60 mb-6">Link your Twilio Account SID, Auth Token, and Sender Phone numbers. Webhooks for inbound replies and status updates should be pointed to <code>{window.location.origin}/api/twilio/webhook</code>.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#f9f9f9] p-6 border border-[#000000]/10">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Account SID</label>
              <input 
                type="text" 
                value={twilioSettings.sid} 
                onChange={e => updateDraft(prev => ({ ...prev, twilio_settings: { ...prev.twilio_settings, sid: e.target.value } }))} 
                placeholder="AC..." 
                className="w-full bg-white border border-[#000000]/20 px-4 py-3 text-sm outline-none font-mono" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Auth Token</label>
              <input 
                type="password" 
                value={twilioSettings.authToken} 
                onChange={e => updateDraft(prev => ({ ...prev, twilio_settings: { ...prev.twilio_settings, authToken: e.target.value } }))} 
                placeholder="••••••••••••••••" 
                className="w-full bg-white border border-[#000000]/20 px-4 py-3 text-sm outline-none font-mono" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Default Sender Phone</label>
              <input 
                type="text" 
                value={twilioSettings.senderPhone} 
                onChange={e => updateDraft(prev => ({ ...prev, twilio_settings: { ...prev.twilio_settings, senderPhone: e.target.value } }))} 
                placeholder="+1234567890" 
                className="w-full bg-white border border-[#000000]/20 px-4 py-3 text-sm outline-none" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Messaging Service SID (Optional)</label>
              <input 
                type="text" 
                value={twilioSettings.messagingServiceSid} 
                onChange={e => updateDraft(prev => ({ ...prev, twilio_settings: { ...prev.twilio_settings, messagingServiceSid: e.target.value } }))} 
                placeholder="MG..." 
                className="w-full bg-white border border-[#000000]/20 px-4 py-3 text-sm outline-none font-mono" 
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer mt-2">
                <input 
                  type="checkbox" 
                  checked={twilioSettings.testMode} 
                  onChange={e => updateDraft(prev => ({ ...prev, twilio_settings: { ...prev.twilio_settings, testMode: e.target.checked } }))} 
                  className="w-5 h-5 text-[#000000] border-gray-300 rounded focus:ring-[#000000]" 
                />
                <span className="text-xs font-bold uppercase tracking-wider">Enable Test Mode (Mock sending to save live credits)</span>
              </label>
            </div>
          </div>
          
          <button onClick={async () => {
            if(!twilioSettings.sid || !twilioSettings.authToken) return alert('Enter SID and Auth Token first.');
            alert('Connection Test Ping simulated. Settings saved to draft.');
          }} className="mt-6 bg-[#000000] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#000000]/80 transition-colors">
            Verify Twilio Connection
          </button>
        </section>
      </div>
    </div>
  );
}
