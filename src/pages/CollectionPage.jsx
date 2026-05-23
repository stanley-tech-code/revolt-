import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCms } from '../context/CmsContext';
import ProductCard from '../components/ui/ProductCard';

export default function CollectionPage() {
  const { mainCategory, subCategory } = useParams();
  const { db } = useCms();
  const [sortBy, setSortBy] = useState('NEWEST');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [mainCategory, subCategory]);

  const formatTitle = (str) => {
    if (!str) return '';
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const title = subCategory ? formatTitle(subCategory) : formatTitle(mainCategory);

  // Filter products based on URL parameters
  let filteredProducts = db.products.filter(p => {
    if (mainCategory === 'new-in') {
      return p.isNewArrival === true;
    }
    if (subCategory) {
      return p.subCategory === subCategory || p.mainCategory === subCategory;
    }
    if (mainCategory) {
      return p.mainCategory === mainCategory;
    }
    return true; // fallback to all if no params
  });

  // Sort products
  let sortedProducts = [...filteredProducts];
  if (sortBy === 'PRICE') {
    sortedProducts.sort((a, b) => a.salePrice - b.salePrice);
  } else if (sortBy === 'NEWEST') {
    // Mock sort, assuming higher ID is newer
    sortedProducts.sort((a, b) => b.id.localeCompare(a.id));
  } else if (sortBy === 'OLDEST') {
    sortedProducts.sort((a, b) => a.id.localeCompare(b.id));
  } else if (sortBy === 'COLOR') {
    sortedProducts.sort((a, b) => {
      const colorA = a.colors && a.colors[0] ? a.colors[0].name : '';
      const colorB = b.colors && b.colors[0] ? b.colors[0].name : '';
      return colorA.localeCompare(colorB);
    });
  }

  return (
    <main className="w-full bg-white text-black font-sans min-h-screen">
      <div className="w-full">
        
        {/* Page Header */}
        <div className="pt-10 pb-4 px-6 text-left">
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{title}</h1>
          <p className="text-sm text-gray-600 tracking-wide">
            Discover the latest styles from our {title} collection.
          </p>
        </div>

        {/* Breadcrumb */}
        <div className="px-6 pb-6 text-[11px] text-gray-500 tracking-wider flex justify-start gap-2">
          <Link to="/" className="hover:underline">Home</Link>
          <span>/</span>
          {mainCategory && (
            <>
              <Link to={`/${mainCategory}`} className="hover:underline">{formatTitle(mainCategory)}</Link>
              {subCategory && <span>/</span>}
            </>
          )}
          {subCategory && (
            <span className="text-black font-medium">{formatTitle(subCategory)}</span>
          )}
        </div>

        {/* Filter Bar */}
        <div className="flex justify-start border-y border-gray-200 overflow-x-auto scrollbar-none bg-white">
          <div className="flex px-2">
            {['NEWEST', 'PRICE', 'OLDEST', 'COLOR'].map((sortType) => (
              <button 
                key={sortType}
                className={`px-6 py-4 text-[11px] tracking-[0.1em] uppercase flex items-center gap-1.5 transition-colors hover:bg-gray-50 ${sortBy === sortType ? 'font-bold text-black' : 'font-medium text-gray-600'}`}
                onClick={() => setSortBy(sortType)}
              >
                {sortType}
                <svg className="w-2.5 h-2.5" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 1l4 4 4-4"/>
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 border-l border-gray-200 w-full">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((p) => (
              <div key={p.id} className="border-r border-b border-gray-200 p-0">
                <ProductCard product={p} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-500">
              <p>No products found in this category.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
