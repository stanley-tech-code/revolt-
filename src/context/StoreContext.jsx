import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Basic wishlist array of product IDs or names
  const [wishlist, setWishlist] = useState([]);

  // Promo code state
  const [appliedPromo, setAppliedPromo] = useState(null);

  const { currentUser, updateProfile } = useAuth();
  const hasMergedRef = useRef(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('revolt_cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));
    
    const savedWishlist = localStorage.getItem('revolt_wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Sync / Merge with currentUser on login
  useEffect(() => {
    if (currentUser && !hasMergedRef.current) {
      hasMergedRef.current = true;
      
      let mergedCart = [...cartItems];
      if (currentUser.cart && Array.isArray(currentUser.cart)) {
        // Simple merge: just take user's cart if local is empty, otherwise keep local (or combine)
        // For simplicity, let's combine and remove exact duplicates
        const combinedCart = [...currentUser.cart, ...cartItems];
        mergedCart = combinedCart.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);
        setCartItems(mergedCart);
      }

      let mergedWishlist = [...wishlist];
      if (currentUser.wishlist && Array.isArray(currentUser.wishlist)) {
        mergedWishlist = Array.from(new Set([...currentUser.wishlist, ...wishlist]));
        setWishlist(mergedWishlist);
      }

      // Push merged data back to server
      if (mergedCart.length !== cartItems.length || mergedWishlist.length !== wishlist.length) {
        updateProfile({ cart: mergedCart, wishlist: mergedWishlist });
      }
    } else if (!currentUser) {
      hasMergedRef.current = false; // Reset on logout
    }
  }, [currentUser]);

  // Save to local storage on change, and sync to backend if logged in
  useEffect(() => {
    localStorage.setItem('revolt_cart', JSON.stringify(cartItems));
    if (currentUser && hasMergedRef.current) {
      updateProfile({ cart: cartItems });
    }
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('revolt_wishlist', JSON.stringify(wishlist));
    if (currentUser && hasMergedRef.current) {
      updateProfile({ wishlist });
    }
  }, [wishlist]);

  const addToCart = (product) => {
    setCartItems(prev => {
      // Check if same product, color, and size exists
      const existing = prev.find(item => 
        item.name === product.name && 
        item.size === product.size && 
        item.color === product.color
      );
      if (existing) {
        return prev.map(item => 
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, id: Date.now().toString() }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  
  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const applyPromo = async (code) => {
    try {
      const res = await fetch('/api/promos/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedPromo(data.promo);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Network error validating promo.' };
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  return (
    <StoreContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, 
      isCartOpen, openCart, closeCart, getCartTotal, getCartCount,
      isSearchOpen, openSearch, closeSearch,
      wishlist, toggleWishlist,
      appliedPromo, applyPromo, removePromo
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}
