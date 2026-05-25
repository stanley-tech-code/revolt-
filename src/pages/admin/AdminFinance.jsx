import React, { useState, useMemo } from 'react';
import { useCms } from '../../context/CmsContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function AdminFinance() {
  const { db } = useCms();
  const orders = db?.orders || [];

  const [filterMethod, setFilterMethod] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [dateRange, setDateRange] = useState('All Time'); // All Time, Last 7 Days, Last 30 Days, This Month

  // 1. Process Transactions
  const allTransactions = useMemo(() => {
    return orders.map(order => ({
      id: order.id,
      date: order.createdAt || order.date,
      customer: order.deliveryInfo?.customerName || order.customer || 'Guest',
      email: order.deliveryInfo?.customerEmail || '',
      amount: Number(order.total || 0),
      method: (order.paymentMethod || 'card').toLowerCase(),
      // Since current system only saves completed checkouts as orders, default to Successful.
      status: order.paymentStatus || 'Successful' 
    }));
  }, [orders]);

  // 2. Filter Transactions
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return allTransactions.filter(t => {
      // Method Filter
      let methodMatch = true;
      if (filterMethod !== 'All') {
        if (filterMethod === 'M-Pesa') methodMatch = t.method === 'mpesa';
        if (filterMethod === 'Card') methodMatch = t.method === 'card';
        if (filterMethod === 'Airtel Money') methodMatch = t.method === 'airtel';
      }

      // Status Filter
      let statusMatch = true;
      if (filterStatus !== 'All') {
        statusMatch = t.status === filterStatus;
      }

      // Date Filter
      let dateMatch = true;
      const tDate = new Date(t.date);
      if (dateRange === 'Last 7 Days') {
        const diff = (now - tDate) / (1000 * 60 * 60 * 24);
        dateMatch = diff <= 7;
      } else if (dateRange === 'Last 30 Days') {
        const diff = (now - tDate) / (1000 * 60 * 60 * 24);
        dateMatch = diff <= 30;
      } else if (dateRange === 'This Month') {
        dateMatch = tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
      }

      return methodMatch && statusMatch && dateMatch;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [allTransactions, filterMethod, filterStatus, dateRange]);

  // 3. Revenue Summaries
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let thisMonthRevenue = 0;
    let mpesaTotal = 0;
    let cardTotal = 0;
    let failedCount = 0;

    const now = new Date();

    allTransactions.forEach(t => {
      if (t.status === 'Successful') {
        totalRevenue += t.amount;
        if (t.method === 'mpesa') mpesaTotal += t.amount;
        if (t.method === 'card') cardTotal += t.amount;

        const tDate = new Date(t.date);
        if (tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear()) {
          thisMonthRevenue += t.amount;
        }
      } else if (t.status === 'Failed') {
        failedCount++;
      }
    });

    return { totalRevenue, thisMonthRevenue, mpesaTotal, cardTotal, failedCount };
  }, [allTransactions]);

  // 4. Export Functions
  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Customer', 'Amount (Ksh)', 'Payment Method', 'Status'];
    const rows = filteredTransactions.map(t => [
      t.id,
      new Date(t.date).toLocaleString(),
      `"${t.customer}"`, // quote for commas
      t.amount,
      t.method.toUpperCase(),
      t.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transactions_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('REVOLT Finance Report', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    // Add Summary
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Filtered Transactions: ${filteredTransactions.length}`, 14, 40);
    const filteredTotal = filteredTransactions.filter(t => t.status === 'Successful').reduce((sum, t) => sum + t.amount, 0);
    doc.text(`Filtered Total Revenue: Ksh ${filteredTotal.toLocaleString()}`, 14, 46);

    const tableColumn = ["Transaction ID", "Date", "Customer", "Amount (Ksh)", "Method", "Status"];
    const tableRows = [];

    filteredTransactions.forEach(t => {
      const rowData = [
        t.id.slice(0, 8) + '...',
        new Date(t.date).toLocaleDateString(),
        t.customer,
        t.amount.toLocaleString(),
        t.method.toUpperCase(),
        t.status
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 55,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 0, 0] }
    });

    doc.save(`finance_report_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div className="p-4 md:p-8 pb-32 max-w-7xl mx-auto animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#000000]/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">Finance & Payments</h1>
          <p className="text-xs tracking-[0.2em] uppercase text-[#000000]/50 mt-2">Transaction Ledgers & Revenue</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold uppercase tracking-wider border border-[#000000] text-[#000000] hover:bg-[#000000] hover:text-white transition-colors"
          >
            Export CSV
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#000000] text-white hover:bg-[#000000]/80 transition-colors"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-[#000000]/10 p-6 shadow-sm">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/50 mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold">Ksh {metrics.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-[#000000]/10 p-6 shadow-sm">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/50 mb-2">This Month</h3>
          <p className="text-2xl font-bold text-green-600">Ksh {metrics.thisMonthRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-[#000000]/10 p-6 shadow-sm">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/50 mb-2">M-Pesa / Card</h3>
          <p className="text-sm font-bold">Ksh {metrics.mpesaTotal.toLocaleString()} <span className="text-[#000000]/40 font-normal">M-Pesa</span></p>
          <p className="text-sm font-bold mt-1">Ksh {metrics.cardTotal.toLocaleString()} <span className="text-[#000000]/40 font-normal">Card</span></p>
        </div>
        <div className="bg-white border border-[#000000]/10 p-6 shadow-sm">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/50 mb-2">Failed Payments</h3>
          <p className="text-2xl font-bold text-red-600">{metrics.failedCount}</p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white border border-[#000000]/10 p-4 mb-0 flex flex-col md:flex-row gap-4 justify-between items-center bg-[#fcfcfc] border-b-0">
        <h2 className="text-sm font-bold uppercase tracking-wider w-full md:w-auto mb-2 md:mb-0">Transactions List</h2>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select 
            className="flex-1 md:flex-none px-4 py-2 text-[10px] font-bold border border-[#000000]/20 bg-white focus:outline-none focus:border-[#000000] uppercase tracking-wider"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="All Time">All Time</option>
            <option value="This Month">This Month</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 7 Days">Last 7 Days</option>
          </select>
          <select 
            className="flex-1 md:flex-none px-4 py-2 text-[10px] font-bold border border-[#000000]/20 bg-white focus:outline-none focus:border-[#000000] uppercase tracking-wider"
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
          >
            <option value="All">All Methods</option>
            <option value="M-Pesa">M-Pesa</option>
            <option value="Card">Card</option>
            <option value="Airtel Money">Airtel Money</option>
          </select>
          <select 
            className="flex-1 md:flex-none px-4 py-2 text-[10px] font-bold border border-[#000000]/20 bg-white focus:outline-none focus:border-[#000000] uppercase tracking-wider"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Successful">Successful</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-white border border-[#000000]/10 overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-[#f9f9f9] border-b border-[#000000]/10">
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60">Date</th>
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60">Transaction ID</th>
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60">Customer</th>
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60 text-right">Amount</th>
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60 text-center">Method</th>
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-sm text-[#000000]/50">No transactions match your filters.</td>
              </tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr key={t.id} className="border-b border-[#000000]/5 hover:bg-[#fcfcfc] transition-colors">
                  <td className="py-4 px-6 text-sm text-[#000000]/70">
                    {new Date(t.date).toLocaleDateString()} <span className="text-[10px] ml-1">{new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </td>
                  <td className="py-4 px-6 text-xs font-mono text-[#000000]/60">
                    {t.id.slice(0,12).toUpperCase()}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-sm">{t.customer}</p>
                    <p className="text-[10px] text-[#000000]/50">{t.email}</p>
                  </td>
                  <td className="py-4 px-6 text-sm text-right font-medium">
                    Ksh {t.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-block px-2 py-1 bg-[#f0f0f0] text-[9px] font-bold uppercase tracking-wider">
                      {t.method}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-wider 
                      ${t.status === 'Successful' ? 'bg-green-100 text-green-800' : ''}
                      ${t.status === 'Failed' ? 'bg-red-100 text-red-800' : ''}
                      ${t.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    `}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
