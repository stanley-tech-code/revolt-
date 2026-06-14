import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const STAGES = ['Processing', 'Packed', 'Shipped', 'Delivered'];

export default function OrderTracking() {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    const cleanId = orderIdInput.replace(/[^a-zA-Z0-9-]/g, '').trim();
    if (!cleanId) return;
    
    setLoading(true);
    setError('');
    setOrderData(null);
    
    try {
      const res = await fetch(`/api/track-order/${cleanId}`);
      if (!res.ok && res.status !== 404 && res.status !== 500) {
        // If it's a 404 from proxy or similar
        const text = await res.text();
        try {
           const data = JSON.parse(text);
           if (!data.success) throw new Error(data.error);
        } catch(e) {
           throw new Error('Network error. Please try again later.');
        }
      }
      
      const data = await res.json();
      
      if (data.success) {
        setOrderData(data.order);
      } else {
        setError(data.error || 'Order not found.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (index, currentStatus) => {
    const currentIndex = STAGES.findIndex(s => s.toLowerCase() === currentStatus?.toLowerCase());
    
    // If order is cancelled, we might want to handle it, but per req we just show standard flow.
    // If pending, currentIndex is -1, so all are future.
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'active';
    return 'future';
  };

  const getTimestamp = (stage) => {
    if (!orderData?.deliveryInfo?.timeline) return null;
    const match = orderData.deliveryInfo.timeline.find(t => t.status.toLowerCase() === stage.toLowerCase());
    if (!match) return null;
    return new Date(match.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const renderTimeline = () => {
    if (!orderData) return null;
    const currentStatus = orderData.status;
    const currentIndex = STAGES.findIndex(s => s.toLowerCase() === currentStatus?.toLowerCase());
    
    // Calculate progress percentage
    let progressPercent = 0;
    if (currentIndex >= 0) {
      progressPercent = (currentIndex / (STAGES.length - 1)) * 100;
    }

    const isDelivered = currentStatus?.toLowerCase() === 'delivered';

    return (
      <div className="w-full max-w-4xl mx-auto mt-16 animate-fade-in">
        
        {isDelivered && (
          <div className="mb-12 p-6 bg-green-50 border border-green-200 rounded-2xl shadow-sm text-center transform transition-all duration-500 scale-100">
            <h2 className="text-xl md:text-2xl font-bold text-green-800 tracking-tight">Your package has been delivered successfully Ô£¿</h2>
            <p className="text-green-600 mt-2 text-sm">Thank you for shopping with Revolt.</p>
          </div>
        )}

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative">
          <div className="mb-10 flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-gray-100 pb-6">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Order Number</h3>
              <p className="text-2xl font-semibold text-gray-900 tracking-tight">#{orderData.id.substring(0,8).toUpperCase()}</p>
            </div>
            <div className="md:text-right">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Order Date</h3>
              <p className="text-sm font-medium text-gray-900">{new Date(orderData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          {/* Desktop & Mobile Timeline Container */}
          <div className="relative">
            {/* Background Track (Desktop Horizontal, Mobile Vertical) */}
            <div className="absolute top-0 bottom-0 left-6 md:left-0 md:right-0 md:top-6 md:bottom-auto w-[2px] md:w-full md:h-[2px] bg-gray-100 rounded-full z-0"></div>
            
            {/* Progress Fill */}
            <div 
              className="absolute top-0 left-6 md:left-0 md:top-6 w-[2px] md:h-[2px] bg-black rounded-full z-0 transition-all duration-1000 ease-[cubic-bezier(0.65,0,0.35,1)]"
              style={{
                height: window.innerWidth < 768 ? `${progressPercent}%` : '2px',
                width: window.innerWidth >= 768 ? `${progressPercent}%` : '2px'
              }}
            ></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between gap-12 md:gap-4">
              {STAGES.map((stage, index) => {
                const status = getStepStatus(index, currentStatus);
                const timestamp = getTimestamp(stage);
                
                return (
                  <div key={stage} className="flex md:flex-col items-start md:items-center relative group w-full">
                    {/* Status Icon/Dot */}
                    <div className={`
                      flex items-center justify-center w-12 h-12 md:w-12 md:h-12 rounded-full border-[3px] bg-white transition-all duration-500 flex-shrink-0
                      ${status === 'completed' ? 'border-black text-black' : ''}
                      ${status === 'active' ? 'border-black text-white bg-black scale-110 shadow-lg' : ''}
                      ${status === 'future' ? 'border-gray-200 text-gray-300' : ''}
                    `}>
                      {status === 'completed' && (
                        <svg className="w-5 h-5 animate-scale-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {status === 'active' && (
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      )}
                      {status === 'future' && (
                        <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                      )}
                    </div>

                    {/* Active Pulse Ring */}
                    {status === 'active' && (
                      <div className="absolute left-0 top-0 md:left-1/2 md:-translate-x-1/2 w-12 h-12 rounded-full border-2 border-black/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                    )}

                    {/* Text Content */}
                    <div className="ml-6 md:ml-0 md:mt-6 md:text-center w-full">
                      <h4 className={`text-base font-bold tracking-tight transition-colors duration-300 ${
                        status === 'future' ? 'text-gray-400' : 'text-gray-900'
                      }`}>
                        {stage}
                      </h4>
                      
                      <div className={`h-8 mt-1 transition-opacity duration-300 ${status === 'future' ? 'opacity-0' : 'opacity-100'}`}>
                        {timestamp ? (
                          <span className="text-xs text-gray-500 font-medium">{timestamp}</span>
                        ) : (
                          status === 'active' && <span className="text-xs text-black font-semibold uppercase tracking-wider animate-pulse">In Progress</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="bg-[#fafafa] min-h-screen pt-32 pb-24">
      <section className="px-6">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 mb-4">Track Order</h1>
          <p className="text-gray-500 mb-10 text-sm md:text-base">Enter your order number to see the latest updates on your shipment.</p>
          
          <form onSubmit={handleTrack} className="relative flex items-center shadow-[0_4px_20px_rgb(0,0,0,0.04)] rounded-full bg-white overflow-hidden border border-gray-100 p-2">
            <input 
              type="text" 
              placeholder="e.g. 8A3F9D2C" 
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              className="w-full px-6 py-4 outline-none text-sm font-medium tracking-wider uppercase placeholder:text-gray-300 placeholder:normal-case"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-black text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-70 whitespace-nowrap"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {error && (
            <p className="mt-6 text-red-500 text-sm font-medium animate-fade-in">{error}</p>
          )}
        </div>

        {renderTimeline()}

        {!orderData && !loading && !error && (
           <div className="text-center mt-20 opacity-50">
             <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Need help?</p>
             <Link to="/help/contact" className="text-sm font-medium border-b border-gray-300 pb-0.5 mt-2 inline-block hover:text-black hover:border-black transition-colors">Contact Support</Link>
           </div>
        )}
      </section>

      {/* Global animations for timeline */}
      <style>{`
        @keyframes scale-in {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </main>
  );
}
