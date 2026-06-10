import React, { useEffect, useState } from 'react';
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
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('REVOLT_ADMIN_JWT_TOKEN');
      const res = await fetch('/api/admin/live-analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load live analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-8 text-sm text-[#000000]/60 animate-pulse">Loading Analytics Dashboard...</div>;
  }

  if (!data) {
    return <div className="p-8 text-sm text-red-600">Failed to load analytics data.</div>;
  }

  const { live, historical, users } = data;

  // --- Calculate Registered Accounts Overview ---
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const currentDay = now.getDay(); 
  // Get Monday as start of week
  const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - diffToMonday);
  
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  let newToday = 0;
  let newThisWeek = 0;
  let newThisMonth = 0;

  users.forEach(u => {
    const createdAt = new Date(u.created_at);
    if (createdAt >= startOfToday) newToday++;
    if (createdAt >= startOfWeek) newThisWeek++;
    if (createdAt >= startOfMonth) newThisMonth++;
  });

  // --- Process Traffic History (Past 30 days) ---
  const last30Days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(startOfToday);
    d.setDate(d.getDate() - i);
    last30Days.push(d.toISOString().split('T')[0]);
  }

  const historyLabels = [];
  const historyTotal = [];
  const historyRegistered = [];
  const historyGuest = [];

  last30Days.forEach(dateStr => {
    const d = new Date(dateStr);
    historyLabels.push(`${d.getMonth()+1}/${d.getDate()}`);
    let dayData = historical[dateStr];
    
    // Handle legacy numeric data gracefully
    if (typeof dayData === 'number') {
      dayData = { total: dayData, registered: 0, guest: dayData };
    } else if (!dayData) {
      dayData = { total: 0, registered: 0, guest: 0 };
    }
    
    historyTotal.push(dayData.total);
    historyRegistered.push(dayData.registered);
    historyGuest.push(dayData.guest);
  });

  // --- Process Peak Hours Graph ---
  const hoursLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const hoursData = Array(24).fill(0);
  
  // Aggregate all hours across the historical data
  Object.values(historical).forEach(dayData => {
    if (dayData.hours) {
      Object.keys(dayData.hours).forEach(hour => {
        hoursData[parseInt(hour)] += dayData.hours[hour];
      });
    }
  });

  // --- Calculate Growth (Week over Week) ---
  // A simplistic WoW growth calculation for the chart
  const wowLabels = ['4 Weeks Ago', '3 Weeks Ago', '2 Weeks Ago', 'Last Week', 'This Week'];
  const wowData = [0, 0, 0, 0, 0];
  
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  last30Days.forEach(dateStr => {
    const d = new Date(dateStr);
    const diffTime = Math.abs(now - d);
    const diffWeeks = Math.floor(diffTime / msPerWeek);
    if (diffWeeks < 5) {
      const idx = 4 - diffWeeks;
      const val = typeof historical[dateStr] === 'number' ? historical[dateStr] : (historical[dateStr]?.total || 0);
      wowData[idx] += val;
    }
  });

  const isGrowing = wowData[4] >= wowData[3];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#000000]">Live Analytics Dashboard</h1>
          <p className="text-sm text-[#000000]/60 mt-2">Monitor real-time active users and traffic trends.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-green-600">Live Updating</span>
        </div>
      </div>

      {/* TOP PANELS: LIVE TRACKING & USERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LIVE TRACKING PANEL */}
        <div className="bg-white border border-[#000000]/10 p-6 md:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <svg className="w-32 h-32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#000000]/60 mb-6">Active Users Right Now</h3>
          <div className="text-6xl md:text-8xl font-black text-[#000000] tracking-tighter mb-8 tabular-nums">
            {live.total}
          </div>
          
          <div className="flex items-center gap-8 border-t border-[#000000]/10 pt-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#000000]/50 mb-1">Registered</p>
              <p className="text-2xl font-bold tabular-nums text-ink">{live.registered}</p>
            </div>
            <div className="h-8 w-px bg-[#000000]/10"></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#000000]/50 mb-1">Guests</p>
              <p className="text-2xl font-bold tabular-nums text-ink">{live.guest}</p>
            </div>
          </div>
        </div>

        {/* REGISTERED ACCOUNTS OVERVIEW */}
        <div className="bg-white border border-[#000000]/10 p-6 md:p-8 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#000000]/60 mb-6">Registered Accounts Overview</h3>
          <div className="grid grid-cols-2 gap-y-8 gap-x-4">
            <div>
              <p className="text-3xl font-bold tabular-nums">{users.length.toLocaleString()}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#000000]/50 mt-1">Total Accounts</p>
            </div>
            <div>
              <p className="text-3xl font-bold tabular-nums text-green-600">+{newToday}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#000000]/50 mt-1">New Today</p>
            </div>
            <div>
              <p className="text-3xl font-bold tabular-nums">+{newThisWeek}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#000000]/50 mt-1">New This Week</p>
            </div>
            <div>
              <p className="text-3xl font-bold tabular-nums">+{newThisMonth}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#000000]/50 mt-1">New This Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* GRAPHS: TRAFFIC HISTORY (30 DAYS) */}
      <div className="bg-white border border-[#000000]/10 p-6 md:p-8 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#000000]/60 mb-6">Traffic History (Past 30 Days)</h3>
        <div className="h-72">
          <Line 
            data={{
              labels: historyLabels,
              datasets: [
                {
                  label: 'Registered',
                  data: historyRegistered,
                  borderColor: '#1a1a1a',
                  backgroundColor: 'rgba(26, 26, 26, 0.5)',
                  tension: 0.3,
                  fill: true
                },
                {
                  label: 'Guests',
                  data: historyGuest,
                  borderColor: '#888888',
                  backgroundColor: 'rgba(136, 136, 136, 0.2)',
                  tension: 0.3,
                  fill: true
                }
              ]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 6 } } },
              scales: { y: { beginAtZero: true, grid: { color: '#f0f0f0' } }, x: { grid: { display: false } } }
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRAPHS: PEAK HOURS */}
        <div className="bg-white border border-[#000000]/10 p-6 md:p-8 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#000000]/60 mb-6">Peak Traffic Hours</h3>
          <div className="h-64">
            <Bar 
              data={{
                labels: hoursLabels,
                datasets: [
                  {
                    label: 'Total Visits',
                    data: hoursData,
                    backgroundColor: '#1a1a1a',
                    borderRadius: 2
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { 
                  y: { beginAtZero: true, grid: { color: '#f0f0f0' } }, 
                  x: { grid: { display: false }, ticks: { maxTicksLimit: 12 } } 
                }
              }}
            />
          </div>
        </div>

        {/* GRAPHS: GROWTH */}
        <div className="bg-white border border-[#000000]/10 p-6 md:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#000000]/60">WoW Traffic Growth</h3>
            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${isGrowing ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {isGrowing ? 'Upward Trend ↗' : 'Downward Trend ↘'}
            </span>
          </div>
          <div className="h-64">
            <Line 
              data={{
                labels: wowLabels,
                datasets: [
                  {
                    label: 'Weekly Traffic',
                    data: wowData,
                    borderColor: isGrowing ? '#16a34a' : '#dc2626',
                    backgroundColor: isGrowing ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: isGrowing ? '#16a34a' : '#dc2626',
                    borderWidth: 2
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { 
                  y: { beginAtZero: true, grid: { color: '#f0f0f0' } }, 
                  x: { grid: { display: false } } 
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
