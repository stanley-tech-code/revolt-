import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';

// CRITICAL SYNCHRONOUS IMPORTS
import AnnouncementBar from './components/ui/AnnouncementBar';
import Navbar from './components/layout/Navbar';
import MobileMenu from './components/layout/MobileMenu';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import { useCms } from './context/CmsContext';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import CartDrawer from './components/ui/CartDrawer';
import SearchModal from './components/ui/SearchModal';
import CookieBanner from './components/ui/CookieBanner';
import NewsletterPopup from './components/ui/NewsletterPopup';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import ErrorBoundary from './components/ui/ErrorBoundary';

// LAZY LOADED ADMIN ROUTES
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminReturns = lazy(() => import('./pages/admin/AdminReturns'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminCarts = lazy(() => import('./pages/admin/AdminCarts'));
const AdminFinance = lazy(() => import('./pages/admin/AdminFinance'));
const AdminPromotions = lazy(() => import('./pages/admin/AdminPromotions'));
const AdminContent = lazy(() => import('./pages/admin/AdminContent'));
const AdminNotifications = lazy(() => import('./pages/admin/AdminNotifications'));
const AdminTwilio = lazy(() => import('./pages/admin/AdminTwilio'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminNewsletter = lazy(() => import('./pages/admin/AdminNewsletter'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));

// LAZY LOADED STOREFRONT ROUTES
const OurStory = lazy(() => import('./pages/about/OurStory'));
const Sustainability = lazy(() => import('./pages/about/Sustainability'));
const Careers = lazy(() => import('./pages/about/Careers'));
const Press = lazy(() => import('./pages/about/Press'));

const Returns = lazy(() => import('./pages/help/Returns'));
const OrderTracking = lazy(() => import('./pages/help/OrderTracking'));
const SizeGuide = lazy(() => import('./pages/help/SizeGuide'));
const Contact = lazy(() => import('./pages/help/Contact'));

const Account = lazy(() => import('./pages/components/Account'));
const Wishlist = lazy(() => import('./pages/components/Wishlist'));

const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const Preferences = lazy(() => import('./pages/Preferences'));
const PolicyPage = lazy(() => import('./pages/PolicyPage'));

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Checkout = lazy(() => import('./pages/Checkout'));

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
    
    // Throttle API tracking to once per session
    if (!sessionStorage.getItem('revolt_visit_tracked')) {
      fetch('/api/track-visit', { method: 'POST' })
        .then(() => sessionStorage.setItem('revolt_visit_tracked', 'true'))
        .catch(() => {});
    }
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
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div></div>}>
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
              <Route path="analytics" element={<AdminAnalytics />} />
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
          </Suspense>
        </Router>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
