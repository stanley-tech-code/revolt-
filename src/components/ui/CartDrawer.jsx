import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

export default function CartDrawer() {
  const { isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity, getCartTotal } = useStore();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 z-[9998] transition-opacity backdrop-blur-sm"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-[400px] max-w-[100vw] bg-white z-[9999] shadow-2xl flex flex-col font-sans animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-[13px] font-bold tracking-[0.1em] uppercase">Your Cart ({cartItems.length})</h2>
          <button onClick={closeCart} className="p-2 hover:opacity-50">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {cartItems.length === 0 ? (
            <p className="text-[13px] text-gray-500 text-center mt-10">Your cart is currently empty.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="flex gap-4">
                <div className="w-[100px] h-[130px] bg-gray-100 flex-shrink-0">
                  <img src={item.image || "/images/product-1.webp"} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] leading-tight">{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-[10px] uppercase text-gray-400 hover:text-black tracking-wider">Remove</button>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1 capitalize">Color: {item.color} | Size: {item.size}</div>
                  
                  <div className="mt-auto flex justify-between items-end">
                    <div className="flex items-center border border-gray-200">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50">-</button>
                      <span className="text-[11px] w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50">+</button>
                    </div>
                    <div className="text-[12px] font-bold">Ksh {(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col gap-4">
            <div className="flex justify-between items-center text-[13px] font-bold uppercase tracking-wider">
              <span>Subtotal</span>
              <span>Ksh {getCartTotal().toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-gray-500">Shipping & taxes calculated at checkout</p>
            <button className="w-full bg-black text-white py-4 text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-gray-800 transition-colors" onClick={() => { closeCart(); navigate('/checkout'); }}>
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
