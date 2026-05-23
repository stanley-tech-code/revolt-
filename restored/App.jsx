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

import SwimFitGuide from './pages/swimwear/SwimFitGuide';
import TeesTanks from './pages/clothing/TeesTanks';
import Shorts from './pages/clothing/Shorts';
import Strapless from './pages/bras/Strapless';
import Clothing from './pages/clothing/Clothing';
import TrendGuide from './pages/new-in/TrendGuide';
import SignatureScentsCompleteTheUniformWithOurNewFragranceLine from './pages/other/SignatureScentsCompleteTheUniformWithOurNewFragranceLine';
import Wishlist from './pages/components/Wishlist';
import AllSwimwear from './pages/swimwear/AllSwimwear';
import Seamless from './pages/underwear/Seamless';
import Bags from './pages/accessories/Bags';
import GlassesShades from './pages/accessories/GlassesShades';
import OurStory from './pages/about/OurStory';
import Account from './pages/components/Account';
import FullCoverage from './pages/bras/FullCoverage';
        <Route path="/other/second-skin-legging-clay" element={<SecondSkinLeggingClay />} />
        <Route path="/swimwear/bikinis" element={<Bikinis />} />
        <Route path="/components/instagram" element={<Instagram />} />
        <Route path="/components/pinterest" element={<Pinterest />} />
        <Route path="/clothing/hoodies" element={<Hoodies />} />
        <Route path="/clothing/maternity" element={<Maternity />} />
        <Route path="/accessories/perfumes" element={<Perfumes />} />
        <Route path="/components/tiktok" element={<Tiktok />} />
        <Route path="/other/the-essentials-edit-shop-the-looks-from-our-latest-campaign" element={<TheEssentialsEditShopTheLooksFromOurLatestCampaign />} />
        <Route path="/new-in/the-editorial-edit" element={<TheEditorialEdit />} />
        <Route path="/swimwear/swimsuits" element={<Swimsuits />} />
        <Route path="/other/view-all" element={<ViewAll />} />
        <Route path="/new-in/all-new-arrivals" element={<AllNewArrivals />} />
        <Route path="/other/essentials" element={<Essentials />} />
        <Route path="/underwear/all-underwear" element={<AllUnderwear />} />
        <Route path="/other/lounge" element={<Lounge />} />
        <Route path="/bras/everyday-comfort" element={<EverydayComfort />} />
        <Route path="/bras/lightly-lined" element={<LightlyLined />} />
        <Route path="/accessories/all-accessories" element={<AllAccessories />} />
        <Route path="/accessories/gifting" element={<Gifting />} />
        <Route path="/swimwear/swimwear" element={<Swimwear />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
        </Layout>
      </Router>
    </StoreProvider>
  );
}

export default App;
