import React, { useState, useEffect } from 'react';

export default function AdminMessages() {
  const [activeTab, setActiveTab] = useState('new'); // 'new', 'replied', 'closed'
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('REVOLT_ADMIN_JWT_TOKEN');
      const res = await fetch('/api/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('REVOLT_ADMIN_JWT_TOKEN');
      const res = await fetch(`/api/messages/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(messages.map(m => m.id === id ? data.ticket : m));
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(data.ticket);
        }
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMessage) return;
    
    try {
      const token = localStorage.getItem('REVOLT_ADMIN_JWT_TOKEN');
      const res = await fetch(`/api/messages/${selectedMessage.id}/reply`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ text: replyText })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(messages.map(m => m.id === selectedMessage.id ? data.ticket : m));
        setSelectedMessage(data.ticket);
        setReplyText('');
        // Re-fetch to guarantee sync
        fetchMessages();
      }
    } catch (err) {
      console.error('Failed to send reply', err);
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesTab = m.status === activeTab;
    const matchesSearch = 
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-200 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedMessage) {
    const waText = encodeURIComponent(`Hi ${selectedMessage.name}, regarding your recent message to Revolt:\n\n`);
    const cleanPhone = selectedMessage.phone ? selectedMessage.phone.replace(/[^0-9+]/g, '') : '';
    const waLink = `https://wa.me/${cleanPhone}?text=${waText}`;

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedMessage(null)} className="text-sm font-bold uppercase tracking-widest border-b border-black pb-0.5 hover:text-gray-500 transition-colors">
              &larr; Back to Inbox
            </button>
            <h1 className="text-2xl font-bold uppercase tracking-tight">Message Details</h1>
          </div>
          <div className="space-x-3">
            {selectedMessage.status !== 'closed' && (
              <button onClick={() => updateStatus(selectedMessage.id, 'closed')} className="text-xs bg-gray-200 text-gray-800 px-4 py-2 font-bold uppercase tracking-wider hover:bg-gray-300 transition-colors">
                Mark Closed
              </button>
            )}
            {selectedMessage.status === 'closed' && (
              <button onClick={() => updateStatus(selectedMessage.id, 'new')} className="text-xs bg-blue-100 text-blue-800 px-4 py-2 font-bold uppercase tracking-wider hover:bg-blue-200 transition-colors">
                Reopen Ticket
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-6 shadow-sm border border-black/5">
          <div className="flex justify-between items-start mb-6 pb-6 border-b border-black/10">
            <div>
              <h2 className="text-xl font-bold mb-1">{selectedMessage.subject}</h2>
              <div className="text-sm text-gray-500 space-y-1 mt-3">
                <p><strong>Customer Name:</strong> <span className="text-black">{selectedMessage.name}</span></p>
                <p><strong>Email:</strong> <span className="text-black">{selectedMessage.email}</span></p>
                {selectedMessage.phone && <p><strong>Phone:</strong> <span className="text-black">{selectedMessage.phone}</span></p>}
                <p><strong>Date Received:</strong> <span className="text-black">{new Date(selectedMessage.date).toLocaleString()}</span></p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${getStatusColor(selectedMessage.status)}`}>
                {selectedMessage.status.replace('_', ' ')}
              </span>
              
              {selectedMessage.phone && (
                <a 
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded hover:bg-[#128C7E] transition-colors"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  Reply via WhatsApp
                </a>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Original Message */}
            <div className="bg-gray-50 p-6 border border-gray-200">
              <p className="text-xs font-bold uppercase tracking-wider mb-3 border-b border-gray-200 pb-2">
                Original Message
              </p>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>

            {/* Replies */}
            {selectedMessage.replies?.map((reply, idx) => (
              <div key={idx} className={`p-6 border ${reply.from === 'admin' ? 'bg-blue-50 border-blue-100 ml-12' : 'bg-gray-50 border-gray-200 mr-12'}`}>
                <p className="text-xs font-bold uppercase tracking-wider mb-2">
                  {reply.senderName} <span className="text-[9px] text-gray-400 font-normal normal-case ml-2">{new Date(reply.date).toLocaleString()}</span>
                </p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{reply.text}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedMessage.status !== 'closed' && (
          <form onSubmit={handleReplySubmit} className="bg-white p-6 shadow-sm border border-black/5">
            <label className="block text-xs font-bold uppercase tracking-widest mb-3">Email Reply to Customer</label>
            <textarea 
              required 
              rows="4" 
              value={replyText} 
              onChange={(e) => setReplyText(e.target.value)} 
              className="w-full border border-gray-300 p-4 text-sm focus:outline-none focus:border-black resize-y mb-4"
              placeholder="Type your response here. The customer will receive this via email..."
            ></textarea>
            <div className="flex justify-end">
              <button type="submit" className="bg-ink text-white px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-ink/80 transition-colors">
                Send Email Reply
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold uppercase tracking-tight">Customer Messages</h1>
        <button onClick={fetchMessages} className="bg-ink text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-ink/80 transition-colors">
          Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 shadow-sm border border-black/5 rounded-sm">
          <p className="text-xs text-black/50 font-bold uppercase tracking-wider mb-1">New</p>
          <p className="text-3xl font-bold">{messages.filter(m => m.status === 'new').length}</p>
        </div>
        <div className="bg-white p-6 shadow-sm border border-black/5 rounded-sm">
          <p className="text-xs text-black/50 font-bold uppercase tracking-wider mb-1">Replied</p>
          <p className="text-3xl font-bold">{messages.filter(m => m.status === 'replied').length}</p>
        </div>
        <div className="bg-white p-6 shadow-sm border border-black/5 rounded-sm">
          <p className="text-xs text-black/50 font-bold uppercase tracking-wider mb-1">Closed</p>
          <p className="text-3xl font-bold">{messages.filter(m => m.status === 'closed').length}</p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-black/5 rounded-sm overflow-hidden flex flex-col">
        {/* TABS & SEARCH */}
        <div className="flex justify-between items-center border-b border-black/10 bg-gray-50/50">
          <div className="flex">
            {['new', 'replied', 'closed'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeTab === tab 
                    ? 'border-b-2 border-ink text-ink bg-white' 
                    : 'text-black/50 hover:text-black/80 hover:bg-black/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="px-4">
            <input 
              type="text" 
              placeholder="Search name, email, or subject..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs border border-gray-300 rounded px-3 py-2 w-64 focus:outline-none focus:border-ink"
            />
          </div>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="p-8 text-center text-black/50 font-bold animate-pulse">Loading messages...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-black/5 text-[10px] uppercase tracking-wider text-black/60 border-b border-black/10">
                  <th className="p-4 font-bold">Customer Name</th>
                  <th className="p-4 font-bold">Email Address</th>
                  <th className="p-4 font-bold">Phone Number</th>
                  <th className="p-4 font-bold max-w-xs">Subject / Snippet</th>
                  <th className="p-4 font-bold">Date Received</th>
                  <th className="p-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredMessages.length > 0 ? filteredMessages.map((msg) => (
                  <tr key={msg.id} onClick={() => setSelectedMessage(msg)} className="hover:bg-black/[0.02] cursor-pointer transition-colors text-sm">
                    <td className="p-4 font-medium">{msg.name}</td>
                    <td className="p-4 text-gray-600">{msg.email}</td>
                    <td className="p-4 text-gray-600">{msg.phone || '-'}</td>
                    <td className="p-4 max-w-xs truncate">
                      <span className="font-bold">{msg.subject}</span>
                      <span className="text-gray-400 ml-2 text-xs">{(msg.message || '').substring(0, 40)}...</span>
                    </td>
                    <td className="p-4 text-gray-500 text-xs">{new Date(msg.date).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded ${getStatusColor(msg.status)}`}>
                        {msg.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-black/50 text-sm">
                      {searchQuery ? 'No matching messages found.' : `No ${activeTab} messages.`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
