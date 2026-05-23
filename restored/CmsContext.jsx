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
    se
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
