import React, { useState, useMemo } from 'react';
import { useCms } from '../../context/CmsContext';

function formatRelativeTime(date) {
  if (!date) return 'Unknown';
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes !== 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hr${diffInHours !== 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} mo${diffInMonths !== 1 ? 's' : ''} ago`;
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} yr${diffInYears !== 1 ? 's' : ''} ago`;
}

export default function AdminCarts() {
  const { db, sendNotification, fetchDatabase } = useCms();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Carts');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [promoMessage, setPromoMessage] = useState('');
  const [sendingPromo, setSendingPromo] = useState(false);

  const customers = db?.customers || [];
  const orders = db?.orders || [];

  const customerCartData = useMemo(() => {
    return customers.map(customer => {
      const custOrders = orders.filter(o => o.userId === customer.id || o.customer === customer.fullName);
      
      // Sort orders by newest first
      custOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      const lastOrderDate = custOrders.length > 0 ? new Date(custOrders[0].createdAt) : null;
      const totalSpent = custOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
      
      const cartItems = Array.isArray(customer.cart) ? customer.cart : [];
      const cartValue = cartItems.reduce((sum, item) => {
        const price = item.price || item.salePrice || item.originalPrice || 0;
        return sum + (price * (item.quantity || 1));
      }, 0);

      const twoHoursAgo = new Date();
      twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

      // Active: Cart was updated within the last 2 hours. Abandoned: Cart updated more than 2 hours ago.
      const cartUpdateDate = customer.cartUpdatedAt ? new Date(customer.cartUpdatedAt) : new Date(0);
      const isActive = cartUpdateDate > twoHoursAgo;
      const isAbandoned = cartItems.length > 0 && !isActive;

      // Last Activity: max of lastOrderDate, cartUpdatedAt, or createdat
      const datesToCompare = [new Date(customer.createdat || customer.createdAt)];
      if (lastOrderDate) datesToCompare.push(lastOrderDate);
      if (customer.cartUpdatedAt) datesToCompare.push(new Date(customer.cartUpdatedAt));
      
      const lastActivityDate = new Date(Math.max(...datesToCompare.map(d => d.getTime())));

      return {
        ...customer,
        orderCount: custOrders.length,
        totalSpent,
        lastOrderDate,
        cartItems,
        cartValue,
        isAbandoned,
        lastActivityDate,
        recentOrders: custOrders.slice(0, 3)
      };
    });
  }, [customers, orders]);

  const filteredCarts = useMemo(() => {
    let result = customerCartData.filter(customer => {
      const matchesSearch = customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // We only care about users who actually have something in their cart
      if (customer.cartItems.length === 0) return false;

      if (filterStatus === 'Abandoned Carts Only') return matchesSearch && customer.isAbandoned;
      if (filterStatus === 'Active Carts') return matchesSearch && !customer.isAbandoned;
      return matchesSearch;
    });

    // Sort by cart value high to low
    result.sort((a, b) => b.cartValue - a.cartValue);

    return result;
  }, [customerCartData, searchTerm, filterStatus]);

  const handleSendPromo = async (channel) => {
    if (!selectedCustomer) return;
    setSendingPromo(true);
    
    try {
      await sendNotification(
        selectedCustomer.fullName,
        selectedCustomer.phone,
        channel,
        'CART_RECOVERY_PROMO',
        promoMessage || 'Complete your purchase now and get 10% off your entire cart!',
        'Cart Recovery'
      );
      alert(`Successfully sent ${channel} to ${selectedCustomer.fullName}!`);
      setPromoMessage('');
    } catch(e) {
      alert(`Failed to send ${channel}.`);
    } finally {
      setSendingPromo(false);
    }
  };

  return (
    <div className="p-4 md:p-8 pb-32 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#000000]/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">Cart Management</h1>
          <p className="text-xs tracking-[0.2em] uppercase text-[#000000]/50 mt-2">Track Active and Abandoned Carts</p>
        </div>
        <div className="flex items-center gap-6 text-left sm:text-right">
          <button 
            onClick={() => fetchDatabase ? fetchDatabase(true) : window.location.reload()}
            className="text-[10px] font-bold uppercase tracking-wider underline text-[#000000]/60 hover:text-black transition-colors"
          >
            Refresh Data
          </button>
          <div>
            <p className="text-sm font-bold">{customerCartData.filter(c => c.isAbandoned).length}</p>
            <p className="text-[10px] uppercase tracking-wider text-red-600 font-bold mt-1">Total Abandoned Carts</p>
          </div>
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
              <option value="All Carts">All Carts</option>
              <option value="Abandoned Carts Only">Abandoned Carts Only</option>
              <option value="Active Carts">Active Carts</option>
            </select>
          </div>
        </div>

        {/* Carts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f9f9f9] border-b border-[#000000]/10">
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60">Customer</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60">Cart Value</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60 text-right">Items</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60 text-center">Status</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60 text-right">Last Activity</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCarts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-sm text-[#000000]/50">No carts matching your filters.</td>
                </tr>
              ) : (
                filteredCarts.map((customer) => (
                  <tr key={customer.id} className="border-b border-[#000000]/5 hover:bg-[#fcfcfc] transition-colors group cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                    <td className="py-4 px-6">
                      <p className="font-bold text-sm">{customer.fullName}</p>
                      <p className="text-xs text-[#000000]/60">{customer.email}</p>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium">
                      Ksh {customer.cartValue.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-sm text-right font-medium">
                      {customer.cartItems.length}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${customer.isAbandoned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {customer.isAbandoned ? 'Abandoned' : 'Active'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-right">
                      {formatRelativeTime(customer.lastActivityDate)}
                    </td>
                    <td className="py-4 px-6 text-right" onClick={e => e.stopPropagation()}>
                      <button 
                        onClick={() => setSelectedCustomer(customer)}
                        className="text-xs font-bold uppercase tracking-wider hover:underline text-[#000000]/60 hover:text-[#000000]"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CART DETAILS & RECOVERY */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row">
            
            {/* Left Col: Customer & Order Details */}
            <div className="w-full md:w-1/3 border-r border-[#000000]/10 bg-[#fcfcfc] p-8 flex flex-col">
              <div className="mb-8">
                <h2 className="text-xl font-bold uppercase tracking-tight">{selectedCustomer.fullName}</h2>
                <p className="text-sm text-[#000000]/60">{selectedCustomer.email}</p>
                <p className="text-sm text-[#000000]/60 mt-1">{selectedCustomer.phone || 'No phone provided'}</p>
                <div className="mt-4 text-[10px] font-bold uppercase tracking-wider text-[#000000]/50 space-y-2">
                  <p>Registered: {new Date(selectedCustomer.createdat || selectedCustomer.createdAt).toLocaleDateString()}</p>
                  <p>Total Orders: {selectedCustomer.orderCount}</p>
                  <p>Total Spent: Ksh {selectedCustomer.totalSpent.toLocaleString()}</p>
                  <p>Last Activity: {formatRelativeTime(selectedCustomer.lastActivityDate)}</p>
                </div>
              </div>

              {/* Recovery Actions */}
              {selectedCustomer.isAbandoned && (
                <div className="mt-auto pt-6 border-t border-[#000000]/10 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Cart Recovery Actions</h3>
                  <textarea 
                    placeholder="Enter custom promo message..."
                    value={promoMessage}
                    onChange={(e) => setPromoMessage(e.target.value)}
                    className="w-full text-xs p-2 border border-[#000000]/20 focus:outline-none focus:border-black resize-none"
                    rows="3"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleSendPromo('Email')}
                      disabled={sendingPromo}
                      className="flex-1 py-2 text-[10px] font-bold uppercase tracking-wider bg-black text-white hover:bg-black/80 transition-colors"
                    >
                      Email
                    </button>
                    {selectedCustomer.phone && (
                      <button 
                        onClick={() => handleSendPromo('SMS')}
                        disabled={sendingPromo}
                        className="flex-1 py-2 text-[10px] font-bold uppercase tracking-wider border border-black hover:bg-black/5 transition-colors"
                      >
                        SMS
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Cart Contents & Recent Orders */}
            <div className="w-full md:w-2/3 p-8 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold uppercase tracking-wider">
                  Current Cart <span className="text-sm font-normal normal-case text-gray-500">(Ksh {selectedCustomer.cartValue.toLocaleString()})</span>
                </h3>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="text-2xl text-[#000000]/50 hover:text-[#000000] transition-colors"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                {selectedCustomer.cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 border border-[#000000]/10 p-3 bg-white">
                    <div className="w-16 h-16 bg-gray-100 shrink-0">
                      {(item.primaryImage || item.image) && (
                        <img src={item.primaryImage || item.image} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-xs font-bold uppercase tracking-wider">{item.name}</p>
                      <div className="text-[10px] text-gray-500 mt-1 flex gap-3">
                        {(item.color || item.selectedColor) && <span>Color: {item.color || item.selectedColor}</span>}
                        {(item.size || item.selectedSize) && <span>Size: {item.size || item.selectedSize}</span>}
                        <span>Qty: {item.quantity || 1}</span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-center">
                      <p className="text-xs font-bold">Ksh {((item.price || item.salePrice || item.originalPrice || 0) * (item.quantity || 1)).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order History Summary */}
              {selectedCustomer.recentOrders.length > 0 && (
                <div className="mt-8 pt-6 border-t border-[#000000]/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-4">Recent Order History</h3>
                  <div className="space-y-3">
                    {selectedCustomer.recentOrders.map(order => (
                      <div key={order.id} className="flex justify-between items-center text-xs p-3 bg-gray-50 border border-gray-100">
                        <div>
                          <p className="font-bold">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">Ksh {Number(order.total).toLocaleString()}</p>
                          <p className="text-[10px] uppercase tracking-wider mt-1 text-gray-600">{order.status}</p>
                        </div>
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
