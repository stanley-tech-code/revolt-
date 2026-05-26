import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';

export default function AdminContent() {
  const { db, draftDb, updateDraft, publishChanges, discardChanges, isLoading } = useCms();
  const [activeTab, setActiveTab] = useState('theme');
  const [productSearch, setProductSearch] = useState('');

  const handlePublish = async () => {
    if (window.confirm("Are you sure you want to publish these changes live?")) {
      await publishChanges();
    }
  };

  // --- THEME HANDLERS ---
  const handleThemeChange = (e) => {
    const { name, value } = e.target;
    updateDraft(prev => ({
      ...prev,
      theme: { ...prev.theme, [name]: value }
    }));
  };

  // --- ASSETS HANDLERS ---
  const handleAssetChange = (e) => {
    const { name, value } = e.target;
    updateDraft(prev => ({
      ...prev,
      assets: { ...prev.assets, [name]: value }
    }));
  };

  // --- SOCIAL & SCRIPTS HANDLERS ---
  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    updateDraft(prev => ({
      ...prev,
      social: { ...prev.social, [name]: value }
    }));
  };

  const handleScriptsChange = (e) => {
    const { name, value } = e.target;
    updateDraft(prev => ({
      ...prev,
      scripts: { ...prev.scripts, [name]: value }
    }));
  };

  // --- HERO HANDLERS ---
  const handleHeroChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateDraft(prev => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        hero: { ...prev.homepage.hero, [name]: type === 'checkbox' ? checked : value }
      }
    }));
  };

  // --- SECTIONS HANDLERS (with Move Up/Down) ---
  const handleSectionToggle = (id) => {
    updateDraft(prev => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        sections: prev.homepage.sections.map(sec => 
          sec.id === id ? { ...sec, active: !sec.active } : sec
        )
      }
    }));
  };

  const handleSectionChange = (id, field, value) => {
    updateDraft(prev => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        sections: prev.homepage.sections.map(sec => 
          sec.id === id ? { ...sec, [field]: value } : sec
        )
      }
    }));
  };

  const moveSection = (index, direction) => {
    updateDraft(prev => {
      const sections = [...(prev.homepage?.sections || [])];
      if (direction === 'up' && index > 0) {
        [sections[index - 1], sections[index]] = [sections[index], sections[index - 1]];
      } else if (direction === 'down' && index < sections.length - 1) {
        [sections[index + 1], sections[index]] = [sections[index], sections[index + 1]];
      }
      return { ...prev, homepage: { ...prev.homepage, sections } };
    });
  };

  // --- SEO & PRODUCT SEO HANDLERS ---
  const handleSeoChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateDraft(prev => ({
      ...prev,
      seo: { ...prev.seo, [name]: type === 'checkbox' ? checked : value }
    }));
  };

  const handleProductSeoChange = (productId, field, value) => {
    updateDraft(prev => {
      const productSeo = prev.seo?.productSeo || {};
      return {
        ...prev,
        seo: {
          ...prev.seo,
          productSeo: {
            ...productSeo,
            [productId]: { ...(productSeo[productId] || {}), [field]: value }
          }
        }
      };
    });
  };

  const products = db.products || [];
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));

  const renderTabs = () => {
    const tabs = [
      { id: 'theme', label: 'Theme Customizer' },
      { id: 'hero', label: 'Hero Banners' },
      { id: 'sections', label: 'Homepage Layout' },
      { id: 'seo', label: 'SEO & Integrations' },
      { id: 'assets', label: 'Media Library' },
      { id: 'productSeo', label: 'Product SEO' },
    ];

    return (
      <div className="flex border-b border-[#000000]/10 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
              activeTab === tab.id 
                ? 'border-b-2 border-[#000000] text-[#000000]' 
                : 'text-[#000000]/50 hover:text-[#000000]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#000000]">Content & Appearance</h1>
          <p className="text-sm text-[#000000]/60 mt-2">Manage theme, layouts, banners, integrations, and SEO.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={discardChanges}
            disabled={isLoading}
            className="bg-[#f5f5f5] text-[#000000] border border-[#000000]/20 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#e0e0e0] transition-colors"
          >
            Discard Changes
          </button>
          <button 
            onClick={handlePublish}
            disabled={isLoading}
            className="bg-[#000000] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#000000]/80 transition-colors"
          >
            {isLoading ? 'Publishing...' : 'Publish Live'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 border border-[#000000]/10">
        {renderTabs()}

        {/* --- THEME CUSTOMIZER --- */}
        {activeTab === 'theme' && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-[#000000]/10 pb-2">Global Theme Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider">Colors</h3>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Primary Color (Ink)</label>
                  <div className="flex items-center gap-2">
                    <input type="color" name="primaryColor" value={draftDb.theme?.primaryColor || '#000000'} onChange={handleThemeChange} className="w-8 h-8 cursor-pointer" />
                    <input type="text" name="primaryColor" value={draftDb.theme?.primaryColor || '#000000'} onChange={handleThemeChange} className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-3 py-1.5 text-sm outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Background Canvas</label>
                  <div className="flex items-center gap-2">
                    <input type="color" name="backgroundColor" value={draftDb.theme?.backgroundColor || '#ffffff'} onChange={handleThemeChange} className="w-8 h-8 cursor-pointer" />
                    <input type="text" name="backgroundColor" value={draftDb.theme?.backgroundColor || '#ffffff'} onChange={handleThemeChange} className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-3 py-1.5 text-sm outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Button Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" name="buttonColor" value={draftDb.theme?.buttonColor || '#000000'} onChange={handleThemeChange} className="w-8 h-8 cursor-pointer" />
                    <input type="text" name="buttonColor" value={draftDb.theme?.buttonColor || '#000000'} onChange={handleThemeChange} className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-3 py-1.5 text-sm outline-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider">Typography & Layout</h3>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Heading Font Family</label>
                  <input type="text" name="headingFont" value={draftDb.theme?.headingFont || ''} onChange={handleThemeChange} className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-3 py-1.5 text-sm outline-none" placeholder="e.g. Inter, Helvetica" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Body Font Family</label>
                  <input type="text" name="bodyFont" value={draftDb.theme?.bodyFont || ''} onChange={handleThemeChange} className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-3 py-1.5 text-sm outline-none" placeholder="e.g. Inter, Arial" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Section Y-Padding</label>
                  <input type="text" name="sectionPadding" value={draftDb.theme?.sectionPadding || '4rem'} onChange={handleThemeChange} className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-3 py-1.5 text-sm outline-none" placeholder="e.g. 4rem or 64px" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- HERO BANNERS --- */}
        {activeTab === 'hero' && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-[#000000]/10 pb-2">Homepage Hero Banner</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Headline</label>
                <input type="text" name="title" value={draftDb.homepage?.hero?.title || ''} onChange={handleHeroChange} className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm focus:border-[#000000] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Description / Subheading</label>
                <textarea name="description" rows="3" value={draftDb.homepage?.hero?.description || ''} onChange={handleHeroChange} className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm focus:border-[#000000] outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">Button Text</label>
                  <input type="text" name="buttonText" value={draftDb.homepage?.hero?.buttonText || ''} onChange={handleHeroChange} className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm focus:border-[#000000] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">Button Link URL</label>
                  <input type="text" name="buttonLink" value={draftDb.homepage?.hero?.buttonLink || '/'} onChange={handleHeroChange} className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm focus:border-[#000000] outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <input type="checkbox" name="useVideo" checked={draftDb.homepage?.hero?.useVideo || false} onChange={handleHeroChange} />
                    Use Video Background?
                  </label>
                  {draftDb.homepage?.hero?.useVideo && (
                    <input type="text" name="videoUrl" placeholder="Video URL (.mp4)" value={draftDb.homepage?.hero?.videoUrl || ''} onChange={handleHeroChange} className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm focus:border-[#000000] outline-none mt-2" />
                  )}
                  {!draftDb.homepage?.hero?.useVideo && (
                    <input type="text" name="imageUrl" placeholder="Static Image URL" value={draftDb.homepage?.hero?.imageUrl || ''} onChange={handleHeroChange} className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm focus:border-[#000000] outline-none mt-2" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- SECTIONS BUILDER --- */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-[#000000]/10 pb-2">Homepage Sections Builder</h2>
            <p className="text-sm text-[#000000]/60">Reorder, show/hide, and edit content blocks on the homepage.</p>
            
            <div className="grid grid-cols-1 gap-4">
              {(draftDb.homepage?.sections || []).map((sec, index) => (
                <div key={sec.id} className="border border-[#000000]/10 p-4 bg-[#f9f9f9] flex flex-col sm:flex-row gap-6 relative">
                  <div className="flex flex-col gap-2 justify-center border-r border-[#000000]/10 pr-4">
                    <button onClick={() => moveSection(index, 'up')} disabled={index === 0} className="text-[#000000]/50 hover:text-black disabled:opacity-20">▲</button>
                    <button onClick={() => moveSection(index, 'down')} disabled={index === (draftDb.homepage.sections.length - 1)} className="text-[#000000]/50 hover:text-black disabled:opacity-20">▼</button>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#000000]">{sec.type.replace('-', ' ')}</h3>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-xs font-bold uppercase tracking-wider">{sec.active ? 'Visible' : 'Hidden'}</span>
                        <input type="checkbox" checked={sec.active} onChange={() => handleSectionToggle(sec.id)} className="w-4 h-4" />
                      </label>
                    </div>

                    {sec.title !== undefined && (
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#000000]/60">Section Title</label>
                        <input type="text" value={sec.title} onChange={(e) => handleSectionChange(sec.id, 'title', e.target.value)} className="w-full bg-white border border-[#000000]/20 px-3 py-1.5 text-sm outline-none" />
                      </div>
                    )}
                    
                    {sec.text !== undefined && (
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#000000]/60">Section Text / HTML</label>
                        <textarea rows="3" value={sec.text} onChange={(e) => handleSectionChange(sec.id, 'text', e.target.value)} className="w-full bg-white border border-[#000000]/20 px-3 py-1.5 text-sm outline-none font-mono text-xs" />
                      </div>
                    )}

                    {sec.image !== undefined && sec.type !== 'curation' && sec.type !== 'products' && (
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#000000]/60">Image URL</label>
                        <input type="text" value={sec.image} onChange={(e) => handleSectionChange(sec.id, 'image', e.target.value)} className="w-full bg-white border border-[#000000]/20 px-3 py-1.5 text-sm outline-none" />
                      </div>
                    )}

                    {sec.type === 'curation' && (
                      <div className="space-y-4 pt-4 border-t border-[#000000]/10">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#000000]/60">Main Curation Image URL</label>
                          <input type="text" value={sec.mainItem?.image || ''} onChange={(e) => handleSectionChange(sec.id, 'mainItem', { ...sec.mainItem, image: e.target.value })} className="w-full bg-white border border-[#000000]/20 px-3 py-1.5 text-sm outline-none" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {(sec.subItems || []).map((subItem, idx) => (
                            <div key={idx}>
                              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#000000]/60">Sub-Item {idx + 1} Image URL</label>
                              <input type="text" value={subItem.image || ''} onChange={(e) => {
                                const newSubItems = [...sec.subItems];
                                newSubItems[idx] = { ...newSubItems[idx], image: e.target.value };
                                handleSectionChange(sec.id, 'subItems', newSubItems);
                              }} className="w-full bg-white border border-[#000000]/20 px-3 py-1.5 text-sm outline-none" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sec.type === 'products' && (
                      <div className="space-y-4 pt-4 border-t border-[#000000]/10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {(sec.categories || []).map((cat, idx) => (
                            <div key={idx}>
                              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#000000]/60">{cat.name} Image URL</label>
                              <input type="text" value={cat.image || ''} onChange={(e) => {
                                const newCategories = [...sec.categories];
                                newCategories[idx] = { ...newCategories[idx], image: e.target.value };
                                handleSectionChange(sec.id, 'categories', newCategories);
                              }} className="w-full bg-white border border-[#000000]/20 px-3 py-1.5 text-sm outline-none" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SEO, ANNOUNCEMENTS, SCRIPTS, SOCIAL --- */}
        {activeTab === 'seo' && (
          <div className="space-y-6 max-w-4xl">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-[#000000]/10 pb-2">SEO, Announcements & Integrations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Announcements */}
              <div className="p-4 border border-[#000000]/10 bg-[#f9f9f9] space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider border-b border-[#000000]/10 pb-2">Top Announcement Banner</h3>
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input type="checkbox" name="promoBannerActive" checked={draftDb.seo?.promoBannerActive || false} onChange={handleSeoChange} />
                  <span className="text-xs font-bold uppercase tracking-wider">Show Banner</span>
                </label>
                {draftDb.seo?.promoBannerActive && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#000000]/60">Banner Text</label>
                      <input type="text" name="promoBannerText" value={draftDb.seo?.promoBannerText || ''} onChange={handleSeoChange} className="w-full bg-white border border-[#000000]/20 px-3 py-1.5 text-sm outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#000000]/60">End Date (for Countdown)</label>
                      <input type="datetime-local" name="promoEndDate" value={draftDb.seo?.promoEndDate || ''} onChange={handleSeoChange} className="w-full bg-white border border-[#000000]/20 px-3 py-1.5 text-sm outline-none" />
                    </div>
                  </>
                )}
              </div>

              {/* Global SEO */}
              <div className="p-4 border border-[#000000]/10 bg-[#f9f9f9] space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider border-b border-[#000000]/10 pb-2">Global SEO Defaults</h3>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#000000]/60">Site Meta Title</label>
                  <input type="text" name="title" value={draftDb.seo?.title || ''} onChange={handleSeoChange} className="w-full bg-white border border-[#000000]/20 px-3 py-1.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#000000]/60">Site Meta Description</label>
                  <textarea name="description" rows="3" value={draftDb.seo?.description || ''} onChange={handleSeoChange} className="w-full bg-white border border-[#000000]/20 px-3 py-1.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#000000]/60">robots.txt config</label>
                  <textarea name="robotsTxt" rows="2" placeholder="User-agent: *\nAllow: /" value={draftDb.seo?.robotsTxt || ''} onChange={handleSeoChange} className="w-full bg-white border border-[#000000]/20 px-3 py-1.5 text-sm outline-none font-mono" />
                </div>
              </div>

              {/* Scripts */}
              <div className="p-4 border border-[#000000]/10 bg-[#f9f9f9] space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider border-b border-[#000000]/10 pb-2">Custom Integrations (Scripts)</h3>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#000000]/60">Head Scripts (Google Analytics, Meta Pixel)</label>
                  <textarea name="header" rows="3" placeholder="<script>...</script>" value={draftDb.scripts?.header || ''} onChange={handleScriptsChange} className="w-full bg-white border border-[#000000]/20 px-3 py-1.5 text-sm outline-none font-mono text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#000000]/60">Body/Footer Scripts (Chatbots, Hotjar)</label>
                  <textarea name="footer" rows="3" placeholder="<script>...</script>" value={draftDb.scripts?.footer || ''} onChange={handleScriptsChange} className="w-full bg-white border border-[#000000]/20 px-3 py-1.5 text-sm outline-none font-mono text-xs" />
                </div>
              </div>

              {/* Social */}
              <div className="p-4 border border-[#000000]/10 bg-[#f9f9f9] space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider border-b border-[#000000]/10 pb-2">Social Media Links</h3>
                {['instagram', 'tiktok', 'facebook', 'twitter', 'youtube', 'pinterest'].map(platform => (
                  <div key={platform}>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#000000]/60 capitalize">{platform}</label>
                    <input type="url" name={platform} value={draftDb.social?.[platform] || ''} onChange={handleSocialChange} className="w-full bg-white border border-[#000000]/20 px-3 py-1.5 text-sm outline-none" placeholder={`https://${platform}.com/...`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- ASSETS MEDIA LIBRARY --- */}
        {activeTab === 'assets' && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-[#000000]/10 pb-2">Global Media Assets</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Site Logo URL</label>
                <input type="text" name="logo" value={draftDb.assets?.logo || ''} onChange={handleAssetChange} className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm focus:border-[#000000] outline-none" />
                {draftDb.assets?.logo && <img src={draftDb.assets.logo} alt="Logo preview" className="h-12 mt-3 object-contain" />}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Favicon URL</label>
                <input type="text" name="favicon" value={draftDb.assets?.favicon || ''} onChange={handleAssetChange} className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm focus:border-[#000000] outline-none" />
                {draftDb.assets?.favicon && <img src={draftDb.assets.favicon} alt="Favicon preview" className="w-8 h-8 mt-3 object-contain" />}
              </div>
            </div>
            <p className="text-xs text-[#000000]/50 italic mt-6">Note: For new image uploads, please use the Product Editor's image upload functionality which automatically saves to Supabase Storage, and copy the URLs here.</p>
          </div>
        )}

        {/* --- PRODUCT SEO --- */}
        {activeTab === 'productSeo' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-[#000000]/10 pb-2">Per-Product Advanced SEO</h2>
            <p className="text-sm text-[#000000]/60">Manage canonical URLs, custom slugs, and Open Graph overrides per product.</p>
            
            <input type="text" placeholder="Search products..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="w-full sm:w-64 bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm focus:border-[#000000] outline-none" />

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
                <thead className="bg-[#f9f9f9] border-y border-[#000000]/10 text-[10px] font-bold uppercase tracking-[0.1em] text-[#000000]/60">
                  <tr>
                    <th className="px-4 py-3 border-r border-[#000000]/10">Product Name</th>
                    <th className="px-4 py-3 border-r border-[#000000]/10">URL Slug</th>
                    <th className="px-4 py-3 border-r border-[#000000]/10">SEO Title</th>
                    <th className="px-4 py-3 border-r border-[#000000]/10">SEO Description</th>
                    <th className="px-4 py-3">Open Graph Image</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#000000]/10">
                  {filteredProducts.map(p => {
                    const productSeo = draftDb.seo?.productSeo?.[p.id] || {};
                    return (
                      <tr key={p.id}>
                        <td className="px-4 py-3 font-medium border-r border-[#000000]/10 truncate max-w-[150px]" title={p.name}>{p.name}</td>
                        <td className="px-4 py-3 border-r border-[#000000]/10">
                          <input type="text" placeholder="default-id" value={productSeo.slug || ''} onChange={(e) => handleProductSeoChange(p.id, 'slug', e.target.value)} className="w-full bg-white border border-[#000000]/20 px-2 py-1 text-xs outline-none" />
                        </td>
                        <td className="px-4 py-3 border-r border-[#000000]/10">
                          <input type="text" placeholder="Default Title" value={productSeo.title || ''} onChange={(e) => handleProductSeoChange(p.id, 'title', e.target.value)} className="w-full bg-white border border-[#000000]/20 px-2 py-1 text-xs outline-none" />
                        </td>
                        <td className="px-4 py-3 border-r border-[#000000]/10">
                          <input type="text" placeholder="Default Desc" value={productSeo.description || ''} onChange={(e) => handleProductSeoChange(p.id, 'description', e.target.value)} className="w-full bg-white border border-[#000000]/20 px-2 py-1 text-xs outline-none" />
                        </td>
                        <td className="px-4 py-3">
                          <input type="text" placeholder="URL override" value={productSeo.ogImage || ''} onChange={(e) => handleProductSeoChange(p.id, 'ogImage', e.target.value)} className="w-full bg-white border border-[#000000]/20 px-2 py-1 text-xs outline-none" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
