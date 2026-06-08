import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import AnnouncementBar from './components/ui/AnnouncementBar';
import Navbar from './components/layout/Navbar';
import MobileMenu from './components/layout/MobileMenu';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import { useCms } from './context/CmsContext';
import { StoreProvider } from './context/StoreContext';
import CartDrawer from './components/ui/CartDrawer';
import SearchModal from './components/ui/SearchModal';
import CookieBanner from './components/ui/CookieBanner';
import NewsletterPopup from './components/ui/NewsletterPopup';
import { Outlet } from 'react-router-dom';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReturns from './pages/admin/AdminReturns';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminCarts from './pages/admin/AdminCarts';
import AdminFinance from './pages/admin/AdminFinance';
import AdminPromotions from './pages/admin/AdminPromotions';
import AdminContent from './pages/admin/AdminContent';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminTwilio from './pages/admin/AdminTwilio';
import AdminSettings from './pages/admin/AdminSettings';
import AdminMessages from './pages/admin/AdminMessages';
import AdminNewsletter from './pages/admin/AdminNewsletter';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import ErrorBoundary from './components/ui/ErrorBoundary';

const AdminAnalytics = React.lazy(() => import('./pages/admin/AdminAnalytics'));

import OurStory from './pages/about/OurStory';
import Sustainability from './pages/about/Sustainability';
import Careers from './pages/about/Careers';
import Press from './pages/about/Press';

import Returns from './pages/help/Returns';
import OrderTracking from './pages/help/OrderTracking';
import SizeGuide from './pages/help/SizeGuide';
import Contact from './pages/help/Contact';

import Account from './pages/components/Account';
import Wishlist from './pages/components/Wishlist';

import ProductDetails from './pages/ProductDetails';
import CollectionPage from './pages/CollectionPage';
import Preferences from './pages/Preferences';
import PolicyPage from './pages/PolicyPage';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Checkout from './pages/Checkout';

function ClientLayout() {
  const { db } = useCms();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Close menu on route change
  const location = useLocation();
  const isTransparentPage = location.pathname === '/' || location.pathname === '/clothing/clothing';

  React.useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
    if (db?.seo?.title) {
      document.title = db.seo.title;
    }
    fetch('/api/track-visit', { method: 'POST' }).catch(() => {});
  }, [location.pathname, db?.seo?.title]);

  // Inject Custom Scripts
  React.useEffect(() => {
    if (!db?.scripts) return;
    
    // Clean up old scripts by assigning them an ID and removing if exists
    const manageScript = (id, content, target) => {
      let el = document.getElementById(id);
      if (el) el.remove();
      if (content) {
        el = document.createElement('script');
        el.id = id;
        el.innerHTML = content;
        target.appendChild(el);
      }
    };
    
    manageScript('custom-header-script', db.scripts.header, document.head);
    manageScript('custom-footer-script', db.scripts.footer, document.body);
  }, [db?.scripts]);

  const themeVars = {
    '--color-canvas': db?.theme?.backgroundColor || '#ffffff',
    '--color-ink': db?.theme?.primaryColor || '#000000',
    '--color-sand': db?.theme?.secondaryColor || '#f5f0eb',
    '--color-btn': db?.theme?.buttonColor || '#000000',
    '--color-btn-text': db?.theme?.buttonTextColor || '#ffffff',
    '--font-heading': db?.theme?.headingFont || 'Inter, sans-serif',
    '--font-body': db?.theme?.bodyFont || 'Inter, sans-serif',
    '--section-padding': db?.theme?.sectionPadding || '4rem',
  };

  if (db?.settings?.maintenance?.active) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6 text-center animate-fade-in z-[9999] fixed inset-0">
        <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-widest mb-6">Store Paused</h1>
        <p className="text-sm md:text-base max-w-md mx-auto text-gray-500 uppercase tracking-widest leading-relaxed">
          {db?.settings?.maintenance?.message || 'We are currently performing maintenance. Please check back later.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-canvas text-ink min-h-screen flex flex-col" style={themeVars}>
      <div className="fixed top-0 left-0 w-full z-[999]">
        <AnnouncementBar />
        <Navbar onMenuToggle={() => setMobileMenuOpen(!isMobileMenuOpen)} isMenuOpen={isMobileMenuOpen} />
      </div>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <CartDrawer />
      <SearchModal />
      <CookieBanner />
      <NewsletterPopup />
      <div className={`flex-1 ${isTransparentPage ? '' : 'pt-[88px] md:pt-[108px]'}`}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Router>
          <Routes>
            {/* ADMIN ROUTES */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="returns" element={<AdminReturns />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="carts" element={<AdminCarts />} />
              <Route path="finance" element={<AdminFinance />} />
              <Route path="promotions" element={<AdminPromotions />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="notifications" element={<AdminProtectedRoute allowedRoles={['Super Admin', 'Editor', 'Marketing', 'Support']}><AdminNotifications /></AdminProtectedRoute>} />
              <Route path="newsletter" element={<AdminProtectedRoute allowedRoles={['Super Admin', 'Marketing']}><AdminNewsletter /></AdminProtectedRoute>} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="twilio" element={<AdminProtectedRoute allowedRoles={['Super Admin']}><AdminTwilio /></AdminProtectedRoute>} />
              <Route path="analytics" element={
                <ErrorBoundary>
                  <React.Suspense fallback={<div className="p-10 text-center animate-pulse font-bold">Loading Analytics...</div>}>
                    <AdminAnalytics />
                  </React.Suspense>
                </ErrorBoundary>
              } />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* CLIENT STOREFRONT ROUTES */}
            <Route element={<ClientLayout />}>
              <Route path="/" element={<Home />} />
              
              {/* AUTH PAGES */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* STATIC PAGES */}
              <Route path="/about/our-story" element={<OurStory />} />
              <Route path="/about/sustainability" element={<Sustainability />} />
              <Route path="/about/careers" element={<Careers />} />
              <Route path="/about/press" element={<Press />} />
              
              <Route path="/help/returns" element={<Returns />} />
              <Route path="/help/order-tracking" element={<OrderTracking />} />
              <Route path="/help/size-guide" element={<SizeGuide />} />
              <Route path="/help/contact" element={<Contact />} />
              
              <Route path="/policies/:slug" element={<PolicyPage />} />
              <Route path="/preferences" element={<Preferences />} />

              <Route path="/components/account" element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              } />
              
              <Route path="/components/wishlist" element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              } />

              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />

              {/* DYNAMIC PAGES */}
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/:mainCategory/:subCategory" element={<CollectionPage />} />
              <Route path="/:mainCategory" element={<CollectionPage />} />
            </Route>
          </Routes>
        </Router>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
