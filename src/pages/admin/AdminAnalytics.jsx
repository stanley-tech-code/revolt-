import React, { useEffect, useState, useMemo } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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

    const dates = Object.keys(map).map(date => date.slice(5)); // MM-DD
    const revenues = Object.values(map);

    return {
      labels: dates,
      datasets: [
        {
          label: 'Revenue (Ksh)',
          data: revenues,
          borderColor: '#000000',
          backgroundColor: '#000000',
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 3,
        }
      ]
    };
  }, [orders]);

  // 2. Best-Selling Products
  const bestSellersData = useMemo(() => {
    const sorted = [...products].sort((a, b) => (b.conversions || 0) - (a.conversions || 0));
    const top5 = sorted.slice(0, 5);
    return {
      labels: top5.map(p => (p?.name || 'Unknown').length > 15 ? p.name.substring(0, 15) + '...' : (p?.name || 'Unknown')),
      datasets: [
        {
          label: 'Sales (Conversions)',
          data: top5.map(p => p.conversions || 0),
          backgroundColor: '#000000',
          borderRadius: 4,
        }
      ]
    };
  }, [products]);

  // 3. Revenue by Payment Method
  const paymentMethodData = useMemo(() => {
    const map = {};
    orders.forEach(o => {
      if (o.status?.toLowerCase() === 'cancelled') return;
      const pm = (o.paymentMethod || 'Unknown').toUpperCase();
      map[pm] = (map[pm] || 0) + Number(o.total || 0);
    });
    
    const labels = Object.keys(map);
    const values = Object.values(map);

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: COLORS.slice(0, labels.length),
          borderWidth: 0,
        }
      ]
    };
  }, [orders]);

  // 4. New vs Returning Customers
  const { customerChartData, newCustomersList, returningCustomersList, totalValid } = useMemo(() => {
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
      customerChartData: {
        labels: ['New', 'Returning'],
        datasets: [
          {
            data: [newC, returningC],
            backgroundColor: ['#000000', '#a3a3a3'],
            borderWidth: 0,
          }
        ]
      },
      newCustomersList: newL,
      returningCustomersList: retL,
      totalValid: newC + returningC
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
    
    const dates = Object.keys(map).map(date => date.slice(5));
    const visits = Object.values(map);

    return {
      labels: dates,
      datasets: [
        {
          label: 'Website Visits',
          data: visits,
          backgroundColor: '#000000',
          borderRadius: 4,
        }
      ]
    };
  }, [trafficData]);

  const totalVisits = useMemo(() => trafficChartData.datasets[0].data.reduce((acc, curr) => acc + curr, 0), [trafficChartData]);
  const totalOrdersLast7Days = useMemo(() => orders.filter(o => {
    const diffTime = Math.abs(new Date() - new Date(o.createdAt || o.date));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) <= 7 && o.status?.toLowerCase() !== 'cancelled';
  }).length, [orders]);
  const conversionRate = totalVisits > 0 ? ((totalOrdersLast7Days / totalVisits) * 100).toFixed(2) : 0;

  // Chart Options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        grid: { color: '#f0f0f0' },
        border: { display: false }
      }
    }
  };

  const barHorizontalOptions = {
    ...commonOptions,
    indexAxis: 'y',
    scales: {
      x: { grid: { color: '#f0f0f0' }, border: { display: false } },
      y: { grid: { display: false } }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 10, font: { size: 10 } }
      }
    }
  };

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
            <Line data={salesData} options={commonOptions} />
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
            <Bar data={trafficChartData} options={commonOptions} />
          </div>
        </div>

        {/* REVENUE BY PAYMENT METHOD */}
        <div className="bg-white border border-[#000000]/10 p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-6 border-b border-[#000000]/10 pb-4">Revenue by Payment Method</h3>
          <div className="h-64 flex justify-center items-center">
            {paymentMethodData.labels.length > 0 ? (
              <div className="w-full h-full relative">
                <Pie data={paymentMethodData} options={pieOptions} />
              </div>
            ) : (
              <p className="text-sm text-[#000000]/50">No data available.</p>
            )}
          </div>
        </div>

        {/* NEW VS RETURNING CUSTOMERS */}
        <div className="bg-white border border-[#000000]/10 p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-6 border-b border-[#000000]/10 pb-4">New vs Returning Customers</h3>
          <div className="h-64 flex justify-center items-center relative">
            {totalValid > 0 ? (
              <div className="w-full h-full relative cursor-pointer" onClick={(e) => {
                // Approximate clicking on the pie chart slices
                const target = e.target;
                if (target) setShowCustomersList('New'); // Open list by default to easily browse
              }}>
                <Pie data={customerChartData} options={pieOptions} />
                <p className="absolute bottom-0 w-full text-center text-[10px] text-[#000000]/50 italic pointer-events-none">Click to see customer lists</p>
              </div>
            ) : (
              <p className="text-sm text-[#000000]/50">No data available.</p>
            )}
          </div>
        </div>

        {/* BEST SELLING PRODUCTS */}
        <div className="bg-white border border-[#000000]/10 p-6 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-6 border-b border-[#000000]/10 pb-4">Best-Selling Products</h3>
          <div className="h-72">
            <Bar data={bestSellersData} options={barHorizontalOptions} />
          </div>
        </div>
      </div>

      {/* CUSTOMERS LIST MODAL */}
      {showCustomersList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-[#000000]/10">
              <h2 className="text-lg font-bold uppercase tracking-tight">Customer Breakdown</h2>
              <button onClick={() => setShowCustomersList(null)} className="text-2xl text-[#000000]/50 hover:text-[#000000]">&times;</button>
            </div>
            
            <div className="flex gap-4 p-4 bg-gray-50 border-b border-[#000000]/10">
              <button 
                onClick={() => setShowCustomersList('New')} 
                className={`text-sm font-bold uppercase tracking-widest px-4 py-2 ${showCustomersList === 'New' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}
              >
                New ({newCustomersList.length})
              </button>
              <button 
                onClick={() => setShowCustomersList('Returning')} 
                className={`text-sm font-bold uppercase tracking-widest px-4 py-2 ${showCustomersList === 'Returning' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}
              >
                Returning ({returningCustomersList.length})
              </button>
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
