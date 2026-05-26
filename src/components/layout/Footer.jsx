import React from 'react';
import { Link } from 'react-router-dom';
import { useCms } from '../../context/CmsContext';

export default function Footer() {
  const { db } = useCms();
  const social = db?.social || {};

  return (
    <footer className="bg-canvas text-[#000000] pt-12 md:pt-16 pb-8 border-t border-clay/30">
      <div className="container-standard">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-20 mb-12 md:mb-16">
          {/* Footer Links */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 order-2 lg:order-1">
            {/* Shop */}
            <div className="space-y-4">
              <h5 className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#000000]">Shop</h5>
              <ul className="space-y-2.5 text-[11px] font-medium tracking-wide">
                <li><Link to="/new-in/new-in" className="text-[#000000] hover:text-[#000000]/70 transition-colors">New In</Link></li>
                <li><Link to="/clothing/clothing" className="text-[#000000] hover:text-[#000000]/70 transition-colors">Clothing</Link></li>
                <li><Link to="/clothing/shapewear" className="text-[#000000] hover:text-[#000000]/70 transition-colors">Shapewear</Link></li>
                <li><Link to="/accessories/accessories" className="text-[#000000] hover:text-[#000000]/70 transition-colors">Accessories</Link></li>
              </ul>
            </div>

            {/* Help */}
            <div className="space-y-4">
              <h5 className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#000000]">Help</h5>
              <ul className="space-y-2.5 text-[11px] font-medium tracking-wide">
                <li><Link to="/help/order-tracking" className="text-[#000000] hover:text-[#000000]/70 transition-colors">Tracking</Link></li>
                <li><Link to="/help/returns" className="text-[#000000] hover:text-[#000000]/70 transition-colors">Returns</Link></li>
                <li><Link to="/help/contact" className="text-[#000000] hover:text-[#000000]/70 transition-colors">Contact</Link></li>
              </ul>
            </div>


            {/* Social */}
            <div className="space-y-4">
              <h5 className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#000000]">Social</h5>
              <ul className="space-y-2.5 text-[11px] font-medium tracking-wide">
                {social.instagram && <li><a href={social.instagram} target="_blank" rel="noreferrer" className="text-[#000000] hover:text-[#000000]/70 transition-colors">Instagram</a></li>}
                {social.tiktok && <li><a href={social.tiktok} target="_blank" rel="noreferrer" className="text-[#000000] hover:text-[#000000]/70 transition-colors">TikTok</a></li>}
                {social.twitter && <li><a href={social.twitter} target="_blank" rel="noreferrer" className="text-[#000000] hover:text-[#000000]/70 transition-colors">X (Twitter)</a></li>}
                {social.facebook && <li><a href={social.facebook} target="_blank" rel="noreferrer" className="text-[#000000] hover:text-[#000000]/70 transition-colors">Facebook</a></li>}
                {social.youtube && <li><a href={social.youtube} target="_blank" rel="noreferrer" className="text-[#000000] hover:text-[#000000]/70 transition-colors">YouTube</a></li>}
                {social.pinterest && <li><a href={social.pinterest} target="_blank" rel="noreferrer" className="text-[#000000] hover:text-[#000000]/70 transition-colors">Pinterest</a></li>}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:pl-16 lg:border-l border-clay/20 order-1 lg:order-2 mb-4 lg:mb-0">
            <h3 className="text-xl md:text-2xl font-semibold uppercase tracking-tight mb-4 text-[#000000]">Join Revolt</h3>
            <p className="text-sm text-[#000000] max-w-sm mb-6 leading-relaxed">Early access to drops, members-only releases, and editorial updates.</p>
            <form className="flex gap-4 border-b border-[#000000]/30 pb-2 max-w-sm focus-within:border-[#000000] transition-colors" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email address" className="bg-transparent border-none text-sm flex-1 outline-none placeholder:text-[#000000]/40 text-[#000000] py-1" />
              <button type="submit" className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#000000] hover:text-[#000000]/70 transition-colors">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-clay/20 gap-4">
          <span className="text-xl md:text-2xl font-bold uppercase tracking-[-0.05em] text-[#000000]">Revolt</span>
          
          <div className="flex gap-4 text-[9px] uppercase tracking-[0.2em] text-[#000000]/70 font-bold">
            <Link to="/policies/terms" className="hover:text-[#000000] transition-colors">Terms</Link>
            <Link to="/policies/privacy" className="hover:text-[#000000] transition-colors">Privacy</Link>
            <Link to="/policies/refund" className="hover:text-[#000000] transition-colors">Refund</Link>
          </div>
          
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#000000]">© 2026 Revolt Studio. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
