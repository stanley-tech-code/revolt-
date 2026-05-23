import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Link } from 'react-router-dom';

export default function AllNewArrivals() {
  const { toggleWishlist, wishlist } = useStore();
  const [sortBy, setSortBy] = useState('NEWEST');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full bg-white text-black text-[13px] font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        .dresses-page-wrap * { margin: 0; padding: 0; box-sizing: border-box; }
        .dresses-page-wrap { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #fff; color: #000; font-size: 13px; }

        /* Page title */
        .page-header {
          padding: 36px 24px 16px;
        }
        .page-header h1 {
          font-size: 26px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .page-header p {
          font-size: 13px;
          color: #444;
          letter-spacing: 0.02em;
        }

        /* Category scroll */
        .categories {
          display: flex;
          gap: 12px;
          padding: 16px 24px 24px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .categories::-webkit-scrollbar { display: none; }
        .category-item
                <svg viewBox="0 0 24 24" fill={wishlist.includes('allnewarrivals-prod-8') ? '#1a1a1a' : 'none'} stroke={wishlist.includes('allnewarrivals-prod-8') ? '#1a1a1a' : '#000'} strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              </div>
            </Link>

            {/* Card 5 */}
            <Link to="/product/1" className="rec-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
              <div className="rec-img">
                <img src="/images/campaign-1.jpg" alt="High Leg Bikini Bottom" />
              </div>
              <div className="rec-info">
                <div className="rec-material">Iconic Swim</div>
                <div className="rec-name">High Leg Bikini Bottom</div>
                <div className="rec-prices">
                  <span className="rec-price-only">Ksh 8,200</span>
                </div>
                <button className="wishlist-btn" onClick={(e) => { e.preventDefault(); toggleWishlist('allnewarrivals-prod-9'); }}>
                <svg viewBox="0 0 24 24" fill={wishlist.includes('allnewarrivals-prod-9') ? '#1a1a1a' : 'none'} stroke={wishlist.includes('allnewarrivals-prod-9') ? '#1a1a1a' : '#000'} strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              </div>
            </Link>

          </div>{/* end rec-strip */}
        </div>
      </div>
    </main>
  );
}
