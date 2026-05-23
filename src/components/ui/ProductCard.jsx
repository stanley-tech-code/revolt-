import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

export default function ProductCard({ product }) {
  const { toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <Link to={`/product/${product.id}`} className="product-card group relative block text-left" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="product-image aspect-[3/4] bg-[#f5f3f0] overflow-hidden relative mb-3">
        {product.secondaryImage && (
          <img 
            loading="lazy"
            src={product.secondaryImage} 
            alt={`${product.name} Alternate`} 
            className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 z-[1]" 
          />
        )}
        <img 
          loading="lazy"
          src={product.primaryImage || product.image} 
          alt={product.name} 
          className="w-full h-full object-cover absolute top-0 left-0 transition-transform duration-[1200ms] group-hover:scale-105 z-[2] group-hover:opacity-0" 
        />
        
        {product.isBestSeller && (
          <div className="absolute bottom-3 left-3 bg-black/75 text-white text-[9px] uppercase tracking-[0.08em] px-2 py-1 font-semibold z-10">
            Best Seller
          </div>
        )}

        <button 
          className="absolute top-3 right-3 z-10 p-1 flex items-center justify-center transition-transform hover:scale-110" 
          onClick={(e) => { 
            e.preventDefault();
            e.stopPropagation(); 
            toggleWishlist(product.id); 
          }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill={isWishlisted ? '#1a1a1a' : 'none'} stroke={isWishlisted ? '#1a1a1a' : '#1a1a1a'} strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      
      <div className="product-info flex flex-col gap-1 px-4 pb-4 pt-1">
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1.5 mb-1">
            {product.colors.map((color, idx) => (
              <div 
                key={idx} 
                className={`w-3.5 h-3.5 rounded-full border border-[#ddd] ${idx === 0 ? 'ring-1 ring-offset-1 ring-black' : ''}`} 
                style={{ backgroundColor: color.hex }}
                title={color.name}
              ></div>
            ))}
          </div>
        )}
        
        <span className="text-[10px] uppercase tracking-[0.12em] text-[#888] font-medium">
          {product.material || product.mainCategory}
        </span>
        
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#1a1a1a] leading-tight mb-1">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2">
          {product.originalPrice !== product.salePrice ? (
            <>
              <span className="text-[12px] text-[#999] line-through tracking-[0.04em]">
                Ksh {product.originalPrice.toLocaleString()}
              </span>
              <span className="text-[12px] font-semibold text-[#1a1a1a] tracking-[0.04em]">
                Ksh {product.salePrice.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-[12px] text-[#1a1a1a] tracking-[0.04em]">
              Ksh {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        
        {product.saleLabel && (
          <div className="text-[10px] tracking-[0.08em] text-[#c0392b] uppercase font-semibold mt-1">
            {product.saleLabel}
          </div>
        )}
      </div>
    </Link>
  );
}
