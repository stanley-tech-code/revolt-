import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useCms } from '../../context/CmsContext';

export default function AdminLayout() {
  const { db, logoutAdmin } = useCms();
  const navigate = useNavigate();

  const currentUser = db?.admin?.currentUser;

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', roles: ['Super Admin', 'Editor'] },
    { name: 'Products', path: '/admin/products', roles: ['Super Admin', 'Editor'] },
    { name: 'Orders', path: '/admin/orders', roles: ['Super Admin', 'Editor'] },
    { name: 'Settings', path: '/admin/settings', roles: ['Super Admin'] },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#000000] flex flex-col md:flex-row">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white border-r border-[#000000]/10 flex flex-col hidden md:flex">
        <div className="p-8 border-b border-[#000000]/10">
          <h1 className="text-2xl font-bold tracking-tight uppercase">Revolt</h1>
          <p className="text-[9px] tracking-[0.2em] uppercase text-[#000000]/50 mt-1">Workspace</p>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            if (!item.roles.includes(currentUser?.role)) return null;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive 
                      ? 'bg-[#000000] text-white' 
                      : 'text-[#000000]/60 hover:bg-[#000000]/5 hover:text-[#000000]'
                  }`
                }
              >
                {item.name}
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

      {/* MOBILE HEADER (Visible only on small screens) */}
      <header className="md:hidden bg-white border-b border-[#000000]/10 p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold tracking-tight uppercase">Revolt Admin</h1>
        <button onClick={handleLogout} className="text-[10px] font-bold uppercase text-red-600">Sign Out</button>
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
  );
}
