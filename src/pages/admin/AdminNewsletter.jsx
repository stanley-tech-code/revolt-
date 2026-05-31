import React, { useState, useEffect } from 'react';

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Campaign state
  const [subject, setSubject] = useState('');
  const [messageHtml, setMessageHtml] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('REVOLT_ADMIN_JWT_TOKEN');
      const res = await fetch('/api/newsletter', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Sort newest first
        setSubscribers(data.subscribers?.sort((a,b) => new Date(b.date) - new Date(a.date)) || []);
      }
    } catch (err) {
      console.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this subscriber?')) return;
    try {
      const token = localStorage.getItem('REVOLT_ADMIN_JWT_TOKEN');
      const res = await fetch(`/api/newsletter/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSubscribers(subscribers.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete subscriber');
    }
  };

  const handleSendCampaign = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !messageHtml.trim()) return;
    
    if (!window.confirm(`Are you sure you want to send this email to ${subscribers.length} subscribers?`)) return;

    setSending(true);
    setSendResult(null);
    try {
      const token = localStorage.getItem('REVOLT_ADMIN_JWT_TOKEN');
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ subject, html: messageHtml })
      });
      const data = await res.json();
      if (res.ok) {
        setSendResult({ success: true, count: data.sentCount });
        setSubject('');
        setMessageHtml('');
      } else {
        setSendResult({ success: false, error: data.error });
      }
    } catch (err) {
      setSendResult({ success: false, error: 'Network error occurred.' });
    } finally {
      setSending(false);
    }
  };

  const handleExportCsv = () => {
    if (subscribers.length === 0) return;
    const headers = ['ID', 'Email', 'Date Joined', 'Source'];
    const csvContent = [
      headers.join(','),
      ...subscribers.map(sub => [
        sub.id,
        sub.email,
        new Date(sub.date).toLocaleDateString(),
        sub.source || 'unknown'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `revolt_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate metrics
  const totalSubscribers = subscribers.length;
  const newToday = subscribers.filter(s => {
    const today = new Date();
    const joinDate = new Date(s.date);
    return joinDate.getDate() === today.getDate() && 
           joinDate.getMonth() === today.getMonth() && 
           joinDate.getFullYear() === today.getFullYear();
  }).length;
  
  // Very rough growth calc: subscribers in last 7 days vs previous 7 days
  const now = new Date();
  const last7Days = subscribers.filter(s => (now - new Date(s.date)) <= 7*24*60*60*1000).length;
  const prev7Days = subscribers.filter(s => {
    const diff = now - new Date(s.date);
    return diff > 7*24*60*60*1000 && diff <= 14*24*60*60*1000;
  }).length;
  let growthRate = 0;
  if (prev7Days > 0) {
    growthRate = Math.round(((last7Days - prev7Days) / prev7Days) * 100);
  } else if (last7Days > 0) {
    growthRate = 100; // Infinity essentially, but show 100%
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-ink">Newsletter</h1>
          <p className="text-sm text-ink/60 mt-1">Manage subscribers and send campaigns</p>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 shadow-sm border border-clay/30 rounded-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-ink/50 mb-2">Total Subscribers</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-ink">{totalSubscribers.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-6 shadow-sm border border-clay/30 rounded-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-ink/50 mb-2">New Today</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-ink">+{newToday}</h3>
          </div>
        </div>
        <div className="bg-white p-6 shadow-sm border border-clay/30 rounded-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-ink/50 mb-2">Weekly Growth</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-ink">{growthRate >= 0 ? '+' : ''}{growthRate}%</h3>
            <span className="text-sm text-green-600 font-medium mb-1 border-b border-green-600/30">vs last week</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SUBSCRIBER LIST */}
        <div className="lg:col-span-2 bg-white shadow-sm border border-clay/30 rounded-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-clay/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-sand/30">
            <h2 className="text-sm font-bold uppercase tracking-widest">Subscriber List</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm border border-clay/50 px-3 py-1.5 focus:outline-none focus:border-ink w-full sm:w-64"
              />
              <button 
                onClick={handleExportCsv}
                className="bg-ink text-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest hover:bg-cocoa transition-colors whitespace-nowrap"
              >
                Export CSV
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-sand/20 text-ink/50 text-[10px] uppercase tracking-widest">
                <tr>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Date Joined</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clay/20">
                {loading ? (
                  <tr><td colSpan="4" className="px-4 py-8 text-center text-ink/50">Loading subscribers...</td></tr>
                ) : filteredSubscribers.length === 0 ? (
                  <tr><td colSpan="4" className="px-4 py-8 text-center text-ink/50">No subscribers found.</td></tr>
                ) : (
                  filteredSubscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-sand/10 transition-colors">
                      <td className="px-4 py-3 font-medium text-ink">{sub.email}</td>
                      <td className="px-4 py-3 text-ink/70">{new Date(sub.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      <td className="px-4 py-3 text-ink/70 capitalize">{sub.source || 'Unknown'}</td>
                      <td className="px-4 py-3 text-right">
                        <button 
                          onClick={() => handleDelete(sub.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium uppercase tracking-wider"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CAMPAIGN SENDER */}
        <div className="bg-white shadow-sm border border-clay/30 rounded-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-clay/30 bg-sand/30">
            <h2 className="text-sm font-bold uppercase tracking-widest">Send Campaign</h2>
          </div>
          <div className="p-6">
            {sendResult && (
              <div className={`mb-6 p-4 text-sm ${sendResult.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {sendResult.success 
                  ? `Successfully dispatched email to ${sendResult.count} subscribers!` 
                  : sendResult.error}
              </div>
            )}
            
            <form onSubmit={handleSendCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ink/70 mb-2">Subject Line</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. New Drop: The Summer Collection"
                  className="w-full border border-clay/50 px-3 py-2 text-sm focus:outline-none focus:border-ink"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ink/70 mb-2">Message (HTML Supported)</label>
                <textarea
                  required
                  rows="10"
                  value={messageHtml}
                  onChange={(e) => setMessageHtml(e.target.value)}
                  placeholder="<h1>Big news!</h1><p>Check out our latest styles...</p>"
                  className="w-full border border-clay/50 px-3 py-2 text-sm focus:outline-none focus:border-ink font-mono text-xs"
                />
                <p className="text-[10px] text-ink/50 mt-1 uppercase tracking-wider">Note: Uses raw HTML so you can inject your custom brand styling.</p>
              </div>

              <button
                type="submit"
                disabled={sending || subscribers.length === 0}
                className="w-full bg-ink text-white px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-cocoa transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Dispatching...
                  </>
                ) : (
                  `Send to ${subscribers.length} Subscribers`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
