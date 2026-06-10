import React, { createContext, useContext, useEffect, useCallback } from 'react';

const AnalyticsContext = createContext();

export function AnalyticsProvider({ children }) {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!measurementId) return;

    // 1. Check existing consent state
    const hasConsent = localStorage.getItem('REVOLT_COOKIE_CONSENT') === 'true';

    // 2. We skip script injection because it is now directly in index.html
    // but we can update consent if it was already granted
    if (hasConsent && window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted'
      });
    }
  }, [measurementId]);

  const updateConsent = useCallback((granted) => {
    if (!window.gtag) return;
    window.gtag('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied'
    });
  }, []);

  const trackPageView = useCallback((path) => {
    if (!measurementId || !window.gtag) return;
    window.gtag('event', 'page_view', {
      page_path: path,
      send_to: measurementId
    });
  }, [measurementId]);

  const trackEvent = useCallback((eventName, params = {}) => {
    if (!measurementId || !window.gtag) return;
    window.gtag('event', eventName, params);
  }, [measurementId]);

  const setUserProperties = useCallback((properties) => {
    if (!measurementId || !window.gtag) return;
    window.gtag('set', 'user_properties', properties);
  }, [measurementId]);

  return (
    <AnalyticsContext.Provider value={{
      updateConsent,
      trackPageView,
      trackEvent,
      setUserProperties
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
}
