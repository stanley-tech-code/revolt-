import React, { useState, useMemo } from 'react';
import { useCms } from '../../context/CmsContext';

const EMPTY_FORM = {
  code: '',
  discountType: 'percentage',
  discountValue: '',
  expiresAt: '',
  usageLimit: '',
  active: true,
};

export default function AdminPromotions() {
  const { db, createPromo, updatePromo, deletePromo, isLoading } = useCms();
  const promos = db?.promos || [];

  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null); // null = create mode
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null); // promo id to delete
  const [filterStatus, setFilterStatus] = useState('All'); // All | Active | Inactive
  const [searchQuery, setSearchQuery] = useState('');

  // ── derived list ──
  const filteredPromos = useMemo(() => {
    return promos.filter(p => {
      const matchSearch = p.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        filterStatus === 'All' ? true :
        filterStatus === 'Active' ? p.active :
        !p.active;
      return matchSearch && matchStatus;
    });
  }, [promos, searchQuery, filterStatus]);

  // ── summary metrics ──
  const metrics = useMemo(() => {
    const total = promos.length;
    const active = promos.filter(p => p.active).length;
    const totalUsage = promos.reduce((s, p) => s + (p.usageCount || 0), 0);
    const expired = promos.filter(p => p.expiresAt && new Date(p.expiresAt) < new Date()).length;
    return { total, active, totalUsage, expired };
  }, [promos]);

  // ── handlers ──
  const openCreate = () => {
    setEditingPromo(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (promo) => {
    setEditingPromo(promo);
    setForm({
      code: promo.code,
      discountType: promo.discountType,
      discountValue: String(promo.discountValue),
      expiresAt: promo.expiresAt ? promo.expiresAt.split('T')[0] : '',
      usageLimit: promo.usageLimit !== null ? String(promo.usageLimit) : '',
      active: promo.active,
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPromo(null);
    setFormError('');
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.code.trim()) { setFormError('Promo code is required.'); return; }
    if (!form.discountValue || isNaN(Number(form.discountValue)) || Number(form.discountValue) <= 0) {
      setFormError('Please enter a valid discount value greater than 0.'); return;
    }
    if (form.discountType === 'percentage' && Number(form.discountValue) > 100) {
      setFormError('Percentage discount cannot exceed 100%.'); return;
    }

    const payload = {
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      expiresAt: form.expiresAt || null,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      active: form.active,
    };

    let result;
    if (editingPromo) {
      result = await updatePromo(editingPromo.id, payload);
    } else {
      result = await createPromo(payload);
    }

    if (result?.success) {
      closeModal();
    } else {
      setFormError(result?.error || 'Operation failed. Please try again.');
    }
  };

  const handleToggleActive = async (promo) => {
    await updatePromo(promo.id, { active: !promo.active });
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const promo = promos.find(p => p.id === deleteConfirm);
    await deletePromo(deleteConfirm, promo?.code);
    setDeleteConfirm(null);
  };

  // ── helpers ──
  const isExpired = (p) => p.expiresAt && new Date(p.expiresAt) < new Date();
  const usageRatio = (p) => {
    if (!p.usageLimit) return null;
    return Math.min(100, Math.round((p.usageCount / p.usageLimit) * 100));
  };

  const statusBadge = (promo) => {
    if (isExpired(promo)) return { label: 'Expired', cls: 'bg-orange-100 text-orange-700' };
    if (!promo.active)     return { label: 'Inactive', cls: 'bg-[#f0f0f0] text-[#000000]/50' };
    return { label: 'Active', cls: 'bg-green-100 text-green-700' };
  };

  return (
    <div className="animate-fade-in pb-32">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#000000]/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">Discounts &amp; Promotions</h1>
          <p className="text-xs tracking-[0.2em] uppercase text-[#000000]/50 mt-2">Promo Codes · Offers · Campaigns</p>
        </div>
        <button
          id="btn-create-promo"
          onClick={openCreate}
          className="px-6 py-3 bg-[#000000] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#000000]/80 transition-colors shrink-0"
        >
          + New Promo Code
        </button>
      </div>

      {/* ── METRICS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Codes',   value: metrics.total,      color: '' },
          { label: 'Active',        value: metrics.active,     color: 'text-green-600' },
          { label: 'Total Redeems', value: metrics.totalUsage, color: '' },
          { label: 'Expired',       value: metrics.expired,    color: 'text-orange-600' },
        ].map(m => (
          <div key={m.label} className="bg-white border border-[#000000]/10 p-6 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/50 mb-2">{m.label}</h3>
            <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* ── TOOLBAR ── */}
      <div className="bg-white border border-[#000000]/10 border-b-0 p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <h2 className="text-sm font-bold uppercase tracking-wider">All Promo Codes</h2>
        <div className="flex gap-2 w-full md:w-auto flex-wrap">
          <input
            type="text"
            placeholder="Search code…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 md:flex-none md:w-48 px-4 py-2 text-xs border border-[#000000]/20 bg-white focus:outline-none focus:border-[#000000]"
          />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="flex-1 md:flex-none px-4 py-2 text-[10px] font-bold border border-[#000000]/20 bg-white focus:outline-none focus:border-[#000000] uppercase tracking-wider"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white border border-[#000000]/10 overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-[#f9f9f9] border-b border-[#000000]/10">
              {['Code', 'Discount', 'Expires', 'Usage', 'Status', 'Active', 'Actions'].map(h => (
                <th key={h} className="py-4 px-5 text-[10px] font-bold uppercase tracking-wider text-[#000000]/60">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPromos.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-sm text-[#000000]/40">
                  {promos.length === 0
                    ? 'No promo codes yet. Create your first one!'
                    : 'No promo codes match your filters.'}
                </td>
              </tr>
            ) : (
              filteredPromos.map(promo => {
                const badge = statusBadge(promo);
                const ratio = usageRatio(promo);
                return (
                  <tr key={promo.id} className="border-b border-[#000000]/5 hover:bg-[#fcfcfc] transition-colors group">
                    {/* Code */}
                    <td className="py-4 px-5">
                      <span className="font-mono text-sm font-bold tracking-wider bg-[#f0f0f0] px-2 py-1">{promo.code}</span>
                    </td>

                    {/* Discount */}
                    <td className="py-4 px-5">
                      <span className="text-sm font-bold">
                        {promo.discountType === 'percentage'
                          ? `${promo.discountValue}%`
                          : `Ksh ${Number(promo.discountValue).toLocaleString()}`}
                      </span>
                      <span className="ml-2 text-[10px] uppercase tracking-wider text-[#000000]/40">
                        {promo.discountType === 'percentage' ? 'off' : 'fixed'}
                      </span>
                    </td>

                    {/* Expires */}
                    <td className="py-4 px-5 text-sm text-[#000000]/70">
                      {promo.expiresAt
                        ? <span className={isExpired(promo) ? 'text-orange-600 font-bold' : ''}>{new Date(promo.expiresAt).toLocaleDateString()}</span>
                        : <span className="text-[#000000]/30 text-xs">No Expiry</span>}
                    </td>

                    {/* Usage */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">
                          {promo.usageCount}
                          {promo.usageLimit ? <span className="text-[#000000]/40"> / {promo.usageLimit}</span> : <span className="text-[#000000]/30 text-xs ml-1">∞</span>}
                        </span>
                        {ratio !== null && (
                          <div className="w-20 h-1.5 bg-[#000000]/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${ratio >= 90 ? 'bg-red-500' : ratio >= 60 ? 'bg-orange-400' : 'bg-green-500'}`}
                              style={{ width: `${ratio}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="py-4 px-5">
                      <span className={`inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </td>

                    {/* Toggle */}
                    <td className="py-4 px-5">
                      <button
                        onClick={() => handleToggleActive(promo)}
                        title={promo.active ? 'Deactivate' : 'Activate'}
                        className={`relative inline-flex w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${promo.active ? 'bg-[#000000]' : 'bg-[#000000]/20'}`}
                      >
                        <span
                          className={`inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5 ${promo.active ? 'translate-x-5' : 'translate-x-1'}`}
                        />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(promo)}
                          className="text-xs font-bold uppercase tracking-wider text-[#000000]/60 hover:text-[#000000] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(promo.id)}
                          className="text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── CREATE / EDIT MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-8 py-6 border-b border-[#000000]/10">
              <h2 className="text-sm font-bold uppercase tracking-[0.15em]">
                {editingPromo ? 'Edit Promo Code' : 'Create Promo Code'}
              </h2>
              <button onClick={closeModal} className="text-2xl text-[#000000]/40 hover:text-[#000000] transition-colors leading-none">&times;</button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
              {/* Code */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/60 mb-2">Promo Code *</label>
                <input
                  name="code"
                  value={form.code}
                  onChange={handleFormChange}
                  placeholder="e.g. REVOLT20"
                  maxLength={20}
                  className="w-full border border-[#000000]/20 px-4 py-3 text-sm font-mono font-bold uppercase tracking-wider focus:outline-none focus:border-[#000000] placeholder:normal-case placeholder:font-normal"
                />
              </div>

              {/* Discount Type + Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/60 mb-2">Discount Type *</label>
                  <select
                    name="discountType"
                    value={form.discountType}
                    onChange={handleFormChange}
                    className="w-full border border-[#000000]/20 px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#000000]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Ksh)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/60 mb-2">
                    {form.discountType === 'percentage' ? 'Percentage (%)' : 'Amount (Ksh)'} *
                  </label>
                  <input
                    name="discountValue"
                    type="number"
                    min="0"
                    max={form.discountType === 'percentage' ? 100 : undefined}
                    step="0.01"
                    value={form.discountValue}
                    onChange={handleFormChange}
                    placeholder={form.discountType === 'percentage' ? '0 – 100' : 'e.g. 500'}
                    className="w-full border border-[#000000]/20 px-4 py-3 text-sm focus:outline-none focus:border-[#000000]"
                  />
                </div>
              </div>

              {/* Expiry + Usage Limit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/60 mb-2">Expiry Date</label>
                  <input
                    name="expiresAt"
                    type="date"
                    value={form.expiresAt}
                    onChange={handleFormChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-[#000000]/20 px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#000000]"
                  />
                  <p className="text-[10px] text-[#000000]/40 mt-1">Leave blank for no expiry</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/60 mb-2">Usage Limit</label>
                  <input
                    name="usageLimit"
                    type="number"
                    min="1"
                    step="1"
                    value={form.usageLimit}
                    onChange={handleFormChange}
                    placeholder="∞ Unlimited"
                    className="w-full border border-[#000000]/20 px-4 py-3 text-sm focus:outline-none focus:border-[#000000]"
                  />
                  <p className="text-[10px] text-[#000000]/40 mt-1">Leave blank for unlimited</p>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between border border-[#000000]/10 p-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider">Enable Promo</p>
                  <p className="text-[10px] text-[#000000]/50 mt-0.5">Toggle to activate or deactivate instantly</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, active: !prev.active }))}
                  className={`relative inline-flex w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${form.active ? 'bg-[#000000]' : 'bg-[#000000]/20'}`}
                >
                  <span className={`inline-block w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5 ${form.active ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Error */}
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 font-medium">
                  {formError}
                </div>
              )}

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wider border border-[#000000]/20 text-[#000000]/60 hover:bg-[#000000]/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wider bg-[#000000] text-white hover:bg-[#000000]/80 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Saving…' : editingPromo ? 'Save Changes' : 'Create Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm shadow-2xl p-8">
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] mb-2">Delete Promo Code</h3>
            <p className="text-sm text-[#000000]/60 mb-8">
              Are you sure you want to permanently delete{' '}
              <strong className="text-[#000000] font-mono">{promos.find(p => p.id === deleteConfirm)?.code}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wider border border-[#000000]/20 text-[#000000]/60 hover:bg-[#000000]/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wider bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
