import React, { useState } from 'react';

export default function AdminReturns() {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'rejected', 'completed'

  const [returns, setReturns] = useState([
    {
      id: 'RET-A1B2C3',
      orderNumber: '#10056',
      customer: 'Sarah Wanjiku',
      product: 'Silk Midi Dress',
      reason: 'Wrong size',
      resolution: 'Exchange',
      status: 'pending',
      date: '2026-05-30',
      image: true
    },
    {
      id: 'RET-D4E5F6',
      orderNumber: '#10042',
      customer: 'Mercy Kimani',
      product: 'Ribbed Crop Top',
      reason: 'Damaged item',
      resolution: 'Refund',
      status: 'pending',
      date: '2026-05-29',
      image: true
    },
    {
      id: 'RET-G7H8I9',
      orderNumber: '#10015',
      customer: 'Joy Mutuku',
      product: 'High-Waist Trousers',
      reason: 'Not satisfied',
      resolution: 'Store Credit (+10%)',
      status: 'approved',
      date: '2026-05-25',
      image: false
    },
    {
      id: 'RET-J0K1L2',
      orderNumber: '#09988',
      customer: 'Ann Omondi',
      product: 'Linen Blazer',
      reason: 'Wrong item delivered',
      resolution: 'Exchange',
      status: 'completed',
      date: '2026-05-20',
      image: true
    }
  ]);

  const updateStatus = (id, newStatus) => {
    setReturns(returns.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const filteredReturns = returns.filter(r => r.status === activeTab || (activeTab === 'completed' && r.status === 'completed'));

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold uppercase tracking-tight">Returns Management</h1>
        <button className="bg-ink text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-ink/80 transition-colors">
          Export Report
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 shadow-sm border border-black/5 rounded-sm">
          <p className="text-xs text-black/50 font-bold uppercase tracking-wider mb-1">New Requests</p>
          <p className="text-3xl font-bold">{returns.filter(r => r.status === 'pending').length}</p>
        </div>
        <div className="bg-white p-6 shadow-sm border border-black/5 rounded-sm">
          <p className="text-xs text-black/50 font-bold uppercase tracking-wider mb-1">Approved Returns</p>
          <p className="text-3xl font-bold">{returns.filter(r => r.status === 'approved').length}</p>
        </div>
        <div className="bg-white p-6 shadow-sm border border-black/5 rounded-sm">
          <p className="text-xs text-black/50 font-bold uppercase tracking-wider mb-1">Rejected</p>
          <p className="text-3xl font-bold">{returns.filter(r => r.status === 'rejected').length}</p>
        </div>
        <div className="bg-white p-6 shadow-sm border border-black/5 rounded-sm">
          <p className="text-xs text-black/50 font-bold uppercase tracking-wider mb-1">Completed</p>
          <p className="text-3xl font-bold">{returns.filter(r => r.status === 'completed').length}</p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-black/10">
        {['pending', 'approved', 'rejected', 'completed'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === tab 
                ? 'border-b-2 border-ink text-ink' 
                : 'text-black/50 hover:text-black/80'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-sm border border-black/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 text-xs uppercase tracking-wider text-black/60">
                <th className="p-4 font-bold">Return ID / Order</th>
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold">Product</th>
                <th className="p-4 font-bold">Reason & Resolution</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredReturns.length > 0 ? filteredReturns.map((item) => (
                <tr key={item.id} className="hover:bg-black/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-sm">{item.id}</div>
                    <div className="text-xs text-black/50">{item.orderNumber}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium">{item.customer}</div>
                    <div className="text-xs text-black/50">{item.date}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{item.product}</div>
                    {item.image && <span className="text-[10px] bg-black/10 px-2 py-0.5 rounded mt-1 inline-block">Image Attached</span>}
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{item.reason}</div>
                    <div className="text-xs font-bold text-ink mt-1">Requested: {item.resolution}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {item.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(item.id, 'approved')} className="text-xs bg-ink text-white px-3 py-1.5 font-bold uppercase hover:bg-ink/80 transition-colors">Approve</button>
                        <button onClick={() => updateStatus(item.id, 'rejected')} className="text-xs bg-red-100 text-red-600 px-3 py-1.5 font-bold uppercase hover:bg-red-200 transition-colors">Reject</button>
                      </>
                    )}
                    {item.status === 'approved' && (
                      <button onClick={() => updateStatus(item.id, 'completed')} className="text-xs bg-green-600 text-white px-3 py-1.5 font-bold uppercase hover:bg-green-700 transition-colors">Mark Completed</button>
                    )}
                    <button className="text-xs border border-black/20 px-3 py-1.5 font-bold uppercase hover:bg-black/5 transition-colors">View Details</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-black/50 text-sm">
                    No {activeTab} return requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
