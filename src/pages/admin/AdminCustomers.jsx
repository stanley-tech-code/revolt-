import React, { useState, useMemo } from 'react';
import { useCms } from '../../context/CmsContext';

export default function AdminCustomers() {
  const { db, updateCustomerStatus, deleteCustomer } = useCms();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Joined (Newest)');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const customers = db?.customers || [];
  const orders = db?.orders || [];

  // Derived metrics per customer
  const customerMetrics = useMemo(() => {
    const metrics = {};
    customers.forEach(c => {
      const custOrders = orders.filter(o => o.userId === c.id || o.customer === c.fullName);
      const totalSpent = custOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
      metrics[c.id] = { orderCount: custOrders.length, totalSpent, orders: custOrders };
    });
    return metrics;
  }, [customers, orders]);

  const filteredCustomers = useMemo(() => {
    let result = customers.filter(customer => {
      const matchesSearch = customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
      if (filterStatus === 'Active') return matchesSearch && customer.role === 'client';
      if (filterStatus === 'Suspended') return matchesSearch && customer.role === 'suspended';
      return matchesSearch;
    });

    result.sort((a, b) => {
      const metricsA = customerMetrics[a.id] || { orderCount: 0, totalSpent: 0 };
      const metricsB = customerMetrics[b.id] || { orderCount: 0, totalSpent: 0 };

      switch (sortBy) {
        case 'Joined (Oldest)':
          return new Date(a.createdat || a.createdAt) - new Date(b.createdat || b.createdAt);
        case 'Orders (High-Low)':
          return metricsB.orderCount - metricsA.orderCount;
        case 'Total Spent (High-Low)':
          return metricsB.totalSpent - metricsA.totalSpent;
        case 'Joined (Newest)':
        default:
          return new Date(b.createdat || b.createdAt) - new Date(a.createdat || a.createdAt);
      }
    });

    return result;
  }, [customers, searchTerm, filterStatus, sortBy, customerMetrics]);

  const handleStatusToggle = async (id, currentRole) => {
    if (window.confirm(`Are you sure you want to ${currentRole === 'suspended' ? 'reactivate' : 'suspend'} this account?`)) {
      setIsProcessing(true);
      const newStatus = currentRole === 'suspended' ? 'client' : 'suspended';
      await updateCustomerStatus(id, newStatus);
      if (selectedCustomer?.id === id) {
        setSelectedCustomer({ ...selectedCustomer, role: newStatus });
      }
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('WARNING: Are you sure you want to delete this account? Their profile will be anonymized to preserve order history.')) {
      setIsProcessing(true);
      const success = await deleteCustomer(id);
      if (success) {
        setSelectedCustomer(null);
      }
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8 pb-32 max-w-7xl mx-auto animate-fade-in">
      <div className="flex justify-between items-end border-b border-[#000000]/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">Customers</h1>
          <p className="text-xs tracking-[0.2em] uppercase text-[#000000]/50 mt-2">Manage Registered Clients</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">{customers.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-[#000000]/50">Total Clients</p>
        </div>
      </div>

      <div className="bg-white border border-[#000000]/10 shadow-sm relative">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#000000]/10 flex flex-col md:flex-row gap-4 justify-between items-center bg-[#fcfcfc]">
          <div className="flex gap-4 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="px-4 py-2 text-xs border border-[#000000]/20 bg-white w-full md:w-64 focus:outline-none focus:border-[#000000] transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="px-4 py-2 text-xs border border-[#000000]/20 bg-white focus:outline-none focus:border-[#000000] uppercase tracking-wider font-semibold"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
            <select 
              className="px-4 py-2 text-xs border border-[#000000]/20 bg-white focus:outline-none focus:border-[#000000] uppercase tracking-wider font-semibold"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Joined (Newest)">Joined (Newest)</option>
              <option value="Joined (Oldest)">Joined (Oldest)</option>
              <option value="Orders (High-Low)">Orders (High-Low)</option>
              <option value="Total Spent (High-Low)">Total Spent (High-Low)</option>
            </select>
          </div>
        </div>

        {/* Customer Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f9f9f9] border-b border-[#000000]/10">
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60">Client Details</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60">Joined</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60 text-right">Orders</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60 text-right">Total Spent</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60 text-center">Status</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-sm text-[#000000]/50">No customers found.</td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const metrics = customerMetrics[customer.id];
                  const isActive = customer.role === 'client';
                  
                  return (
                    <tr key={customer.id} className="border-b border-[#000000]/5 hover:bg-[#fcfcfc] transition-colors group cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                      <td className="py-4 px-6">
                        <p className="font-bold text-sm">{customer.fullName}</p>
                        <p className="text-xs text-[#000000]/60">{customer.email}</p>
                        {customer.phone && <p className="text-[10px] text-[#000000]/50 mt-1">{customer.phone}</p>}
                      </td>
                      <td className="py-4 px-6 text-sm">
                        {new Date(customer.createdat || customer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-sm text-right font-medium">
                        {metrics?.orderCount || 0}
                      </td>
                      <td className="py-4 px-6 text-sm text-right font-medium">
                        Ksh {metrics?.totalSpent?.toLocaleString() || 0}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right" onClick={e => e.stopPropagation()}>
                        <button 
                          onClick={() => setSelectedCustomer(customer)}
                          className="text-xs font-bold uppercase tracking-wider hover:underline text-[#000000]/60 hover:text-[#000000] mr-4"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER DETAILS MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row">
            
            {/* Left Col: Profile & Actions */}
            <div className="w-full md:w-1/3 border-r border-[#000000]/10 bg-[#fcfcfc] p-8 flex flex-col">
              <div className="mb-8">
                <div className="w-16 h-16 bg-[#000000]/10 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  {selectedCustomer.fullName?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold uppercase tracking-tight">{selectedCustomer.fullName}</h2>
                <p className="text-sm text-[#000000]/60">{selectedCustomer.email}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${selectedCustomer.role === 'client' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {selectedCustomer.role === 'client' ? 'Active' : 'Suspended'}
                  </span>
                  <span className="text-[10px] text-[#000000]/40 uppercase tracking-wider">Joined {new Date(selectedCustomer.createdat || selectedCustomer.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8 text-sm">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#000000]/50">Phone</p>
                  <p>{selectedCustomer.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#000000]/50">Date of Birth</p>
                  <p>{selectedCustomer.dateOfBirth ? new Date(selectedCustomer.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#000000]/50">Gender</p>
                  <p>{selectedCustomer.gender || 'N/A'}</p>
                </div>
              </div>

              <div className="mt-auto space-y-3 pt-8 border-t border-[#000000]/10">
                <button 
                  disabled={isProcessing}
                  onClick={() => handleStatusToggle(selectedCustomer.id, selectedCustomer.role)}
                  className={`w-full py-3 text-[11px] font-bold uppercase tracking-[0.2em] border transition-colors ${selectedCustomer.role === 'client' ? 'border-yellow-600 text-yellow-700 hover:bg-yellow-50' : 'border-green-600 text-green-700 hover:bg-green-50'}`}
                >
                  {selectedCustomer.role === 'client' ? 'Suspend Account' : 'Reactivate Account'}
                </button>
                <button 
                  disabled={isProcessing}
                  onClick={() => handleDelete(selectedCustomer.id)}
                  className="w-full py-3 text-[11px] font-bold uppercase tracking-[0.2em] border border-red-600 text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>

            {/* Right Col: Orders & Details */}
            <div className="w-full md:w-2/3 p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold uppercase tracking-wider">Order History</h3>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="text-2xl text-[#000000]/50 hover:text-[#000000] transition-colors"
                >
                  &times;
                </button>
              </div>

              {customerMetrics[selectedCustomer.id]?.orders.length > 0 ? (
                <div className="space-y-4">
                  {customerMetrics[selectedCustomer.id].orders.map((order, idx) => (
                    <div key={idx} className="border border-[#000000]/10 p-4 hover:border-[#000000]/30 transition-colors">
                      <div className="flex justify-between items-start mb-3 border-b border-[#000000]/5 pb-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider mb-1">Order #{order.id.slice(0,8)}</p>
                          <p className="text-[10px] text-[#000000]/50">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">Ksh {Number(order.total).toLocaleString()}</p>
                          <span className="inline-block mt-1 px-2 py-1 text-[9px] font-bold uppercase tracking-wider bg-[#f0f0f0] text-[#1a1a1a]">
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-[#000000]/70 flex items-center gap-2">
                        <span>{order.items?.length || 0} items</span>
                        <span>•</span>
                        <span>{order.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Card'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 border border-dashed border-[#000000]/20 text-center text-sm text-[#000000]/50">
                  This customer hasn't placed any orders yet.
                </div>
              )}

              {/* Addresses section */}
              {selectedCustomer.addresses?.length > 0 && (
                <div className="mt-8 pt-8 border-t border-[#000000]/10">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Saved Addresses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCustomer.addresses.map((addr, idx) => (
                      <div key={idx} className="border border-[#000000]/10 p-4 text-xs">
                        <p className="font-bold mb-1">{addr.name}</p>
                        <p className="text-[#000000]/60">{addr.street}, {addr.city}</p>
                        <p className="text-[#000000]/60">{addr.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
