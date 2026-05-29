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
    customers: [],
    promos: [],
    seo: { title: 'REVOLT — Refined Luxury Essentials', description: '', googleAnalyticsId: '', facebookPixelId: '', promoBannerActive: true, promoBannerText: '' },
    theme: {
      primaryColor: '#000000',
      secondaryColor: '#f5f0eb',
      backgroundColor: '#ffffff',
      buttonColor: '#000000',
      buttonTextColor: '#ffffff',
      headingFont: 'Inter',
      bodyFont: 'Inter',
      sectionPadding: '4rem'
    },
    assets: { logo: '', favicon: '' },
    social: { instagram: '', tiktok: '', facebook: '', twitter: '', youtube: '', pinterest: '' },
    scripts: { header: '', footer: '' },
    notifications: { templates: [], campaigns: [], automations: [], segments: [] },
    settings: {
      shipping: { zones: [], fees: [], pickupLocations: [] },
      payments: { gateways: [], currency: 'KES', taxMode: 'exclusive' },
      localization: { language: 'en', timeFormat: '24h' },
      legal: { cookieBannerEnabled: true, privacyPolicy: '', terms: '', refund: '' },
      maintenance: { active: false, message: 'We are currently upgrading our store. Check back soon!' },
      developer: { webhookUrls: [] }
    },
    twilio_settings: {
      sid: '',
      authToken: '',
      senderPhone: '',
      messagingServiceSid: '',
      testMode: true
    },
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
      // 1. Fetch ALL public CMS data & products in one single optimized batch call
      const initRes = await fetch('/api/init');
      const initData = await initRes.json();
      
      if (!initData.success) {
        throw new Error(initData.error || 'Failed to initialize app data');
      }

      let orders = [];
      let customers = [];
      let promos = [];
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
              const ordersRes = await fetch(`/api/orders?t=${Date.now()}`, { headers: { 'Authorization': `Bearer ${token}` } });
              const ordersData = await ordersRes.json();
              if (ordersData.success) {
                orders = ordersData.orders;
              }
            } catch (err) {
              console.error("Failed to fetch orders", err);
            }

            // Fetch real-time customers if admin is authenticated
            if (currentUser.role === 'Super Admin' || currentUser.role === 'Editor') {
              try {
                const custRes = await fetch(`/api/customers?t=${Date.now()}`, { headers: { 'Authorization': `Bearer ${token}` } });
                const custData = await custRes.json();
                if (custData.success) {
                  customers = custData.customers;
                }
              } catch (err) {
                console.error("Failed to fetch customers", err);
              }
            }

            // Fetch promos (Super Admin only)
            if (currentUser.role === 'Super Admin') {
              try {
                const promosRes = await fetch('/api/promos', { headers: { 'Authorization': `Bearer ${token}` } });
                const promosData = await promosRes.json();
                if (promosData.success) {
                  promos = promosData.promos;
                }
              } catch (err) {
                console.error("Failed to fetch promos", err);
              }
            }
          } else {
            localStorage.removeItem('REVOLT_ADMIN_JWT_TOKEN');
          }
        } catch (e) {
          console.error("Failed to verify admin token");
        }
      }

      const freshDb = {
        homepage: initData.data.homepage || db.homepage,
        products: initData.data.products || db.products,
        seo: initData.data.seo || db.seo,
        theme: initData.data.theme || db.theme,
        assets: initData.data.assets || db.assets,
        social: initData.data.social || db.social,
        scripts: initData.data.scripts || db.scripts,
        notifications: initData.data.notifications || db.notifications,
        settings: initData.data.settings || db.settings,
        twilio_settings: initData.data.twilio_settings || db.twilio_settings,
        orders,
        customers,
        promos,
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

      // 3. Sync generic CMS config
      await Promise.all([
        fetch('/api/cms/theme', { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ data: draftDb.theme }) }),
        fetch('/api/cms/assets', { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ data: draftDb.assets }) }),
        fetch('/api/cms/social', { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ data: draftDb.social }) }),
        fetch('/api/cms/scripts', { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ data: draftDb.scripts }) }),
        fetch('/api/cms/notifications', { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ data: draftDb.notifications }) }),
        fetch('/api/cms/settings', { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ data: draftDb.settings }) }),
        fetch('/api/cms/twilio_settings', { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ data: draftDb.twilio_settings }) })
      ]);

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

  const sendNotification = async (customer, phone, channel, templateId, content, campaignId) => {
    try {
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ customer, phone, channel, templateId, content, campaignId })
      });
    } catch(e) {}
  };

  const fetchTwilioConversations = async () => {
    try {
      const res = await fetch('/api/twilio/conversations', { headers: getHeaders() });
      const data = await res.json();
      return data.success ? data.logs : [];
    } catch (e) {
      return [];
    }
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

  const factoryResetDatabase = async () => {
    try {
      const res = await fetch('/api/factory-reset', {
        method: 'POST',
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setSuccessNotification('Factory reset complete. All data wiped.');
        await fetchDatabase();
        return { success: true };
      } else {
        setErrorNotification(data.error || 'Factory reset failed.');
        return { success: false, error: data.error };
      }
    } catch (err) {
      setErrorNotification('Factory reset failed.');
      return { success: false, error: 'Factory reset failed.' };
    }
  };

  const updateOrderStatus = async (id, status, deliveryInfo = undefined) => {
    // Optimistic UI update (Proper React state update)
    setDb(prev => {
      const newDb = { ...prev };
      if (newDb.orders) {
        const orderIndex = newDb.orders.findIndex(o => o.id === id);
        if (orderIndex > -1) {
          newDb.orders = [...newDb.orders];
          newDb.orders[orderIndex] = { ...newDb.orders[orderIndex], status };
          if (deliveryInfo) {
             newDb.orders[orderIndex].deliveryInfo = deliveryInfo;
          }
        }
      }
      return newDb;
    });

    try {
      const bodyPayload = { status };
      if (deliveryInfo) {
         bodyPayload.deliveryInfo = deliveryInfo;
      }
      
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(bodyPayload)
      });
      const data = await res.json();
      if (data.success) {
        alert('DEBUG: Database successfully updated order status!');
        setSuccessNotification(`Order #${id} status updated to ${status}.`);
        await fetchDatabase();
        return true;
      } else {
        alert('DEBUG ERROR: Backend returned success=false. ' + data.error);
        setErrorNotification(data.error || 'Failed to update order status.');
        await fetchDatabase(); // Revert to true server state
      }
    } catch (err) {
      alert('DEBUG ERROR: Fetch threw a catastrophic error: ' + err.message);
      setErrorNotification('Failed to update order status.');
      await fetchDatabase(); // Revert to true server state
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

  const updateCustomerStatus = async (id, status) => {
    // Optimistic UI
    setDb(prev => {
      const newDb = { ...prev };
      if (newDb.customers) {
        const idx = newDb.customers.findIndex(c => c.id === id);
        if (idx > -1) {
          newDb.customers = [...newDb.customers];
          newDb.customers[idx] = { ...newDb.customers[idx], role: status };
        }
      }
      return newDb;
    });

    try {
      const res = await fetch(`/api/customers/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessNotification(`Customer account is now ${status}.`);
        await fetchDatabase();
        return true;
      } else {
        setErrorNotification(data.error || 'Failed to update customer.');
        await fetchDatabase();
      }
    } catch (err) {
      setErrorNotification('Failed to update customer status.');
      await fetchDatabase();
    }
    return false;
  };

  const updateCustomerOptIn = async (id, field, value) => {
    setDb(prev => {
      const newDb = { ...prev };
      if (newDb.customers) {
        const idx = newDb.customers.findIndex(c => c.id === id);
        if (idx > -1) {
          newDb.customers = [...newDb.customers];
          newDb.customers[idx] = { ...newDb.customers[idx], [field]: value };
        }
      }
      return newDb;
    });

    try {
      await fetch(`/api/customers/${id}/optin`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ field, value })
      });
      return true;
    } catch (err) {
      await fetchDatabase();
      return false;
    }
  };

  const deleteCustomer = async (id) => {
    // Optimistic UI
    setDb(prev => {
      const newDb = { ...prev };
      if (newDb.customers) {
        newDb.customers = newDb.customers.filter(c => c.id !== id);
      }
      return newDb;
    });

    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setSuccessNotification('Customer account deleted successfully.');
        await fetchDatabase();
        return true;
      } else {
        setErrorNotification(data.error || 'Failed to delete customer.');
        await fetchDatabase();
      }
    } catch (err) {
      setErrorNotification('Failed to delete customer.');
      await fetchDatabase();
    }
    return false;
  };

  // --- PROMO CODES CRUD ---
  const createPromo = async (promoData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/promos', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(promoData)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessNotification(`Promo code "${data.promo.code}" created successfully.`);
        await fetchDatabase();
        return { success: true, promo: data.promo };
      } else {
        setErrorNotification(data.error || 'Failed to create promo.');
        return { success: false, error: data.error };
      }
    } catch (err) {
      setErrorNotification('Failed to create promo.');
      return { success: false, error: 'Network error.' };
    } finally {
      setIsLoading(false);
    }
  };

  const updatePromo = async (id, fields) => {
    try {
      const res = await fetch(`/api/promos/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(fields)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessNotification(`Promo code updated.`);
        await fetchDatabase();
        return { success: true };
      } else {
        setErrorNotification(data.error || 'Failed to update promo.');
        return { success: false, error: data.error };
      }
    } catch (err) {
      setErrorNotification('Failed to update promo.');
      return { success: false };
    }
  };

  const deletePromo = async (id, code) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/promos/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setSuccessNotification(`Promo code "${code}" deleted.`);
        await fetchDatabase();
        return { success: true };
      } else {
        setErrorNotification(data.error || 'Failed to delete promo.');
        return { success: false };
      }
    } catch (err) {
      setErrorNotification('Failed to delete promo.');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
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
      restoreDatabase,
      updateOrderStatus,
      processRefund,
      updateCustomerStatus,
      updateCustomerOptIn,
      deleteCustomer,
      createPromo,
      updatePromo,
      deletePromo,
      sendNotification,
      fetchTwilioConversations,
      factoryResetDatabase
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
