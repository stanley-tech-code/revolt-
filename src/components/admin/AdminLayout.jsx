import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useCms } from '../../context/CmsContext';

export default function AdminLayout() {
  const { db, logoutAdmin, successNotification, errorNotification } = useCms();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const currentUser = db?.admin?.currentUser;

  React.useEffect(() => {
    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem('REVOLT_ADMIN_JWT_TOKEN') || localStorage.getItem('token');
        const res = await fetch('/api/messages', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const unread = data.messages?.filter(m => m.status === 'new').length || 0;
          setUnreadMessagesCount(unread);
        }
      } catch (e) {}
    };
    if (currentUser) {
      fetchUnread();
      // Optional: poll every 30 seconds for real-time feel
      const interval = setInterval(fetchUnread, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', roles: ['Super Admin', 'Editor', 'Marketing', 'Fulfillment', 'Support'] },
    { name: 'Analytics', path: '/admin/analytics', roles: ['Super Admin', 'Editor', 'Marketing'] },
    { name: 'Products', path: '/admin/products', roles: ['Super Admin', 'Editor', 'Fulfillment'] },
    { name: 'Orders', path: '/admin/orders', roles: ['Super Admin', 'Editor', 'Fulfillment', 'Support'] },
    { name: 'Returns', path: '/admin/returns', roles: ['Super Admin', 'Editor', 'Fulfillment', 'Support'] },
    { name: 'Customers', path: '/admin/customers', roles: ['Super Admin', 'Editor', 'Support', 'Marketing'] },
    { name: 'Finance', path: '/admin/finance', roles: ['Super Admin'] },
    { name: 'Promotions', path: '/admin/promotions', roles: ['Super Admin', 'Marketing'] },
    { name: 'Content & Appearance', path: '/admin/content', roles: ['Super Admin', 'Editor'] },
    { name: 'Customer Messages', path: '/admin/messages', roles: ['Super Admin', 'Support', 'Editor', 'Marketing', 'Fulfillment'] },
    { name: 'Notifications & CRM', path: '/admin/notifications', roles: ['Super Admin', 'Editor', 'Marketing', 'Support'] },
    { name: 'Twilio Settings', path: '/admin/twilio', roles: ['Super Admin'] },
    { name: 'Settings', path: '/admin/settings', roles: ['Super Admin'] },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#000000] flex flex-col md:flex-row relative">
      {/* NOTIFICATIONS */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] flex flex-col gap-2 w-full max-w-md px-4 pointer-events-none">
        {successNotification && (
          <div className="bg-green-600 text-white px-6 py-3 shadow-2xl animate-fade-in text-center text-xs font-bold uppercase tracking-wider">
            {successNotification}
          </div>
        )}
        {errorNotification && (
          <div className="bg-red-600 text-white px-6 py-3 shadow-2xl animate-fade-in text-center text-xs font-bold uppercase tracking-wider">
            {errorNotification}
          </div>
        )}
      </div>
      {/* MOBILE DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[998] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR (Desktop Fixed, Mobile Sliding) */}
      <aside className={`fixed inset-y-0 left-0 z-[999] w-64 bg-white border-r border-[#000000]/10 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-[#000000]/10 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase">Revolt <span className="text-[10px] bg-red-600 text-white px-1 py-0.5 rounded ml-1 align-top">v2.1</span></h1>
            <p className="text-[9px] tracking-[0.2em] uppercase text-[#000000]/50 mt-1">Workspace</p>
          </div>
          <button className="md:hidden text-2xl" onClick={() => setIsMobileMenuOpen(false)}>&times;</button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            if (item.roles && !item.roles.includes(currentUser?.role)) {
              // Special case: if role doesn't match but it's Messages, we'll force it visible for now
              if (item.name !== 'Customer Messages') return null;
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive 
                      ? 'bg-[#000000] text-white' 
                      : 'text-[#000000]/60 hover:bg-[#000000]/5 hover:text-[#000000]'
                  }`
                }
              >
                <span>{item.name}</span>
                {item.name === 'Customer Messages' && unreadMessagesCount > 0 && (
                  <span className="bg-red-600 text-white text-[9px] px-2 py-0.5 rounded-full">
                    {unreadMessagesCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-6 border-t border-[#000000]/10 space-y-4">
          <div className="text-xs">
            <p className="font-bold">{currentUser?.username}</p>
            <p className="text-[#000000]/50 text-[10px] uppercase tracking-wider mt-1">{currentUser?.role}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full text-left text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-800 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* MOBILE HEADER (Visible only on small screens) */}
        <header className="md:hidden bg-white border-b border-[#000000]/10 p-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <h1 className="text-lg font-bold tracking-tight uppercase">Revolt Admin</h1>
          </div>
          <div className="w-8 h-8 bg-[#000000]/10 rounded-full flex items-center justify-center text-xs font-bold">
            {currentUser?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
        </header>
      
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-[#000000]/10 px-8 py-5 hidden md:flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-sm font-semibold text-[#000000]/60 uppercase tracking-wider">
            Revolt Elite Management
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#000000]/10 rounded-full flex items-center justify-center text-xs font-bold">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-6 md:p-10">
          <Outlet />
        </div>
      </main>
      </div>
    </div>
  );
}
