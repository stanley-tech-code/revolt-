import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';

export default function AdminOrders() {
  const { db, updateOrderStatus, processRefund } = useCms();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  // The db.orders array is populated from fetchDatabase
  const orders = db?.orders || [];

  const filteredOrders = filterStatus === 'All' 
    ? orders 
    : orders.filter(o => o.status?.toLowerCase() === filterStatus.toLowerCase());

  const handleStatusChange = async (e, orderId) => {
    const newStatus = typeof e === 'string' ? e : e.target.value;
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const existingTimeline = order.deliveryInfo?.timeline || [];
    const newTimeline = [...existingTimeline, { status: newStatus, timestamp: new Date().toISOString() }];
    const updatedDeliveryInfo = { ...order.deliveryInfo, timeline: newTimeline };

    await updateOrderStatus(orderId, newStatus, updatedDeliveryInfo);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleRefund = async (orderId, action) => {
    if (window.confirm(`Are you sure you want to ${action} this refund request?`)) {
      await processRefund(orderId, action);
      setSelectedOrder(prev => ({ ...prev, refundStatus: action === 'approve' ? 'Approved' : 'Rejected', status: action === 'approve' ? 'Refunded' : prev.status }));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in print-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 no-print">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#000000]">Orders Management</h1>
          <p className="text-sm text-[#000000]/60 mt-2">View and process incoming customer orders.</p>
        </div>
        
        <div className="flex gap-4">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-[#000000]/10 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-[#000000]"
          >
            <option value="All">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-[#000000]/10 overflow-x-auto no-print">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-[#000000]/10 bg-[#f9f9f9]">
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/60">Order ID</th>
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/60">Date</th>
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/60">Customer</th>
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/60">Total</th>
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/60">Status</th>
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/60">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-sm text-[#000000]/50">No orders found.</td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id} className="border-b border-[#000000]/5 hover:bg-[#fafafa] transition-colors">
                  <td className="py-4 px-6 text-sm font-medium">#{order.id.toString().substring(0,8).toUpperCase()}</td>
                  <td className="py-4 px-6 text-sm">{new Date(order.createdAt || order.date).toLocaleDateString()}</td>
                  <td className="py-4 px-6 text-sm">
                    <p className="font-medium">{order.deliveryInfo?.customerName || 'Guest User'}</p>
                    {order.deliveryInfo && (
                      <p className="text-[10px] text-[#000000]/60 mt-1 uppercase tracking-wider">
                        {order.deliveryInfo.street}{order.deliveryInfo.city ? `, ${order.deliveryInfo.city}` : ''}
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm font-semibold">Ksh {order.total.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <select 
                      value={order.status.toLowerCase()} 
                      onChange={(e) => handleStatusChange(e, order.id)}
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border-0 outline-none cursor-pointer
                        ${order.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${order.status.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                        ${order.status.toLowerCase() === 'shipped' ? 'bg-purple-100 text-purple-800' : ''}
                        ${order.status.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                        ${order.status.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                        ${order.status.toLowerCase() === 'refunded' ? 'bg-gray-200 text-gray-800' : ''}
                      `}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      {order.status.toLowerCase() === 'refunded' && <option value="refunded">Refunded</option>}
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#000000] border-b border-[#000000] hover:text-[#000000]/60 hover:border-[#000000]/60 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ORDER DETAILS / INVOICE MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 no-print animate-fade-in">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-[#000000]/10 sticky top-0 bg-white z-10 no-print">
              <h2 className="text-xl font-bold uppercase tracking-tight">Order Details</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-2xl text-[#000000]/50 hover:text-[#000000] transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Invoice Content (Printable Area) */}
            <div className="p-8 printable-area">
              <div className="flex justify-between items-start mb-8 pb-8 border-b border-[#000000]/10">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight uppercase mb-1">Revolt</h1>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-[#000000]/50">Invoice / Packing Slip</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold uppercase tracking-wider">Order #{selectedOrder.id.toString().substring(0,8).toUpperCase()}</p>
                  <p className="text-sm text-[#000000]/60 mt-1">{new Date(selectedOrder.createdAt || selectedOrder.date).toLocaleString()}</p>
                  <div className="mt-2 inline-block">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]/50 mr-2">Status:</span>
                    <span className="px-2 py-1 bg-[#f5f5f5] text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/50 mb-3">Customer Information</h3>
                  <p className="text-sm font-medium">{selectedOrder.deliveryInfo?.customerName || 'Guest User'}</p>
                  <p className="text-sm text-[#000000]/70 mt-1">Email: {selectedOrder.deliveryInfo?.customerEmail || 'Not provided'}</p>
                  <p className="text-sm text-[#000000]/70 mt-1">Phone: {selectedOrder.deliveryInfo?.customerPhone || 'Not provided'}</p>
                </div>
                {selectedOrder.deliveryInfo && (
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/50 mb-3">Shipping Address</h3>
                    <p className="text-sm text-[#000000]/70">
                      {selectedOrder.deliveryInfo.street}<br/>
                      {selectedOrder.deliveryInfo.apartment && <>{selectedOrder.deliveryInfo.apartment}<br/></>}
                      {selectedOrder.deliveryInfo.city}, {selectedOrder.deliveryInfo.zip}<br/>
                      {selectedOrder.deliveryInfo.country}
                    </p>
                  </div>
                )}
              </div>

              {/* Fit profile removed */}

              <div className="mb-8">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/50 mb-3">Order Timeline</h3>
                
                {/* Timeline UI (Printable) */}
                <div className="border border-[#000000]/10 p-4 mb-4 bg-[#f9f9f9]">
                  {selectedOrder.deliveryInfo?.timeline && selectedOrder.deliveryInfo.timeline.length > 0 ? (
                    <div className="relative border-l border-[#000000]/20 ml-3 pl-6 space-y-6">
                      {selectedOrder.deliveryInfo.timeline.map((event, idx) => (
                        <div key={idx} className="relative">
                          <span className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full bg-[#000000] border-2 border-[#f9f9f9]"></span>
                          <p className="font-bold uppercase tracking-wider text-xs text-[#000000]">{event.status}</p>
                          <p className="text-[10px] text-[#000000]/50 uppercase tracking-widest mt-1">{new Date(event.timestamp).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#000000]/50 italic">No timeline history recorded.</p>
                  )}
                </div>

                {/* Status Update Controls (No Print) */}
                <div className="no-print">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/50 mb-2">Update Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Pending', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          handleStatusChange(status, selectedOrder.id);
                          setSelectedOrder(prev => {
                            const newTimeline = [...(prev.deliveryInfo?.timeline || []), { status, timestamp: new Date().toISOString() }];
                            return { ...prev, status, deliveryInfo: { ...prev.deliveryInfo, timeline: newTimeline } };
                          });
                        }}
                        disabled={selectedOrder.status.toLowerCase() === status.toLowerCase()}
                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 ${
                          selectedOrder.status.toLowerCase() === status.toLowerCase()
                            ? 'bg-[#000000] text-white border-[#000000] cursor-default shadow-md'
                            : 'bg-white text-[#000000] border-[#000000]/20 hover:border-[#000000] hover:bg-[#f5f5f5]'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/50 mb-3">Order Items</h3>
                <div className="border border-[#000000]/10 rounded-sm">
                  {selectedOrder.items && Array.isArray(selectedOrder.items) ? (
                    <table className="w-full text-left">
                      <thead className="bg-[#f9f9f9]">
                        <tr>
                          <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60">Item</th>
                          <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60">Price (Each)</th>
                          <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60 text-center">Quantity</th>
                          <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, idx) => (
                          <tr key={idx} className="border-t border-[#000000]/10">
                            <td className="py-3 px-4 text-sm flex items-center gap-3">
                              {item.image && <img src={item.image} alt={item.name} className="w-10 h-12 object-cover" />}
                              <div>
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-xs text-[#000000]/60">Size: {item.size} | Color: {item.color}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm">Ksh {(item.salePrice || item.originalPrice || item.price || 0).toLocaleString()}</td>
                            <td className="py-3 px-4 text-sm text-center">{item.quantity || 1}</td>
                            <td className="py-3 px-4 text-sm text-right">Ksh {((item.salePrice || item.originalPrice || item.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-4 text-sm text-[#000000]/70">
                      {selectedOrder.items || 'No item details available.'}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <div className="w-1/2">
                  <div className="flex justify-between py-2 text-sm border-b border-[#000000]/5">
                    <span className="text-[#000000]/60">Subtotal</span>
                    <span>Ksh {selectedOrder.subtotal?.toLocaleString() || selectedOrder.total.toLocaleString()}</span>
                  </div>
                  {selectedOrder.deliveryInfo?.appliedPromo && (
                    <div className="flex justify-between py-2 text-sm border-b border-[#000000]/5 text-green-600">
                      <span>Promo ({selectedOrder.deliveryInfo.appliedPromo.code})</span>
                      <span>-Ksh {selectedOrder.deliveryInfo.discount?.toLocaleString() || 0}</span>
                    </div>
                  )}
                  {selectedOrder.deliveryFee !== undefined && (
                    <div className="flex justify-between py-2 text-sm border-b border-[#000000]/5">
                      <span className="text-[#000000]/60">Shipping</span>
                      <span>Ksh {selectedOrder.deliveryFee.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 text-base font-bold uppercase tracking-wider">
                    <span>Total</span>
                    <span>Ksh {(selectedOrder.total - (selectedOrder.tax || 0)).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions (No Print) */}
            <div className="p-6 bg-[#f9f9f9] border-t border-[#000000]/10 flex justify-between items-center no-print">
              <div className="flex gap-4">
                {selectedOrder.refundStatus === 'Pending' ? (
                  <>
                    <button 
                      onClick={() => handleRefund(selectedOrder.id, 'approve')}
                      className="px-4 py-2 bg-green-600 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-green-700 transition-colors"
                    >
                      Approve Refund
                    </button>
                    <button 
                      onClick={() => handleRefund(selectedOrder.id, 'reject')}
                      className="px-4 py-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-red-700 transition-colors"
                    >
                      Reject Refund
                    </button>
                  </>
                ) : selectedOrder.refundStatus ? (
                  <span className="text-sm font-bold uppercase tracking-wider px-3 py-1 bg-gray-200">
                    Refund {selectedOrder.refundStatus}
                  </span>
                ) : (
                  <span className="text-xs text-[#000000]/50 italic">No refund requested</span>
                )}
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={handlePrintInvoice}
                  className="px-6 py-2 border border-[#000000] text-[#000000] text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-[#000000] hover:text-white transition-colors"
                >
                  Print Invoice
                </button>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 bg-[#000000] text-white text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-[#000000]/80 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
