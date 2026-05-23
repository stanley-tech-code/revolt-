import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useCms } from '../../context/CmsContext';
import ProductCard from '../../components/ui/ProductCard';

export default function Wishlist() {
  const { wishlist } = useStore();
  const { db } = useCms();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter the products from the database that are currently in the user's wishlist
  const savedProducts = (db.products || []).filter(product => wishlist.includes(product.id));

  return (
    <main className="bg-canvas min-h-screen text-ink font-sans pb-24">
      <section className="pt-12 pb-8 px-6 md:px-12 border-b border-clay/20 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-ink">Your Wishlist</h1>
          <span className="text-[12px] font-medium tracking-widest uppercase text-cocoa">{savedProducts.length} Items</span>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12">
        {savedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-clay mb-6">
              <path d="M20.8 5.6a5.5 5.5 0 0 0-9 1.7 5.5 5.5 0 0 0-9-1.7c-2.1 2.1-2.1 5.6 0 7.7l9 9 9-9c2.1-2.1 2.1-5.6 0-7.7Z"/>
            </svg>
            <h2 className="text-[18px] font-bold uppercase tracking-widest mb-4">Nothing to see here</h2>
            <p className="text-[13px] text-cocoa mb-8 max-w-md">You haven't saved any items to your wishlist yet. Start shopping and add your favorite items to save them for later.</p>
            <Link to="/clothing/all-clothing" className="inline-block bg-ink text-canvas py-4 px-10 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-ink/80 transition-colors">Start Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {savedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
