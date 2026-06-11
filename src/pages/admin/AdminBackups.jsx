import React, { useState, useEffect } from 'react';

export default function AdminBackups() {
  const [backups, setBackups] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const token = localStorage.getItem('REVOLT_ADMIN_JWT_TOKEN') || localStorage.getItem('token');

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/system-backups', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBackups(data.backups || []);
        setHistory(data.history || []);
      } else {
        setError(data.error || 'Failed to fetch backups.');
      }
    } catch (err) {
      setError('An error occurred while fetching backups.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateBackup = async () => {
    setActionLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/system-backups/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Backup created successfully.');
        setTimeout(fetchBackups, 1000); // Wait a moment for file to be written
      } else {
        setError(data.error || 'Failed to create backup.');
      }
    } catch (err) {
      setError('An error occurred during backup creation.');
    }
    setActionLoading(false);
  };

  const handleRestore = async (filename) => {
    if (!window.confirm(`Are you absolutely sure you want to restore from ${filename}? This will overwrite all current data.`)) {
      return;
    }
    setActionLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/system-backups/restore', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(`Database restored from ${filename} successfully.`);
        fetchBackups();
      } else {
        setError(data.error || 'Failed to restore database.');
      }
    } catch (err) {
      setError('An error occurred during restoration.');
    }
    setActionLoading(false);
  };

  const handleDownload = async (filename) => {
    try {
      const res = await fetch(`/api/system-backups/download/${filename}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download backup.');
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#000000]">System Backups</h1>
          <p className="text-sm text-[#000000]/60 mt-2">Manage automated and manual database backups securely.</p>
        </div>
        <button 
          onClick={handleCreateBackup} 
          disabled={actionLoading}
          className="bg-[#000000] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#000000]/80 transition-colors disabled:opacity-50"
        >
          {actionLoading ? 'Processing...' : 'Manual Backup'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 text-sm">
          {success}
        </div>
      )}

      {/* BACKUP HISTORY */}
      <section className="bg-white border border-[#000000]/10 p-6">
        <h2 className="text-lg font-bold uppercase tracking-wider mb-4 pb-2 border-b border-[#000000]/10">Backup History Log</h2>
        {loading ? (
          <p className="text-sm text-[#000000]/50">Loading backups...</p>
        ) : backups.length === 0 ? (
          <p className="text-sm text-[#000000]/50 italic">No backups available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#f9f9f9] border-b border-[#000000]/10 text-[10px] font-bold uppercase tracking-[0.1em] text-[#000000]/60">
                <tr>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Filename</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Trigger</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#000000]/10">
                {backups.map((b) => (
                  <tr key={b.filename} className="hover:bg-[#f9f9f9] transition-colors">
                    <td className="px-4 py-3">{new Date(b.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-xs">{b.filename}</td>
                    <td className="px-4 py-3">{formatBytes(b.size)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-[10px] uppercase font-bold ${b.trigger === 'auto' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {b.trigger}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <button 
                        onClick={() => handleDownload(b.filename)}
                        className="text-[10px] font-bold uppercase text-[#000000]/60 hover:text-[#000000]"
                      >
                        Download
                      </button>
                      <button 
                        onClick={() => handleRestore(b.filename)}
                        disabled={actionLoading}
                        className="text-[10px] font-bold uppercase text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        Restore
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* RESTORATION HISTORY */}
      <section className="bg-white border border-[#000000]/10 p-6">
        <h2 className="text-lg font-bold uppercase tracking-wider mb-4 pb-2 border-b border-[#000000]/10">Restoration History Log</h2>
        {loading ? (
          <p className="text-sm text-[#000000]/50">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-[#000000]/50 italic">No restorations performed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#f9f9f9] border-b border-[#000000]/10 text-[10px] font-bold uppercase tracking-[0.1em] text-[#000000]/60">
                <tr>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Admin</th>
                  <th className="px-4 py-3">Action Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#000000]/10">
                {history.map((h) => (
                  <tr key={h.id} className="hover:bg-[#f9f9f9] transition-colors">
                    <td className="px-4 py-3">{new Date(h.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold">{h.user}</td>
                    <td className="px-4 py-3 text-[#000000]/70">{h.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
