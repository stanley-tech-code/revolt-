import React, { useEffect, useState, useMemo } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#000000', '#666666', '#a3a3a3', '#d4d4d4', '#4ade80'];

export default function AdminAnalytics() {
  const { db } = useCms();
  const [trafficData, setTrafficData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCustomersList, setShowCustomersList] = useState(null); // 'New' or 'Returning'

  const orders = db?.orders || [];
  const products = db?.products || [];

  useEffect(() => {
    const fetchTraffic = async () => {
      try {
        const token = localStorage.getItem('REVOLT_ADMIN_JWT_TOKEN');
        const res = await fetch('/api/analytics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.traffic) {
          setTrafficData(data.traffic);
        }
      } catch (err) {
        console.error("Failed to load analytics traffic data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTraffic();
  }, []);

  // 1. Sales Overview (Daily grouped by last 7 days)
  const salesData = useMemo(() => {
    const map = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      map[dateStr] = 0;
    }
    
    orders.forEach(o => {
      if (o.status?.toLowerCase() === 'cancelled') return;
      const dateStr = new Date(o.createdAt || o.date).toISOString().split('T')[0];
      if (map[dateStr] !== undefined) {
        map[dateStr] += Number(o.total || 0);
      }
    });

    return Object.keys(map).map(date => ({
      date: date.slice(5), // MM-DD
      revenue: map[date]
    }));
  }, [orders]);

  // 2. Best-Selling Products
  const bestSellersData = useMemo(() => {
    const sorted = [...products].sort((a, b) => (b.conversions || 0) - (a.conversions || 0));
    return sorted.slice(0, 5).map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      sales: p.conversions || 0
    }));
  }, [products]);

  // 3. Revenue by Payment Method
  const paymentMethodData = useMemo(() => {
    const map = {};
    orders.forEach(o => {
      if (o.status?.toLowerCase() === 'cancelled') return;
      const pm = (o.paymentMethod || 'Unknown').toUpperCase();
      map[pm] = (map[pm] || 0) + Number(o.total || 0);
    });
    return Object.keys(map).map(pm => ({ name: pm, value: map[pm] }));
  }, [orders]);

  // 4. New vs Returning Customers
  const { customerData, newCustomersList, returningCustomersList } = useMemo(() => {
    const emailCounts = {};
    const customerDetails = {};

    orders.forEach(o => {
      if (o.status?.toLowerCase() === 'cancelled') return;
      const email = o.deliveryInfo?.customerEmail || o.userId;
      if (!email) return;

      emailCounts[email] = (emailCounts[email] || 0) + 1;
      if (!customerDetails[email]) {
        customerDetails[email] = {
          name: o.deliveryInfo?.customerName || 'Guest User',
          email: email,
          totalSpent: 0,
          ordersCount: 0
        };
      }
      customerDetails[email].totalSpent += Number(o.total || 0);
      customerDetails[email].ordersCount += 1;
    });

    let newC = 0;
    let returningC = 0;
    const newL = [];
    const retL = [];

    Object.keys(emailCounts).forEach(email => {
      if (emailCounts[email] === 1) {
        newC++;
        newL.push(customerDetails[email]);
      } else {
        returningC++;
        retL.push(customerDetails[email]);
      }
    });

    return {
      customerData: [
        { name: 'New', value: newC },
        { name: 'Returning', value: returningC }
      ],
      newCustomersList: newL,
      returningCustomersList: retL
    };
  }, [orders]);

  // 5. Traffic & Conversion Insights
  const trafficChartData = useMemo(() => {
    const map = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      map[dateStr] = trafficData[dateStr] || 0;
    }
    return Object.keys(map).map(date => ({
      date: date.slice(5),
      visits: map[date]
    }));
  }, [trafficData]);

  const totalVisits = trafficChartData.reduce((acc, curr) => acc + curr.visits, 0);
  const totalOrdersLast7Days = orders.filter(o => {
    const diffTime = Math.abs(new Date() - new Date(o.createdAt || o.date));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) <= 7 && o.status?.toLowerCase() !== 'cancelled';
  }).length;
  const conversionRate = totalVisits > 0 ? ((totalOrdersLast7Days / totalVisits) * 100).toFixed(2) : 0;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#000000]">Analytics & Reports</h1>
        <p className="text-sm text-[#000000]/60 mt-2">Deep dive into store performance and traffic insights.</p>
      </div>

      {loading && <div className="text-sm font-bold animate-pulse">Loading Analytics...</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SALES OVERVIEW */}
        <div className="bg-white border border-[#000000]/10 p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-6 border-b border-[#000000]/10 pb-4">Sales Overview (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={(val) => `Ksh ${val}`} width={80} />
                <RechartsTooltip formatter={(value) => `Ksh ${value.toLocaleString()}`} labelStyle={{ color: 'black' }} />
                <Line type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TRAFFIC INSIGHTS */}
        <div className="bg-white border border-[#000000]/10 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-[#000000]/10 pb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider">Traffic & Conversions</h3>
            <div className="text-right">
              <p className="text-[10px] uppercase text-[#000000]/50 tracking-wider">Conversion Rate</p>
              <p className="text-xl font-bold text-green-600">{conversionRate}%</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <RechartsTooltip cursor={{ fill: '#f5f5f5' }} />
                <Bar dataKey="visits" fill="#000000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* REVENUE BY PAYMENT METHOD */}
        <div className="bg-white border border-[#000000]/10 p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-6 border-b border-[#000000]/10 pb-4">Revenue by Payment Method</h3>
          <div className="h-64 flex justify-center items-center">
            {paymentMethodData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={paymentMethodData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => `Ksh ${value.toLocaleString()}`} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-[#000000]/50">No data available.</p>
            )}
          </div>
        </div>

        {/* NEW VS RETURNING CUSTOMERS */}
        <div className="bg-white border border-[#000000]/10 p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-6 border-b border-[#000000]/10 pb-4">New vs Returning Customers</h3>
          <div className="h-64 flex justify-center items-center relative">
            {(customerData[0].value > 0 || customerData[1].value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={customerData} innerRadius={0} outerRadius={80} dataKey="value">
                    {customerData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.name === 'New' ? '#000000' : '#a3a3a3'} 
                        onClick={() => setShowCustomersList(entry.name)}
                        className="cursor-pointer hover:opacity-80 outline-none"
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-[#000000]/50">No data available.</p>
            )}
            
            <p className="absolute bottom-0 text-[10px] text-[#000000]/50 italic">Click chart slices to see customer lists</p>
          </div>
        </div>

        {/* BEST SELLING PRODUCTS */}
        <div className="bg-white border border-[#000000]/10 p-6 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-6 border-b border-[#000000]/10 pb-4">Best-Selling Products</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bestSellersData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e5e5" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} width={120} />
                <RechartsTooltip cursor={{ fill: '#f5f5f5' }} />
                <Bar dataKey="sales" fill="#000000" radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CUSTOMERS LIST MODAL */}
      {showCustomersList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-[#000000]/10">
              <h2 className="text-lg font-bold uppercase tracking-tight">{showCustomersList} Customers</h2>
              <button onClick={() => setShowCustomersList(null)} className="text-2xl text-[#000000]/50 hover:text-[#000000]">&times;</button>
            </div>
            <div className="overflow-y-auto p-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#000000]/10 text-[10px] font-bold uppercase tracking-wider text-[#000000]/50">
                    <th className="pb-3 pr-4">Name</th>
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4">Orders</th>
                    <th className="pb-3 text-right">Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {(showCustomersList === 'New' ? newCustomersList : returningCustomersList).length > 0 ? (
                    (showCustomersList === 'New' ? newCustomersList : returningCustomersList).map((c, i) => (
                      <tr key={i} className="border-b border-[#000000]/5 last:border-0 hover:bg-[#f9f9f9]">
                        <td className="py-3 pr-4 text-sm font-medium">{c.name}</td>
                        <td className="py-3 pr-4 text-sm text-[#000000]/70">{c.email}</td>
                        <td className="py-3 pr-4 text-sm">{c.ordersCount}</td>
                        <td className="py-3 text-sm font-semibold text-right">Ksh {c.totalSpent.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="py-8 text-center text-sm text-[#000000]/50">No {showCustomersList.toLowerCase()} customers found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
