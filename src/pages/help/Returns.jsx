import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Returns() {
  const [activeTab, setActiveTab] = useState('policy'); // 'policy' | 'request'
  const [formState, setFormState] = useState('idle'); // 'idle' | 'submitting' | 'success'

  const [formData, setFormData] = useState({
    orderNumber: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    productName: '',
    reason: '',
    resolution: 'exchange',
    image: null
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState('submitting');
    // Simulate API call
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  const generateReturnCode = () => {
    return 'RET-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  return (
    <main className="bg-canvas min-h-screen text-ink pb-20 pt-10">
      <section className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">Returns & Exchanges</h1>
          <p className="text-cocoa text-sm md:text-base max-w-lg mx-auto">
            Your satisfaction is our priority. We've made our return process simple, fast, and hassle-free.
          </p>
        </div>

        {/* TABS */}
        <div className="flex border-b border-ink/10 mb-10">
          <button
            onClick={() => setActiveTab('policy')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'policy' ? 'border-b-2 border-ink text-ink' : 'text-ink/50 hover:text-ink/80'
            }`}
          >
            Return Policy
          </button>
          <button
            onClick={() => setActiveTab('request')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'request' ? 'border-b-2 border-ink text-ink' : 'text-ink/50 hover:text-ink/80'
            }`}
          >
            Request a Return
          </button>
        </div>

        {/* POLICY TAB */}
        {activeTab === 'policy' && (
          <div className="animate-fade-in space-y-8 bg-white p-8 md:p-12 shadow-sm rounded-sm">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-lg font-bold uppercase mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-ink rounded-full"></span> The Basics
                </h3>
                <ul className="space-y-3 text-sm text-ink/80">
                  <li><strong className="text-ink">Window:</strong> 14 days from delivery date.</li>
                  <li><strong className="text-ink">Condition:</strong> Items must be unworn, unwashed, with tags still attached and in original packaging.</li>
                  <li><strong className="text-ink">Not Eligible:</strong> Sale items, used items, swimwear, and underwear for hygiene reasons.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold uppercase mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-ink rounded-full"></span> The Process
                </h3>
                <ul className="space-y-3 text-sm text-ink/80">
                  <li><strong className="text-ink">Approval:</strong> Required. Please submit a request or contact us via WhatsApp. Image proof is required for damaged/wrong items.</li>
                  <li><strong className="text-ink">Shipping:</strong> Customer is responsible for return shipping costs unless the error was ours.</li>
                  <li><strong className="text-ink">Timeframe:</strong> Processed within 3–7 days after we receive and inspect the item.</li>
                </ul>
              </div>
            </div>

            <div className="bg-sand p-6 mt-8 rounded-sm">
              <h3 className="text-md font-bold uppercase mb-3">Exchanges & Store Credit</h3>
              <p className="text-sm text-ink/80 leading-relaxed mb-4">
                We encourage exchanges to ensure you get the perfect fit! Opt for <strong>Store Credit</strong> instead of a refund and receive a <strong>+10% value bonus</strong> to use on your next order.
              </p>
              <div className="flex flex-wrap gap-4 text-sm font-semibold">
                <span className="bg-white px-3 py-1 border border-ink/10">Wallet</span>
                <span className="bg-white px-3 py-1 border border-ink/10">M-Pesa</span>
                <span className="bg-white px-3 py-1 border border-ink/10">Bank Transfer</span>
                <span className="bg-ink text-white px-3 py-1">Store Credit (+10%)</span>
              </div>
            </div>

            <div className="text-center pt-6">
              <a 
                href="https://wa.me/254700000000?text=Hi,%20I%20want%20to%20return%20Order%20%23" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 font-bold uppercase text-sm tracking-wider hover:bg-[#1ebe5d] transition-colors rounded-sm shadow-md"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                Request Return via WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* REQUEST RETURN FORM */}
        {activeTab === 'request' && formState === 'idle' && (
          <div className="animate-fade-in bg-white p-8 md:p-12 shadow-sm rounded-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">Order Number *</label>
                  <input required type="text" name="orderNumber" value={formData.orderNumber} onChange={handleInputChange} placeholder="e.g. #12345" className="w-full p-3 border border-ink/20 focus:border-ink outline-none bg-canvas/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">Full Name *</label>
                  <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full p-3 border border-ink/20 focus:border-ink outline-none bg-canvas/50" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">Phone Number (For WhatsApp) *</label>
                  <input required type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="+254..." className="w-full p-3 border border-ink/20 focus:border-ink outline-none bg-canvas/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-3 border border-ink/20 focus:border-ink outline-none bg-canvas/50" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Product Name *</label>
                <input required type="text" name="productName" value={formData.productName} onChange={handleInputChange} className="w-full p-3 border border-ink/20 focus:border-ink outline-none bg-canvas/50" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">Reason for Return *</label>
                  <select required name="reason" value={formData.reason} onChange={handleInputChange} className="w-full p-3 border border-ink/20 focus:border-ink outline-none bg-canvas/50 appearance-none">
                    <option value="" disabled>Select a reason...</option>
                    <option value="Wrong size">Wrong size</option>
                    <option value="Damaged item">Damaged item</option>
                    <option value="Wrong item delivered">Wrong item delivered</option>
                    <option value="Not satisfied">Not satisfied</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">Upload Image Proof * (Very Important)</label>
                  <input required type="file" name="image" accept="image/*" onChange={handleInputChange} className="w-full p-2 border border-ink/20 focus:border-ink outline-none bg-canvas/50 text-sm file:mr-4 file:py-1 file:px-4 file:border-0 file:text-xs file:font-bold file:uppercase file:bg-ink file:text-white hover:file:bg-ink/80" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-4">Preferred Resolution *</label>
                <div className="grid md:grid-cols-3 gap-4">
                  <label className={`cursor-pointer border p-4 text-center transition-all ${formData.resolution === 'exchange' ? 'border-ink bg-ink text-white' : 'border-ink/20 hover:border-ink'}`}>
                    <input type="radio" name="resolution" value="exchange" checked={formData.resolution === 'exchange'} onChange={handleInputChange} className="hidden" />
                    <span className="block font-bold uppercase text-sm mb-1">Exchange</span>
                    <span className="text-xs opacity-80">Swap for another size/color</span>
                  </label>
                  <label className={`cursor-pointer border p-4 text-center transition-all ${formData.resolution === 'store_credit' ? 'border-ink bg-ink text-white' : 'border-ink/20 hover:border-ink'}`}>
                    <input type="radio" name="resolution" value="store_credit" checked={formData.resolution === 'store_credit'} onChange={handleInputChange} className="hidden" />
                    <span className="block font-bold uppercase text-sm mb-1">Store Credit</span>
                    <span className="text-xs opacity-80 font-bold text-green-500">+10% Bonus Value!</span>
                  </label>
                  <label className={`cursor-pointer border p-4 text-center transition-all ${formData.resolution === 'refund' ? 'border-ink bg-ink text-white' : 'border-ink/20 hover:border-ink'}`}>
                    <input type="radio" name="resolution" value="refund" checked={formData.resolution === 'refund'} onChange={handleInputChange} className="hidden" />
                    <span className="block font-bold uppercase text-sm mb-1">Refund</span>
                    <span className="text-xs opacity-80">Return to original method</span>
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-ink text-white py-4 font-bold uppercase tracking-widest text-sm hover:bg-ink/80 transition-colors">
                  Submit Return Request
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LOADING STATE */}
        {formState === 'submitting' && (
          <div className="animate-fade-in bg-white p-12 shadow-sm rounded-sm text-center py-24">
            <div className="inline-block w-12 h-12 border-4 border-ink/20 border-t-ink rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-bold uppercase tracking-wider">Processing Request...</h3>
          </div>
        )}

        {/* SUCCESS INSTRUCTIONS STATE */}
        {formState === 'success' && (
          <div className="animate-fade-in bg-white p-8 md:p-12 shadow-sm rounded-sm border-t-4 border-green-500">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">Request Received!</h2>
              <p className="text-ink/70">We've sent a confirmation message to your WhatsApp/Email.</p>
            </div>

            <div className="bg-sand p-6 rounded-sm mb-8">
              <div className="flex justify-between items-center border-b border-ink/10 pb-4 mb-4">
                <span className="text-sm font-bold uppercase text-ink/70">Return Reference</span>
                <span className="text-lg font-bold tracking-widest">{generateReturnCode()}</span>
              </div>
              <p className="text-xs text-ink/60 uppercase tracking-wider text-center">
                Please write this code clearly on your return package.
              </p>
            </div>

            <h3 className="text-lg font-bold uppercase mb-4">Next Steps (Once Approved)</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center flex-shrink-0 font-bold">1</div>
                <div>
                  <h4 className="font-bold">Wait for Approval</h4>
                  <p className="text-sm text-ink/70">Our team will review your request within 24 hours. You will receive an update via WhatsApp.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center flex-shrink-0 font-bold">2</div>
                <div>
                  <h4 className="font-bold">Package Carefully</h4>
                  <p className="text-sm text-ink/70">Ensure items are unworn with tags on. Include the Return Reference code on the outside of the box.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center flex-shrink-0 font-bold">3</div>
                <div>
                  <h4 className="font-bold">Send it Back</h4>
                  <p className="text-sm text-ink/70">Drop off the package at our Nairobi CBD store or use your preferred courier service. Deadline: 7 days after approval.</p>
                </div>
              </li>
            </ul>

            <div className="text-center">
              <button onClick={() => setFormState('idle')} className="text-xs font-bold uppercase tracking-[0.2em] border-b border-ink pb-1 hover:text-cocoa transition-colors">
                Submit Another Request
              </button>
            </div>
          </div>
        )}

      </section>
    </main>
  );
}
