import React, { useEffect, useState } from 'react';
import { useCms } from '../../context/CmsContext';

export default function AdminDashboard() {
  const { db } = useCms();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalItemsSold: 0,
    productsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('REVOLT_ADMIN_JWT_TOKEN');
        const res = await fetch('/api/analytics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setStats({
            totalSales: data.totalSales,
            totalOrders: data.totalOrders,
            totalItemsSold: data.totalItemsSold,
            productsCount: data.productsCount
          });
        }
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#000000]">Dashboard Overview</h1>
        <p className="text-sm text-[#000000]/60 mt-2">Welcome back to the Revolt Admin Portal.</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Sales" value={`Ksh ${stats.totalSales.toLocaleString()}`} loading={loading} />
        <StatCard title="Total Orders" value={stats.totalOrders} loading={loading} />
        <StatCard title="Items Sold" value={stats.totalItemsSold} loading={loading} />
        <StatCard title="Total Products" value={stats.productsCount} loading={loading} />
      </div>

      {/* QUICK ACTIONS / INFO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="bg-white border border-[#000000]/10 p-8 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-4">Recent Activity</h3>
          <div className="text-sm text-[#000000]/60 space-y-4">
            {db.admin.logs && db.admin.logs.length > 0 ? (
              db.admin.logs.slice(0, 5).map((log, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-[#000000]/5 last:border-0">
                  <span className="truncate pr-4">{log.action}</span>
                  <span className="text-[10px] uppercase tracking-wider shrink-0">{new Date(log.timestamp).toLocaleDateString()}</span>
                </div>
              ))
            ) : (
              <p>No recent activity logs available.</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-[#000000]/10 p-8 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-[#000000]/10 pb-4">System Status</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex justify-between items-center">
              <span className="text-[#000000]/60">Database Connection</span>
              <span className="text-green-600 font-bold uppercase text-[10px] tracking-wider px-2 py-1 bg-green-50">Online</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-[#000000]/60">Payment Gateway</span>
              <span className="text-green-600 font-bold uppercase text-[10px] tracking-wider px-2 py-1 bg-green-50">Active</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-[#000000]/60">Active Users</span>
              <span className="text-[#000000] font-bold text-xs">{db.admin.currentUser ? '1' : '0'}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, loading }) {
  return (
    <div className="bg-white border border-[#000000]/10 p-6 shadow-sm">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/50 mb-2">{title}</h3>
      {loading ? (
        <div className="h-8 w-24 bg-[#000000]/10 animate-pulse rounded mt-2"></div>
      ) : (
        <p className="text-3xl font-bold tracking-tight text-[#000000]">{value}</p>
      )}
    </div>
  );
}
