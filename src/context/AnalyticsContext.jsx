import React, { createContext, useContext, useEffect, useCallback } from 'react';

const AnalyticsContext = createContext();

export function AnalyticsProvider({ children }) {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!measurementId) return;

    // 1. Check existing consent state
    const hasConsent = localStorage.getItem('REVOLT_COOKIE_CONSENT') === 'true';

    // 2. Initialize window.dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    // 3. Set Default Consent (before the tag loads)
    // If they already consented, grant it. Otherwise, deny it.
    gtag('consent', 'default', {
      ad_storage: hasConsent ? 'granted' : 'denied',
      analytics_storage: hasConsent ? 'granted' : 'denied',
      ad_user_data: hasConsent ? 'granted' : 'denied',
      ad_personalization: hasConsent ? 'granted' : 'denied',
      wait_for_update: 500
    });

    // 4. Load the GA script dynamically
    const scriptId = 'ga4-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      // 5. Initialize config
      gtag('js', new Date());
      gtag('config', measurementId, {
        send_page_view: false // We will handle page views manually to support SPA routing
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
