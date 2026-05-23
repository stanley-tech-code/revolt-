import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function ProductDetails() {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('desert');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart, toggleWishlist, wishlist } = useStore();
  
  const productId = "product-1";
  const productName = "OVERSIZED STRAIGHT LEG PANT";
  const productPrice = 11620;

  const images = [
    '/images/product-1.jpg',
    '/images/campaign-1.jpg',
    '/images/product-2.jpg',
    '/images/product-3.jpg',
    '/images/product-4.jpg'
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      id: productId,
      name: productName,
      price: productPrice,
      color: selectedColor,
      size: selectedSize,
      image: images[0]
    });
  };

  return (
    <main className="product-details-pa
              </div>
              <select className="look-select">
                <option>Select Size</option>
                <option>XXS</option><option>XS</option><option>S</option>
                <option>M</option><option>L</option><option>XL</option>
              </select>
              <button className="look-add-btn">ADD TO CART</button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="look-card">
            <div className="look-card-img">
              <img src="/images/product-3.jpg" alt="Oversized Anorak" />
            </div>
            <div className="look-card-info">
              <div className="look-card-top">
                <span className="look-card-category">WOVEN COTTON</span>
                <div className="look-card-prices">
                  <span className="look-original">KSH 32,000</span>
                  <span className="look-sale">KSH 19,200</span>
                </div>
              </div>
              <div className="look-card-name">OVERSIZED ANORAK</div>
              <div className="look-sale-badge">40% OFF BI-ANNUAL SALE</div>
              <div className="look-color-row">
                <span className="look-color-label">Color</span>
                <span className="look-color-value">Desert</span>
              </div>
              <select className="look-select">
                <option>Select Size</option>
                <option>XXS</option><option>XS</option><option>S</option>
                <option>M</option><option>L</option><option>XL</option>
              </select>
              <button className="look-add-btn">ADD TO CART</button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
