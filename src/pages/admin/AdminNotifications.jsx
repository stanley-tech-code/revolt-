import React, { useState, useEffect } from 'react';
import { useCms } from '../../context/CmsContext';

export default function AdminNotifications() {
  const { db, draftDb, updateDraft, publishChanges, discardChanges, isLoading, sendNotification, fetchTwilioConversations } = useCms();
  const [activeTab, setActiveTab] = useState('logs');
  const [logs, setLogs] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [loadingLogs, setLoadingLogs] = useState(false);

  const notifications = draftDb.notifications || { templates: [], campaigns: [], automations: [], segments: [] };
  const twilioSettings = draftDb.twilio_settings || { sid: '', authToken: '', senderPhone: '', messagingServiceSid: '', testMode: true };
  const templates = notifications.templates || [];
  const campaigns = notifications.campaigns || [];
  const automations = notifications.automations || [];
  const segments = notifications.segments || [];

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs();
    } else if (activeTab === 'inbox') {
      loadConversations();
    }
  }, [activeTab]);

  const loadConversations = async () => {
    const data = await fetchTwilioConversations();
    setConversations(data);
  };

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const token = localStorage.getItem('REVOLT_ADMIN_JWT_TOKEN');
      const res = await fetch('/api/notifications/logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handlePublish = async () => {
    if (window.confirm("Are you sure you want to publish these notification settings?")) {
      await publishChanges();
    }
  };

  // --- TEMPLATE BUILDER STATE ---
  const [editingTemplate, setEditingTemplate] = useState(null);

  const createNewTemplate = () => {
    const newTemp = {
      id: `tpl_${Date.now()}`,
      name: 'New Template',
      channel: 'Email',
      subject: '',
      blocks: [
        { id: `blk_${Date.now()}`, type: 'text', content: 'Hello {{customer_name}}!' }
      ]
    };
    updateDraft(prev => ({
      ...prev,
      notifications: { ...prev.notifications, templates: [...(prev.notifications?.templates || []), newTemp] }
    }));
    setEditingTemplate(newTemp);
  };

  const saveTemplate = () => {
    updateDraft(prev => {
      const newTemplates = [...(prev.notifications?.templates || [])];
      const idx = newTemplates.findIndex(t => t.id === editingTemplate.id);
      if (idx > -1) {
        newTemplates[idx] = editingTemplate;
      }
      return { ...prev, notifications: { ...prev.notifications, templates: newTemplates } };
    });
    setEditingTemplate(null);
  };

  const addTemplateBlock = (type) => {
    setEditingTemplate(prev => ({
      ...prev,
      blocks: [...prev.blocks, { id: `blk_${Date.now()}`, type, content: '', image: '' }]
    }));
  };

  const updateTemplateBlock = (idx, field, value) => {
    setEditingTemplate(prev => {
      const newBlocks = [...prev.blocks];
      newBlocks[idx] = { ...newBlocks[idx], [field]: value };
      return { ...prev, blocks: newBlocks };
    });
  };

  const removeTemplateBlock = (idx) => {
    setEditingTemplate(prev => {
      const newBlocks = [...prev.blocks];
      newBlocks.splice(idx, 1);
      return { ...prev, blocks: newBlocks };
    });
  };

  // --- AUTOMATIONS ---
  const triggersList = ['ORDER_PENDING', 'ORDER_SHIPPED', 'ORDER_DELIVERED', 'ORDER_REFUNDED', 'ABANDONED_CART', 'BACK_IN_STOCK', 'REVIEW_REQUEST', 'LOYALTY_EARNED'];

  const addAutomation = () => {
    updateDraft(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        automations: [...(prev.notifications?.automations || []), { id: `auto_${Date.now()}`, trigger: 'ORDER_SHIPPED', templateId: '', delay: 0, active: false }]
      }
    }));
  };

  const updateAutomation = (id, field, value) => {
    updateDraft(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        automations: (prev.notifications?.automations || []).map(a => a.id === id ? { ...a, [field]: value } : a)
      }
    }));
  };

  const removeAutomation = (id) => {
    updateDraft(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        automations: (prev.notifications?.automations || []).filter(a => a.id !== id)
      }
    }));
  };

  // --- BROADCASTS ---
  const [newCampaign, setNewCampaign] = useState({ name: '', templateId: '', segmentId: 'All' });
  
  const scheduleCampaign = async () => {
    if (!newCampaign.templateId) return alert('Select a template first.');
    const campId = `camp_${Date.now()}`;
    
    // Simulate sending broadcast to dummy audience immediately for mockup
    alert(`Starting broadcast for campaign: ${newCampaign.name}`);
    await sendNotification('Broadcast Audience', '+10000000000', 'SMS', newCampaign.templateId, 'Broadcast content...', campId);
    
    updateDraft(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        campaigns: [...(prev.notifications?.campaigns || []), { id: campId, ...newCampaign, status: 'Sent', sentAt: new Date().toISOString() }]
      }
    }));
    setNewCampaign({ name: '', templateId: '', segmentId: 'All' });
  };

  const renderTabs = () => {
    const tabs = [
      { id: 'logs', label: 'Logs & Analytics' },
      { id: 'automations', label: 'Automations' },
      { id: 'broadcasts', label: 'Broadcasts' },
      { id: 'templates', label: 'Template Builder' },
      { id: 'audience', label: 'Audience Segments' },
      { id: 'inbox', label: 'Two-Way Inbox' }
    ];

    return (
      <div className="flex flex-wrap border-b border-[#000000]/10 mb-6 gap-y-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setEditingTemplate(null); }}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === tab.id ? 'border-b-2 border-[#000000] text-[#000000]' : 'text-[#000000]/50 hover:text-[#000000]'
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
          <h1 className="text-3xl font-bold tracking-tight text-[#000000]">Notifications & CRM</h1>
          <p className="text-sm text-[#000000]/60 mt-2">Manage automated emails, SMS broadcasts, and customer engagement.</p>
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

      <div className="bg-white p-6 border border-[#000000]/10">
        {renderTabs()}

        {/* --- LOGS --- */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-[#000000]/10 pb-2">
              <h2 className="text-lg font-bold uppercase tracking-wider">Delivery Logs & History</h2>
              <button onClick={fetchLogs} className="text-xs font-bold uppercase tracking-wider text-[#000000]/60 hover:text-[#000000]">↻ Refresh</button>
            </div>
            
            {loadingLogs ? (
              <p className="text-sm text-[#000000]/60">Loading delivery reports...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#f9f9f9] border-y border-[#000000]/10 text-[10px] font-bold uppercase tracking-[0.1em] text-[#000000]/60">
                    <tr>
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3">Recipient / Order</th>
                      <th className="px-4 py-3">Message Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#000000]/10">
                    {logs.length === 0 && (
                      <tr><td colSpan="3" className="px-4 py-4 text-center text-[#000000]/60">No notification logs found.</td></tr>
                    )}
                    {logs.map(log => (
                      <tr key={log.id}>
                        <td className="px-4 py-3">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-3 font-medium">{log.user}</td>
                        <td className="px-4 py-3 font-mono text-xs">{log.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- AUTOMATIONS --- */}
        {activeTab === 'automations' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center border-b border-[#000000]/10 pb-2">
              <h2 className="text-lg font-bold uppercase tracking-wider">Automated Triggers</h2>
              <button onClick={addAutomation} className="text-xs font-bold uppercase tracking-wider bg-[#000000] text-white px-4 py-2">+ Add Trigger</button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {automations.map((auto, idx) => (
                <div key={auto.id} className="border border-[#000000]/10 p-4 bg-[#f9f9f9] flex flex-col sm:flex-row gap-4 items-center">
                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">When this happens:</label>
                      <select value={auto.trigger} onChange={e => updateAutomation(auto.id, 'trigger', e.target.value)} className="w-full bg-white border border-[#000000]/20 px-3 py-2 text-sm outline-none">
                        {triggersList.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Send Template:</label>
                      <select value={auto.templateId} onChange={e => updateAutomation(auto.id, 'templateId', e.target.value)} className="w-full bg-white border border-[#000000]/20 px-3 py-2 text-sm outline-none">
                        <option value="">-- Select Template --</option>
                        {templates.map(t => <option key={t.id} value={t.id}>{t.name} ({t.channel})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Delay (Hours):</label>
                      <input type="number" min="0" value={auto.delay || 0} onChange={e => updateAutomation(auto.id, 'delay', parseInt(e.target.value))} className="w-full bg-white border border-[#000000]/20 px-3 py-2 text-sm outline-none" />
                    </div>
                    <div className="flex items-center gap-4 pt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={auto.active} onChange={e => updateAutomation(auto.id, 'active', e.target.checked)} className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">{auto.active ? 'Active' : 'Paused'}</span>
                      </label>
                    </div>
                  </div>
                  <button onClick={() => removeAutomation(auto.id)} className="text-xs font-bold uppercase text-red-500">Remove</button>
                </div>
              ))}
              {automations.length === 0 && <p className="text-sm text-[#000000]/60">No automated triggers setup.</p>}
            </div>
          </div>
        )}

        {/* --- TEMPLATES --- */}
        {activeTab === 'templates' && !editingTemplate && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-[#000000]/10 pb-2">
              <h2 className="text-lg font-bold uppercase tracking-wider">Notification Templates</h2>
              <button onClick={createNewTemplate} className="text-xs font-bold uppercase tracking-wider bg-[#000000] text-white px-4 py-2">+ Create Template</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {templates.map(tpl => (
                <div key={tpl.id} className="border border-[#000000]/10 p-4 bg-[#f9f9f9] hover:border-[#000000]/30 transition-colors cursor-pointer" onClick={() => setEditingTemplate(tpl)}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-sm truncate">{tpl.name}</h3>
                    <span className="text-[10px] bg-[#000000]/10 px-2 py-0.5 rounded font-bold uppercase">{tpl.channel}</span>
                  </div>
                  <p className="text-xs text-[#000000]/60 line-clamp-2">{tpl.subject || 'No subject'}</p>
                  <p className="text-[10px] mt-4 font-bold uppercase text-[#000000]/40 text-right">Click to edit</p>
                </div>
              ))}
              {templates.length === 0 && <p className="text-sm text-[#000000]/60 col-span-3">No templates built yet.</p>}
            </div>
          </div>
        )}

        {activeTab === 'templates' && editingTemplate && (
          <div className="space-y-6 max-w-3xl">
            <div className="flex justify-between items-center border-b border-[#000000]/10 pb-2">
              <h2 className="text-lg font-bold uppercase tracking-wider">Editing: {editingTemplate.name}</h2>
              <div className="flex gap-2">
                <button onClick={() => setEditingTemplate(null)} className="text-xs font-bold uppercase tracking-wider px-4 py-2 border border-[#000000]/20">Cancel</button>
                <button onClick={saveTemplate} className="text-xs font-bold uppercase tracking-wider bg-[#000000] text-white px-4 py-2">Done Editing</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Template Name</label>
                <input type="text" value={editingTemplate.name} onChange={e => setEditingTemplate({ ...editingTemplate, name: e.target.value })} className="w-full bg-white border border-[#000000]/20 px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Channel</label>
                <select value={editingTemplate.channel} onChange={e => setEditingTemplate({ ...editingTemplate, channel: e.target.value })} className="w-full bg-white border border-[#000000]/20 px-3 py-2 text-sm outline-none">
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="Push">Push</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
                {editingTemplate.channel === 'WhatsApp' && (
                  <button onClick={() => alert('Template submitted to Meta for approval.')} className="mt-2 text-[10px] font-bold uppercase bg-green-100 text-green-800 px-3 py-1 rounded">Submit for Meta Approval</button>
                )}
              </div>
            </div>

            {['Email', 'Push'].includes(editingTemplate.channel) && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Subject Line / Push Title</label>
                <input type="text" value={editingTemplate.subject} onChange={e => setEditingTemplate({ ...editingTemplate, subject: e.target.value })} placeholder="Use {{customer_name}} for variables" className="w-full bg-white border border-[#000000]/20 px-3 py-2 text-sm outline-none" />
              </div>
            )}

            <div className="mt-8 border border-[#000000]/20 p-4 bg-[#f9f9f9]">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Block Builder</h3>
              <div className="space-y-4">
                {editingTemplate.blocks.map((blk, idx) => (
                  <div key={blk.id} className="relative bg-white border border-[#000000]/10 p-4 shadow-sm group">
                    <button onClick={() => removeTemplateBlock(idx)} className="absolute top-2 right-2 text-[10px] text-red-500 font-bold uppercase hidden group-hover:block">Remove</button>
                    
                    <span className="block text-[9px] font-bold uppercase text-[#000000]/40 mb-2">{blk.type} Block</span>
                    
                    {blk.type === 'text' && (
                      <textarea rows="3" value={blk.content} onChange={e => updateTemplateBlock(idx, 'content', e.target.value)} placeholder="Type message..." className="w-full bg-[#f9f9f9] border border-[#000000]/10 px-3 py-2 text-sm outline-none font-mono" />
                    )}
                    {blk.type === 'image' && (
                      <input type="text" value={blk.image} onChange={e => updateTemplateBlock(idx, 'image', e.target.value)} placeholder="Image URL..." className="w-full bg-[#f9f9f9] border border-[#000000]/10 px-3 py-2 text-sm outline-none" />
                    )}
                    {blk.type === 'button' && (
                      <div className="flex gap-2">
                        <input type="text" value={blk.content} onChange={e => updateTemplateBlock(idx, 'content', e.target.value)} placeholder="Button Text" className="flex-1 bg-[#f9f9f9] border border-[#000000]/10 px-3 py-2 text-sm outline-none" />
                        <input type="text" value={blk.image} onChange={e => updateTemplateBlock(idx, 'image', e.target.value)} placeholder="Button URL" className="flex-1 bg-[#f9f9f9] border border-[#000000]/10 px-3 py-2 text-sm outline-none" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={() => addTemplateBlock('text')} className="text-[10px] font-bold uppercase tracking-wider bg-[#000000]/10 px-3 py-1.5 hover:bg-[#000000]/20">+ Text</button>
                <button onClick={() => addTemplateBlock('image')} className="text-[10px] font-bold uppercase tracking-wider bg-[#000000]/10 px-3 py-1.5 hover:bg-[#000000]/20">+ Image</button>
                <button onClick={() => addTemplateBlock('button')} className="text-[10px] font-bold uppercase tracking-wider bg-[#000000]/10 px-3 py-1.5 hover:bg-[#000000]/20">+ Button</button>
              </div>
            </div>
            <p className="text-[10px] text-[#000000]/60 italic mt-2">Available variables: {'{{customer_name}}, {{order_id}}, {{tracking_link}}'}</p>
          </div>
        )}

        {/* --- BROADCASTS --- */}
        {activeTab === 'broadcasts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-[#000000]/10 pb-2">
              <h2 className="text-lg font-bold uppercase tracking-wider">Marketing Broadcasts</h2>
            </div>
            
            <div className="border border-[#000000]/20 p-4 bg-[#f9f9f9] max-w-3xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider">Schedule New Campaign</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Campaign Name</label>
                  <input type="text" value={newCampaign.name} onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })} placeholder="e.g. Summer Sale 2026" className="w-full bg-white border border-[#000000]/20 px-3 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Template</label>
                  <select value={newCampaign.templateId} onChange={e => setNewCampaign({ ...newCampaign, templateId: e.target.value })} className="w-full bg-white border border-[#000000]/20 px-3 py-2 text-sm outline-none">
                    <option value="">-- Select Template --</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name} ({t.channel})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Target Audience</label>
                  <select value={newCampaign.segmentId} onChange={e => setNewCampaign({ ...newCampaign, segmentId: e.target.value })} className="w-full bg-white border border-[#000000]/20 px-3 py-2 text-sm outline-none">
                    <option value="All">All Opted-in Customers</option>
                    <option value="VIP">VIP Customers</option>
                    <option value="Inactive">Inactive &gt; 30 Days</option>
                  </select>
                </div>
              </div>
              <button onClick={scheduleCampaign} className="bg-[#000000] text-white px-6 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#000000]/80">Send Broadcast Now</button>
            </div>

            <div className="pt-6">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-2">Campaign History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#f9f9f9] border-y border-[#000000]/10 text-[10px] font-bold uppercase tracking-[0.1em] text-[#000000]/60">
                    <tr>
                      <th className="px-4 py-3">Campaign Name</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Sent At</th>
                      <th className="px-4 py-3">Audience</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#000000]/10">
                    {campaigns.length === 0 && (
                      <tr><td colSpan="4" className="px-4 py-4 text-center text-[#000000]/60">No campaigns sent yet.</td></tr>
                    )}
                    {campaigns.map(camp => (
                      <tr key={camp.id}>
                        <td className="px-4 py-3 font-medium">{camp.name}</td>
                        <td className="px-4 py-3"><span className="text-[10px] bg-green-100 text-green-800 font-bold uppercase px-2 py-0.5 rounded">{camp.status}</span></td>
                        <td className="px-4 py-3 text-xs">{new Date(camp.sentAt).toLocaleString()}</td>
                        <td className="px-4 py-3 text-xs">{camp.segmentId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- AUDIENCE & SEGMENTS --- */}
        {activeTab === 'audience' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-[#000000]/10 pb-2">
              <h2 className="text-lg font-bold uppercase tracking-wider">Audience & Segments</h2>
            </div>
            <p className="text-sm text-[#000000]/60 max-w-2xl">Segment management is handled automatically by the CRM engine based on order volume. Use the main Customers tab to view specific profiles. Opt-out statuses for mock customers are listed below.</p>
            
            <div className="overflow-x-auto max-w-3xl">
              <table className="w-full text-left text-sm whitespace-nowrap border border-[#000000]/10">
                <thead className="bg-[#f9f9f9] border-b border-[#000000]/10 text-[10px] font-bold uppercase tracking-[0.1em] text-[#000000]/60">
                  <tr>
                    <th className="px-4 py-3">Customer Reference</th>
                    <th className="px-4 py-3 text-center">Email Opt-in</th>
                    <th className="px-4 py-3 text-center">SMS Opt-in</th>
                    <th className="px-4 py-3 text-center">WhatsApp Opt-in</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#000000]/10">
                  {/* Mock audience for visual purposes */}
                  {[1,2,3].map(i => (
                    <tr key={i}>
                      <td className="px-4 py-3 font-medium text-xs">{`customer_mock_${i}@example.com`}</td>
                      <td className="px-4 py-3 text-center"><input type="checkbox" defaultChecked /></td>
                      <td className="px-4 py-3 text-center"><input type="checkbox" defaultChecked /></td>
                      <td className="px-4 py-3 text-center"><input type="checkbox" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TWO-WAY INBOX --- */}
        {activeTab === 'inbox' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center border-b border-[#000000]/10 pb-2">
              <h2 className="text-lg font-bold uppercase tracking-wider">Two-Way SMS / WhatsApp Inbox</h2>
              <button onClick={loadConversations} className="text-xs font-bold uppercase tracking-wider text-[#000000]/60 hover:text-[#000000]">↻ Refresh</button>
            </div>
            <div className="border border-[#000000]/20 h-[500px] flex bg-[#f9f9f9]">
              <div className="w-1/3 border-r border-[#000000]/20 overflow-y-auto">
                {conversations.length === 0 ? (
                  <p className="p-4 text-xs text-[#000000]/50 text-center">No recent messages.</p>
                ) : (
                  conversations.map((c, i) => (
                    <div key={c.id || i} onClick={() => setActiveConversationId(c.id)} className={`p-3 border-b border-[#000000]/10 cursor-pointer ${activeConversationId === c.id ? 'bg-white border-l-4 border-l-[#000000]' : 'hover:bg-gray-50'}`}>
                      <p className="text-xs font-bold truncate">{c.user || 'Unknown Sender'}</p>
                      <p className="text-[10px] text-[#000000]/50 truncate">{c.action.replace('[TWILIO_INBOUND]', '').trim()}</p>
                      <p className="text-[9px] text-[#000000]/40 mt-1">{new Date(c.timestamp).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="flex-1 flex flex-col bg-white">
                {activeConversationId ? (
                  <>
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                      {/* Normally we'd group messages by thread, here we just show the selected inbound message and allow a reply */}
                      {conversations.filter(c => c.id === activeConversationId).map(msg => (
                        <div key={`msg_${msg.id}`} className="flex justify-start">
                          <div className="bg-[#f5f5f5] text-black text-xs p-3 rounded-lg rounded-tl-none max-w-[80%] whitespace-pre-wrap">
                            {msg.action.replace('[TWILIO_INBOUND]', '').trim()}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-[#000000]/20 flex gap-2">
                      <input 
                        type="text" 
                        value={replyMessage}
                        onChange={e => setReplyMessage(e.target.value)}
                        placeholder="Type reply..." 
                        className="flex-1 text-xs border border-[#000000]/20 px-3 outline-none" 
                      />
                      <button 
                        onClick={async () => {
                          if(!replyMessage) return;
                          const activeMsg = conversations.find(c => c.id === activeConversationId);
                          // Extract phone from 'From: +123 | Message: ...'
                          const phoneMatch = activeMsg?.action.match(/From:\s*([^\s|]+)/);
                          const phone = phoneMatch ? phoneMatch[1] : null;
                          if (phone) {
                            await sendNotification('Reply', phone, 'SMS', null, replyMessage, 'Manual_Reply');
                            setReplyMessage('');
                            alert('Reply sent!');
                            loadConversations();
                          } else {
                            alert('Could not determine phone number.');
                          }
                        }}
                        className="bg-[#000000] text-white text-[10px] font-bold uppercase tracking-wider px-4">Send</button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-[#000000]/40 text-sm">Select a message to view thread.</div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
