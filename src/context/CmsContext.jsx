import React, { createContext, useContext, useState, useEffect } from 'react';

const CmsContext = createContext();

export function CmsProvider({ children }) {
  // Central dynamic database states
  const [db, setDb] = useState({
    homepage: {
      hero: { tagline: '', title: '', description: '', buttonText: '', videoUrl: '', useVideo: false },
      sections: []
    },
    products: [],
    orders: [],
    seo: { title: 'REVOLT — Refined Luxury Essentials', description: '', googleAnalyticsId: '', facebookPixelId: '', promoBannerActive: true, promoBannerText: '' },
    admin: { currentUser: null, logs: [] }
  });

  const [draftDb, setDraftDb] = useState(db);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotification, setErrorNotification] = useState('');
  const [successNotification, setSuccessNotification] = useState('');

  // History stack for Undo/Redo (client-side)
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  // Helper headers with JWT token
  const getHeaders = () => {
    const token = localStorage.getItem('REVOLT_ADMIN_JWT_TOKEN');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  // --- FETCH WHOLE SITE DATABASE FROM BACKEND ---
  const fetchDatabase = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch public sections & hero details
      const secRes = await fetch('/api/sections');
      const secData = await secRes.json();

      // 2. Fetch public products
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();

      // 3. Fetch public SEO config
      const seoRes = await fetch('/api/seo');
      const seoData = await seoRes.json();

      let orders = [];
      let logs = [];
      let currentUser = null;

      // Admin authentication
      const token = localStorage.getItem('REVOLT_ADMIN_JWT_TOKEN');
      if (token) {
        try {
          const authRes = await fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } });
          const authData = await authRes.json();
          if (authData.success) {
            currentUser = authData.user;
            
            // Fetch real-time orders if admin is authenticated
            try {
              const ordersRes = await fetch('/api/orders', { headers: { 'Authorization': `Bearer ${token}` } });
              const ordersData = await ordersRes.json();
              if (ordersData.success) {
                orders = ordersData.orders;
              }
            } catch (err) {
              console.error("Failed to fetch orders", err);
            }
          } else {
            localStorage.removeItem('REVOLT_ADMIN_JWT_TOKEN');
          }
        } catch (e) {
          console.error("Failed to verify admin token");
        }
      }

      const freshDb = {
        homepage: {
          hero: secData.hero || db.homepage.hero,
          sections: secData.sections || db.homepage.sections
        },
        products: prodData.products || db.products,
        seo: seoData.seo || db.seo,
        orders,
        admin: {
          currentUser,
          logs
        }
      };

      setDb(freshDb);
      setDraftDb(freshDb);

      // Initialize history stack
      setHistory([freshDb]);
      setHistoryIdx(0);

    } catch (err) {
      console.error('Failed to connect to Revolt database server. Verify Express server is running.', err);
      setErrorNotification('Database offline. Rendered in memory mode.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabase();
  }, []);

  // Sync notifications fading
  useEffect(() => {
    if (successNotification) {
      const t = setTimeout(() => setSuccessNotification(''), 4000);
      return () => clearTimeout(t);
    }
  }, [successNotification]);

  useEffect(() => {
    if (errorNotification) {
      const t = setTimeout(() => setErrorNotification(''), 4000);
      return () => clearTimeout(t);
    }
  }, [errorNotification]);

  // Client-side Undo/Redo stack pushes
  const pushToHistory = (newDb) => {
    const nextHistory = history.slice(0, historyIdx + 1);
    setHistory([...nextHistory, newDb]);
    setHistoryIdx(nextHistory.length);
  };

  const updateDraft = (updater) => {
    setDraftDb((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return next;
    });
  };

  // --- PUBLISH DRAFT DIRECTLY TO BACKEND DATABASE ---
  const publishChanges = async () => {
    setIsLoading(true);
    try {
      // 1. Sync sections & hero parameters to server
      const secRes = await fetch('/api/sections', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          sections: draftDb.homepage.sections,
          hero: draftDb.homepage.hero
        })
      });
      const secData = await secRes.json();

      // 2. Sync SEO details
      const seoRes = await fetch('/api/seo', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(draftDb.seo)
      });
      const seoData = await seoRes.json();

      if (secData.success && seoData.success) {
        setSuccessNotification('Draft changes successfully compiled & published live!');
        setDb(draftDb);
        pushToHistory(draftDb);
        fetchDatabase(); // Refresh fresh logs
      } else {
        setErrorNotification(secData.error || seoData.error || 'Failed to publish draft changes.');
      }
    } catch (err) {
      setErrorNotification('Publish failed. Server connection error.');
    } finally {
      setIsLoading(false);
    }
  };

  const discardChanges = () => {
    setDraftDb(db);
    setSuccessNotification('Draft edits discarded. Staged layouts reset.');
  };

  const undo = () => {
    if (historyIdx > 0) {
      const prevIdx = historyIdx - 1;
      setHistoryIdx(prevIdx);
      setDb(history[prevIdx]);
      setDraftDb(history[prevIdx]);
      setSuccessNotification('Layout action undone.');
    }
  };

  const redo = () => {
    if (historyIdx < history.length - 1) {
      const nextIdx = historyIdx + 1;
      setHistoryIdx(nextIdx);
      setDb(history[nextIdx]);
      setDraftDb(history[nextIdx]);
      setSuccessNotification('Layout action redone.');
    }
  };

  // --- AUTH OPERATIONS ---
  const loginAdmin = async (username, password) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('REVOLT_ADMIN_JWT_TOKEN', data.token);
        setSuccessNotification(`Welcome back, ${data.user.username}!`);
        await fetchDatabase(); // Reload authentic routes
        return { success: true };
      } else {
        setErrorNotification(data.error);
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Failed to connect to authentication server.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('REVOLT_ADMIN_JWT_TOKEN');
    setDb(prev => ({ ...prev, admin: { ...prev.admin, currentUser: null } }));
    setDraftDb(prev => ({ ...prev, admin: { ...prev.admin, currentUser: null } }));
    setIsEditMode(false);
    setSuccessNotification('Successfully logged out of portal.');
  };

  // --- REAL-TIME PRODUCTS INVENTORY CRUD ---
  const createProduct = async (product) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(product)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessNotification(`Product "${product.name}" added successfully.`);
        await fetchDatabase();
        return true;
      }
    } catch (err) {
      setErrorNotification('Failed to create product.');
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const updateProduct = async (id, fields) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(fields)
      });
      const data = await res.json();
      if (data.success) {
        await fetchDatabase();
        return true;
      }
    } catch (err) {
      setErrorNotification('Failed to update product details.');
    }
    return false;
  };

  const deleteProduct = async (id) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setSuccessNotification('Product deleted from database.');
        await fetchDatabase();
        return true;
      }
    } catch (err) {
      setErrorNotification('Failed to delete product.');
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  // --- SECURE REAL MEDIA FILE UPLOADS ---
  const uploadFile = async (fileObject) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', fileObject);

      const token = localStorage.getItem('REVOLT_ADMIN_JWT_TOKEN');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });

      let data;
      try {
        data = await res.json();
      } catch {
        // Vercel body-size limit or network error returned non-JSON
        const msg = `Upload failed (HTTP ${res.status}). The file may be too large (Vercel limit: 4.5 MB).`;
        setErrorNotification(msg);
        return { success: false, error: msg };
      }

      if (data.success) {
        setSuccessNotification('Image uploaded to Supabase storage successfully.');
        return { success: true, url: data.url };
      } else {
        // Show the real server-side reason (e.g. missing bucket, auth)
        const msg = data.error || 'Upload failed for an unknown reason.';
        setErrorNotification(msg);
        return { success: false, error: msg };
      }
    } catch (err) {
      const msg = 'File upload failed — could not reach the API server. Check your internet connection or Vercel function logs.';
      setErrorNotification(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // --- DATABASE RESTORE/BACKUP DISPATCHERS ---
  const backupDatabase = async () => {
    try {
      const token = localStorage.getItem('REVOLT_ADMIN_JWT_TOKEN');
      const res = await fetch('/api/backup', {
        headers: getHeaders()
      });
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `revolt_live_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setSuccessNotification('Backup downloaded successfully.');
    } catch (err) {
      setErrorNotification('Failed to retrieve backup file.');
    }
  };

  const restoreDatabase = async (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      const res = await fetch('/api/restore', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(parsed)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessNotification('Database configurations restored.');
        await fetchDatabase();
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Database restoration failed.' };
    }
  };

  // --- ORDERS MANAGEMENT ---
  const updateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessNotification(`Order #${id} status updated to ${status}.`);
        await fetchDatabase();
        return true;
      } else {
        setErrorNotification(data.error || 'Failed to update order status.');
      }
    } catch (err) {
      setErrorNotification('Failed to update order status.');
    }
    return false;
  };

  const processRefund = async (id, action) => {
    try {
      const res = await fetch(`/api/orders/${id}/refund`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessNotification(`Refund for Order #${id} ${action === 'approve' ? 'approve' : 'reject'}.`);
        await fetchDatabase();
        return true;
      } else {
        setErrorNotification(data.error || 'Failed to process refund.');
      }
    } catch (err) {
      setErrorNotification('Failed to process refund.');
    }
    return false;
  };

  return (
    <CmsContext.Provider value={{
      db,
      draftDb,
      isEditMode,
      setIsEditMode,
      isLoading,
      successNotification,
      errorNotification,
      updateDraft,
      publishChanges,
      discardChanges,
      undo,
      redo,
      canUndo: historyIdx > 0,
      canRedo: historyIdx < history.length - 1,
      loginAdmin,
      logoutAdmin,
      createProduct,
      updateProduct,
      deleteProduct,
      uploadFile,
      backupDatabase,
      restoreDatabase
    }}>
      {children}

      {/* Dynamic Glassmorphic Success/Error Notifications */}
      {successNotification && (
        <div className="fixed bottom-24 right-6 z-[99999] bg-ink text-canvas border border-clay/40 py-3.5 px-6 rounded-xl shadow-2xl backdrop-blur-xl animate-fade-in flex items-center gap-2">
          <span className="text-green-400">✓</span>
          <span className="text-[12px] uppercase font-bold tracking-wider">{successNotification}</span>
        </div>
      )}

      {errorNotification && (
        <div className="fixed bottom-24 right-6 z-[99999] bg-red-600 text-white border border-red-400/50 py-3.5 px-6 rounded-xl shadow-2xl backdrop-blur-xl animate-fade-in flex items-center gap-2">
          <span className="text-white">⚠️</span>
          <span className="text-[12px] uppercase font-bold tracking-wider">{errorNotification}</span>
        </div>
      )}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within CmsProvider');
  }
  return context;
}
