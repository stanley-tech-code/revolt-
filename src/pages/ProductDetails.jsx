import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useCms } from '../context/CmsContext';
import ProductCard from '../components/ui/ProductCard';

export default function ProductDetails() {
  const { id } = useParams();
  const { db, isLoading } = useCms();
  const { addToCart, toggleWishlist, wishlist } = useStore();

  const product = db.products?.find(p => {
    if (p.id === id) return true;
    const pSeo = db.seo?.productSeo?.[p.id];
    if (pSeo && pSeo.slug === id) return true;
    return false;
  });
  const relatedProducts = db.products?.filter(p => p.mainCategory === product?.mainCategory && p.id !== product?.id).slice(0, 3) || [];

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(() => {
    if (!product?.colors || product.colors.length === 0) return '';
    return typeof product.colors[0] === 'string' ? product.colors[0] : product.colors[0].name;
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      const defaultColor = product.colors && product.colors.length > 0 
        ? (typeof product.colors[0] === 'string' ? product.colors[0] : product.colors[0].name)
        : '';
      setSelectedColor(defaultColor);
      setCurrentImageIndex(0);
      setSelectedSize('');

      // Set Document Title and Meta Description for SEO
      const productSeo = db?.seo?.productSeo?.[product.id] || {};
      document.title = productSeo.title || `${product.name} — Revolt Elite`;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = productSeo.description || product.description || db?.seo?.description || '';
    }
  }, [id, product, db?.seo]);

  if (isLoading) {
    return (
      <div className="py-32 flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="py-32 text-center text-xl uppercase tracking-widest font-bold">Product not found.</div>;
  }

  const images = product.allImages && product.allImages.length > 0 ? product.allImages : [product.primaryImage];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.salePrice,
      color: selectedColor,
      size: selectedSize,
      image: images[0]
    });
  };

  return (
    <main className="product-details-page">
      <style dangerouslySetInnerHTML={{__html: `
        .product-details-page {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background: #fff;
          color: #1a1a1a;
          font-size: 13px;
        }
        .product-page-layout {
          display: grid;
          grid-template-columns: 650px 420px;
          gap: 60px;
          padding: 30px 40px 30px 0;
          max-width: 1200px;
          margin: 0 auto;
        }
        .image-section { position: relative; }
        .main-image-wrap {
          position: relative;
          background: #f5f0eb;
          aspect-ratio: 3 / 4;
          display: flex;
          overflow: hidden;
        }
        .main-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .wishlist-btn-main {
          position: absolute;
          top: 14px;
          right: 14px;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 10;
        }
        .wishlist-btn-main svg {
          width: 22px;
          height: 22px;
        }
        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 22px;
          color: #1a1a1a;
          padding: 10px;
          z-index: 10;
        }
        .nav-arrow.left { left: 10px; }
        .nav-arrow.right { right: 10px; }
        .scroll-indicator {
          display: flex;
          gap: 4px;
          justify-content: center;
          margin-top: 10px;
        }
        .scroll-dot {
          width: 32px;
          height: 3px;
          background: #1a1a1a;
          border-radius: 2px;
        }
        .scroll-dot.inactive {
          background: #d0d0d0;
          width: 28px;
        }
        .product-info { padding-top: 10px; }
        .product-category {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1a1a1a;
          font-weight: 500;
          margin-bottom: 10px;
        }
        .product-title {
          font-size: 26px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          line-height: 1.15;
          margin-bottom: 16px;
        }
        .price-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }
        .original-price {
          text-decoration: line-through;
          color: #888;
          font-size: 14px;
        }
        .sale-price {
          color: #c0392b;
          font-size: 16px;
          font-weight: 600;
        }
        .regular-price {
          color: #1a1a1a;
          font-size: 16px;
          font-weight: 600;
        }
        .sale-badge {
          font-size: 11px;
          letter-spacing: 0.08em;
          color: #c0392b;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .section-label {
          font-size: 12px;
          letter-spacing: 0.05em;
          margin-bottom: 10px;
        }
        .section-label span { font-weight: 700; text-transform: uppercase; }
        .divider {
          border: none;
          border-top: 1px solid #e5e5e5;
          margin: 18px 0;
        }
        .color-swatches {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }
        .swatch {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color 0.2s;
        }
        .swatch.active {
          border-color: #1a1a1a;
          outline: 2px solid #fff;
          outline-offset: -4px;
        }
        .size-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .size-guide-link {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-decoration: underline;
          cursor: pointer;
          color: #1a1a1a;
        }
        .size-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 6px;
          margin-bottom: 12px;
        }
        .size-btn {
          border: 1px solid #d0d0d0;
          background: #fff;
          padding: 10px 4px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.03em;
          cursor: pointer;
          text-align: center;
          transition: all 0.15s;
        }
        .size-btn:hover {
          border-color: #1a1a1a;
          background: #f5f5f5;
        }
        .size-btn.active {
          border-color: #1a1a1a;
          background: #1a1a1a;
          color: #fff;
        }
        .product-desc {
          font-size: 12px;
          color: #555;
          margin-bottom: 22px;
          line-height: 1.5;
        }
        .cta-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .btn-select-size {
          width: 100%;
          padding: 18px;
          border: 1.5px solid #1a1a1a;
          background: #fff;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-select-size:hover { background: #f5f5f5; }
        .btn-add-to-cart {
          width: 100%;
          padding: 18px;
          border: none;
          background: #1a1a1a;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-add-to-cart:hover { background: #333; }
        .complete-look-section {
          background: #f5f0eb;
          padding: 30px 24px 40px;
          margin-top: 40px;
        }
        .complete-look-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto 20px;
        }
        .complete-look-title {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .look-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        @media (max-width: 900px) {
          .product-page-layout { grid-template-columns: 1fr; padding: 20px; }
          .look-grid { grid-template-columns: 1fr; }
        }
      `}} />

      <div className="product-page-layout">
        
        <div className="image-section">
          <div className="gallery-container" style={{ position: 'relative' }}>
            <button className="wishlist-btn-main" onClick={() => toggleWishlist(product.id)}>
              <svg viewBox="0 0 24 24" width="22" height="22"
                fill={wishlist.includes(product.id) ? "#1a1a1a" : "none"}
                stroke="#1a1a1a"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>

            {images.length > 1 && (
              <>
                <button className="nav-arrow left" onClick={prevImage}>&#8592;</button>
                <button className="nav-arrow right" onClick={nextImage}>&#8594;</button>
              </>
            )}

            <div className="main-image-wrap">
               <img src={images[currentImageIndex]} alt={`${product.name} View ${currentImageIndex + 1}`} />
            </div>
          </div>

          {images.length > 1 && (
            <div className="scroll-indicator">
              {images.map((_, index) => (
                <div key={index} className={`scroll-dot ${index === currentImageIndex ? '' : 'inactive'}`}></div>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <div className="product-category">{product.material || product.mainCategory}</div>
          <h1 className="product-title">{product.name}</h1>

          <div className="price-row">
            {product.originalPrice !== product.salePrice ? (
              <>
                <span className="original-price">Ksh {product.originalPrice.toLocaleString()}</span>
                <span className="sale-price">Ksh {product.salePrice.toLocaleString()}</span>
              </>
            ) : (
              <span className="regular-price">Ksh {product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          {product.saleLabel && <div className="sale-badge">{product.saleLabel}</div>}


          <hr className="divider" />

          {product.colors && product.colors.length > 0 && (
            <>
              <div className="section-label">Color &nbsp; <span>{selectedColor}</span></div>
              <div className="color-swatches">
                {product.colors.map((color) => {
                  const colorName = typeof color === 'string' ? color : color.name;
                  const colorHex = typeof color === 'string' ? color.toLowerCase().replace(' ', '') : color.hex;
                  
                  return (
                    <div 
                      key={colorName}
                      className={`swatch ${selectedColor === colorName ? 'active' : ''}`} 
                      style={{ backgroundColor: colorHex }}
                      title={colorName} 
                      onClick={() => setSelectedColor(colorName)}
                    ></div>
                  );
                })}
              </div>
              <hr className="divider" />
            </>
          )}

          <div className="size-header">
            <div className="section-label" style={{marginBottom: 0}}>Size</div>
            <span className="size-guide-link">Size Guide</span>
          </div>
          <div className="size-grid" style={{marginTop: '10px'}}>
            {product.sizes && product.sizes.map((size) => (
              <button 
                key={size} 
                className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
          <div className="product-desc">{product.description}</div>

          <div className="cta-section">
            {!selectedSize ? (
              <button className="btn-select-size" disabled>SELECT A SIZE</button>
            ) : (
              <button className="btn-add-to-cart" onClick={handleAddToCart}>ADD TO CART</button>
            )}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="complete-look-section">
          <div className="complete-look-header">
            <h2 className="complete-look-title">WE THINK YOU'D LIKE</h2>
          </div>
          <div className="look-grid">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
