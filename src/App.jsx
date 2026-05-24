import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AnnouncementBar from './components/ui/AnnouncementBar';
import Navbar from './components/layout/Navbar';
import MobileMenu from './components/layout/MobileMenu';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import { useCms } from './context/CmsContext';
import { StoreProvider } from './context/StoreContext';
import CartDrawer from './components/ui/CartDrawer';
import SearchModal from './components/ui/SearchModal';

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

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Checkout from './pages/Checkout';

function Layout({ children }) {
  const { db } = useCms();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Close menu on route change
  const location = useLocation();
  const isTransparentPage = location.pathname === '/' || location.pathname === '/clothing/clothing';

  React.useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
    document.title = db.seo.title;
  }, [location.pathname, db.seo.title]);

  return (
    <div className="bg-canvas text-ink min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 w-full z-[999]">
        <AnnouncementBar />
        <Navbar onMenuToggle={() => setMobileMenuOpen(true)} />
      </div>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <CartDrawer />
      <SearchModal />
      <div className={`flex-1 ${isTransparentPage ? '' : 'pt-[88px] md:pt-[108px]'}`}>
        {children}
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
          <Layout>
            <Routes>
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
              
              <Route path="/components/account" element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              } />
              
              {/* We will migrate Wishlist into the account dashboard later, or just protect it */}
              <Route path="/components/wishlist" element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              } />

              {/* CHECKOUT PAGE */}
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />

              {/* DYNAMIC PAGES */}
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/:mainCategory/:subCategory" element={<CollectionPage />} />
              <Route path="/:mainCategory" element={<CollectionPage />} />
            </Routes>
          </Layout>
        </Router>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
