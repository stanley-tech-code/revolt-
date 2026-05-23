import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useCms } from '../../context/CmsContext';
import { Link, useNavigate } from 'react-router-dom';
import { performSearch } from '../../utils/searchUtils';

export default function SearchModal() {
  const { isSearchOpen, closeSearch } = useStore();
  const { db } = useCms();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
    } else {
      setResults(performSearch(query, db.products || []));
    }
  }, [query, db.products]);

  const handleProductClick = (id) => {
    closeSearch();
    navigate(`/product/1`); // Using static /product/1 for demo, usually \`/product/\${id}\`
  };

  if (!isSearchOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-white/95 z-[9999] backdrop-blur-md animate-in fade-in duration-200 flex flex-col font-sans">
        <div className="w-full max-w-[1200px] mx-auto px-6 py-8">
          <div className="flex justify-end mb-8">
            <button onClick={closeSearch} className="p-2 hover:opacity-50 transition-opacity">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5">
                <path d="M4 4L20 20M20 4L4 20" />
              </svg>
            </button>
          </div>
          
          <div className="relative border-b-2 border-black pb-4 mb-16">
            <input 
              type="text" 
              autoFocus
              placeholder="WHAT ARE YOU LOOKING FOR?" 
              className="w-full text-[28px] md:text-[42px] font-bold uppercase tracking-wider outline-none bg-transparent placeholder-gray-300"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="absolute right-0 bottom-4 p-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2">
                <circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mt-8 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
            {query.trim() === '' ? (
              <div className="col-span-1 md:col-span-4">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-gray-500">Suggested</h3>
                <ul className="flex flex-col gap-4 text-[13px] tracking-wide text-black font-medium">
                  <li><Link to="/clothing/dresses" onClick={closeSearch} className="hover:text-gray-500 transition-colors">Dresses</Link></li>
                  <li><Link to="/swimwear/bikinis" onClick={closeSearch} className="hover:text-gray-500 transition-colors">Bikinis</Link></li>
                  <li><Link to="/clothing/hoodies" onClick={closeSearch} className="hover:text-gray-500 transition-colors">Hoodies</Link></li>
                  <li><Link to="/accessories/bags" onClick={closeSearch} className="hover:text-gray-500 transition-colors">Bags</Link></li>
                </ul>
              </div>
            ) : results.length > 0 ? (
              results.map(product => (
                <div key={product.id} className="col-span-1 group cursor-pointer" onClick={() => handleProductClick(product.id)}>
                  <div className="aspect-[3/4] bg-[#f5f3f0] overflow-hidden mb-4 relative">
                    <img src={product.primaryImage || "/images/product-1.jpg"} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    {product.stock <= 3 && <div className="absolute bottom-2 left-2 bg-red-600 text-white text-[9px] uppercase tracking-wider px-2 py-1 font-bold">Low Stock</div>}
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider mb-1 line-clamp-1">{product.name}</h4>
                    <span className="text-[11px] text-gray-500 mb-2 uppercase">{product.subCategory?.replace('-', ' ')}</span>
                    <span className="text-[12px] font-medium">Ksh {product.salePrice?.toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-4 text-center py-20">
                <p className="text-[14px] text-gray-500 uppercase tracking-widest font-bold">No results found for "{query}"</p>
                <p className="text-[12px] text-gray-400 mt-2">Try checking your spelling or searching for a different term.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
