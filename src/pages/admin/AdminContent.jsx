import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';

export default function AdminContent() {
  const { db, draftDb, updateDraft, publishChanges, discardChanges, isLoading } = useCms();
  const [activeTab, setActiveTab] = useState('hero');

  // local product search/filter for Product SEO tab
  const [productSearch, setProductSearch] = useState('');

  const handlePublish = async () => {
    if (window.confirm("Are you sure you want to publish these changes live?")) {
      await publishChanges();
    }
  };

  const handleHeroChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateDraft(prev => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        hero: {
          ...prev.homepage.hero,
          [name]: type === 'checkbox' ? checked : value
        }
      }
    }));
  };

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

  const handleSeoChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateDraft(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [name]: type === 'checkbox' ? checked : value
      }
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
            [productId]: {
              ...(productSeo[productId] || {}),
              [field]: value
            }
          }
        }
      };
    });
  };

  const products = db.products || [];
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));

  const renderTabs = () => {
    const tabs = [
      { id: 'hero', label: 'Hero & Banners' },
      { id: 'sections', label: 'Homepage Sections' },
      { id: 'seo', label: 'Announcements & Global SEO' },
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
          <p className="text-sm text-[#000000]/60 mt-2">Manage homepage layout, banners, announcements, and SEO.</p>
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

        {activeTab === 'hero' && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-[#000000]/10 pb-2">Homepage Hero Banner</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Headline</label>
                <input 
                  type="text" name="title" 
                  value={draftDb.homepage?.hero?.title || ''} 
                  onChange={handleHeroChange}
                  className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm focus:border-[#000000] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  name="description" rows="3"
                  value={draftDb.homepage?.hero?.description || ''} 
                  onChange={handleHeroChange}
                  className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm focus:border-[#000000] outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">Button Text</label>
                  <input 
                    type="text" name="buttonText" 
                    value={draftDb.homepage?.hero?.buttonText || ''} 
                    onChange={handleHeroChange}
                    className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm focus:border-[#000000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <input type="checkbox" name="useVideo" checked={draftDb.homepage?.hero?.useVideo || false} onChange={handleHeroChange} />
                    Use Video Background?
                  </label>
                  {draftDb.homepage?.hero?.useVideo && (
                    <input 
                      type="text" name="videoUrl" placeholder="Video URL (.mp4)"
                      value={draftDb.homepage?.hero?.videoUrl || ''} 
                      onChange={handleHeroChange}
                      className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm focus:border-[#000000] outline-none mt-2"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-[#000000]/10 pb-2">Homepage Layout Sections</h2>
            <p className="text-sm text-[#000000]/60">Toggle sections to show or hide them on the homepage. Edit their content below.</p>
            
            <div className="grid grid-cols-1 gap-4">
              {(draftDb.homepage?.sections || []).map(sec => (
                <div key={sec.id} className="border border-[#000000]/10 p-4 bg-[#f9f9f9] flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#000000]">{sec.type.replace('-', ' ')}</h3>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-xs font-bold uppercase tracking-wider">{sec.active ? 'Visible' : 'Hidden'}</span>
                        <input 
                          type="checkbox" 
                          checked={sec.active} 
                          onChange={() => handleSectionToggle(sec.id)}
                          className="w-4 h-4"
                        />
                      </label>
                    </div>

                    {sec.title !== undefined && (
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#000000]/60">Section Title</label>
                        <input 
                          type="text" 
                          value={sec.title} 
                          onChange={(e) => handleSectionChange(sec.id, 'title', e.target.value)}
                          className="w-full bg-white border border-[#000000]/20 px-3 py-1.5 text-sm focus:border-[#000000] outline-none"
                        />
                      </div>
                    )}
                    
                    {sec.text !== undefined && (
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#000000]/60">Section Text</label>
                        <textarea 
                          rows="2"
                          value={sec.text} 
                          onChange={(e) => handleSectionChange(sec.id, 'text', e.target.value)}
                          className="w-full bg-white border border-[#000000]/20 px-3 py-1.5 text-sm focus:border-[#000000] outline-none"
                        />
                      </div>
                    )}

                    {sec.image !== undefined && (
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#000000]/60">Image URL</label>
                        <input 
                          type="text" 
                          value={sec.image} 
                          onChange={(e) => handleSectionChange(sec.id, 'image', e.target.value)}
                          className="w-full bg-white border border-[#000000]/20 px-3 py-1.5 text-sm focus:border-[#000000] outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-[#000000]/10 pb-2">Global SEO & Announcements</h2>
            
            <div className="p-4 border border-[#000000]/10 bg-[#f9f9f9] space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-[#000000]/10 pb-2">Top Announcement Banner</h3>
              <div className="flex items-center gap-2 mb-2">
                <input 
                  type="checkbox" name="promoBannerActive" 
                  checked={draftDb.seo?.promoBannerActive || false} 
                  onChange={handleSeoChange}
                />
                <label className="text-xs font-bold uppercase tracking-wider">Show Banner</label>
              </div>
              {draftDb.seo?.promoBannerActive && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#000000]/60">Banner Text</label>
                  <input 
                    type="text" name="promoBannerText" 
                    value={draftDb.seo?.promoBannerText || ''} 
                    onChange={handleSeoChange}
                    className="w-full bg-white border border-[#000000]/20 px-3 py-1.5 text-sm focus:border-[#000000] outline-none"
                  />
                </div>
              )}
            </div>

            <div className="p-4 border border-[#000000]/10 bg-[#f9f9f9] space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-[#000000]/10 pb-2">Global SEO Defaults</h3>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#000000]/60">Site Title</label>
                <input 
                  type="text" name="title" 
                  value={draftDb.seo?.title || ''} 
                  onChange={handleSeoChange}
                  className="w-full bg-white border border-[#000000]/20 px-3 py-1.5 text-sm focus:border-[#000000] outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#000000]/60">Site Meta Description</label>
                <textarea 
                  name="description" rows="3"
                  value={draftDb.seo?.description || ''} 
                  onChange={handleSeoChange}
                  className="w-full bg-white border border-[#000000]/20 px-3 py-1.5 text-sm focus:border-[#000000] outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#000000]/60">Google Analytics ID</label>
                <input 
                  type="text" name="googleAnalyticsId" 
                  value={draftDb.seo?.googleAnalyticsId || ''} 
                  onChange={handleSeoChange}
                  className="w-full bg-white border border-[#000000]/20 px-3 py-1.5 text-sm focus:border-[#000000] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'productSeo' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-[#000000]/10 pb-2">Per-Product SEO Settings</h2>
            <p className="text-sm text-[#000000]/60">Override global SEO settings for specific products. Leave blank to use defaults.</p>
            
            <input 
              type="text" 
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full sm:w-64 bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm focus:border-[#000000] outline-none"
            />

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
                <thead className="bg-[#f9f9f9] border-y border-[#000000]/10 text-[10px] font-bold uppercase tracking-[0.1em] text-[#000000]/60">
                  <tr>
                    <th className="px-4 py-3 border-r border-[#000000]/10 w-1/4">Product</th>
                    <th className="px-4 py-3 border-r border-[#000000]/10 w-1/3">SEO Title</th>
                    <th className="px-4 py-3 w-1/3">SEO Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#000000]/10">
                  {filteredProducts.map(p => {
                    const productSeo = draftDb.seo?.productSeo?.[p.id] || {};
                    return (
                      <tr key={p.id}>
                        <td className="px-4 py-3 font-medium border-r border-[#000000]/10 truncate max-w-[200px]" title={p.name}>
                          {p.name}
                        </td>
                        <td className="px-4 py-3 border-r border-[#000000]/10">
                          <input 
                            type="text" 
                            placeholder="Default: Product Name"
                            value={productSeo.title || ''}
                            onChange={(e) => handleProductSeoChange(p.id, 'title', e.target.value)}
                            className="w-full bg-white border border-[#000000]/20 px-2 py-1 text-xs focus:border-[#000000] outline-none"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            placeholder="Default: Global description"
                            value={productSeo.description || ''}
                            onChange={(e) => handleProductSeoChange(p.id, 'description', e.target.value)}
                            className="w-full bg-white border border-[#000000]/20 px-2 py-1 text-xs focus:border-[#000000] outline-none"
                          />
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
