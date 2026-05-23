import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ onMenuToggle }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const isTransparentPage = location.pathname === '/' || location.pathname === '/clothing/clothing';

  useEffect(() => {
    const handleScroll = () => {
      if (!isTransparentPage) {
        // Inner pages require a persistent solid background for readability over content scrolling
        setIsScrolled(true);
        return;
      }

      setIsScrolled(window.scrollY > 20);
    };

    // Trigger initially and on scroll/resize
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isTransparentPage]);

  // Determine if the navbar should show the solid background
  const showSolid = isScrolled || isHovered;

  return (
    <>
      <header 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-full z-[100] relative transition-all duration-300 ease-in-ou
          showSolid ? "text-[#000000]" : "text-[#FAF9F6]"
        }`}>
          <button aria-label="Search" className="p-1 hover:scale-110 transition-transform"><svg className="size-[15px] md:size-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3" strokeLinecap="round"/></svg></button>
          <button aria-label="Account" className="p-1 hover:scale-110 transition-transform hidden sm:inline-flex"><svg className="size-[15px] md:size-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg></button>
          <button aria-label="Wishlist" className="p-1 hover:scale-110 transition-transform"><svg className="size-[15px] md:size-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.8 5.6a5.5 5.5 0 0 0-9 1.7 5.5 5.5 0 0 0-9-1.7c-2.1 2.1-2.1 5.6 0 7.7l9 9 9-9c2.1-2.1 2.1-5.6 0-7.7Z"/></svg></button>
          <button aria-label="Cart" className="p-1 hover:scale-110 transition-transform"><svg className="size-[15px] md:size-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 7h14l-1.5 12h-11L5 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg></button>
          <button onClick={onMenuToggle} aria-label="Menu" className={`md:hidden p-1 transition-colors duration-500 ${
            showSolid ? "text-[#000000] hover:text-[#000000]/70" : "text-[#FAF9F6] hover:text-[#FAF9F6]/80"
          }`}>
            <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>
    </header>
  </>
  );
}
