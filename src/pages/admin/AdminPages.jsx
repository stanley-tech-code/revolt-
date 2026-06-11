import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';

export default function AdminPages() {
  const { db, draftDb, updateDraft, publishChanges, discardChanges, isLoading } = useCms();
  const [activePage, setActivePage] = useState('trendGuide');

  const handlePublish = async () => {
    if (window.confirm("Are you sure you want to publish these changes live?")) {
      await publishChanges();
    }
  };

  // --- GENERIC HANDLERS ---
  const handlePageFieldChange = (pageKey, field, value) => {
    updateDraft(prev => ({
      ...prev,
      pages: {
        ...(prev.pages || {}),
        [pageKey]: {
          ...(prev.pages?.[pageKey] || {}),
          [field]: value
        }
      }
    }));
  };

  const handleLegalChange = (field, value) => {
    updateDraft(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        legal: {
          ...prev.settings?.legal,
          [field]: value
        }
      }
    }));
  };

  // Base64 image compression (reusing logic from ProductEditor)
  const handleImageUpload = (pageKey, field) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const max = 1200;
          if (width > max) {
            height = Math.round((height * max) / width);
            width = max;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const base64 = canvas.toDataURL('image/jpeg', 0.8);
          handlePageFieldChange(pageKey, field, base64);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  // --- SCHEMAS ---
  const PAGE_SCHEMAS = {
    trendGuide: {
      title: 'Trend Guide',
      category: 'Guides',
      fields: [
        { name: 'heroEyebrow', label: 'Hero Eyebrow Text', type: 'text', default: 'The Editorial Edit' },
        { name: 'heroTitle', label: 'Hero Title', type: 'text', default: 'The Trend Guide' },
        { name: 'heroDesc', label: 'Hero Description', type: 'textarea', default: 'Discover the season\'s definitive silhouettes...' },
        { name: 'heroImage', label: 'Hero Background Image', type: 'image', default: '/images/campaign-1.webp' },
        { name: 'introTitle', label: 'Intro Title', type: 'text', default: 'The Shift in Proportions' },
        { name: 'introText', label: 'Intro Text', type: 'textarea', default: 'This season is defined by a distinct shift...' },
        { name: 'introBtnText', label: 'Intro Button Text', type: 'text', default: 'Shop New Arrivals' },
        { name: 'introBtnLink', label: 'Intro Button Link', type: 'text', default: '/new-in/all-new-arrivals' },
        { name: 'trend1Title', label: 'Trend 1 Title', type: 'text', default: 'Volume & Drape' },
        { name: 'trend1Desc', label: 'Trend 1 Description', type: 'textarea', default: 'Exaggerated proportions are grounded...' },
        { name: 'trend1Image', label: 'Trend 1 Image', type: 'image', default: '/images/editorial-wide.webp' },
        { name: 'trend2Title', label: 'Trend 2 Title', type: 'text', default: 'Earthy Neutrals' },
        { name: 'trend2Desc', label: 'Trend 2 Description', type: 'textarea', default: 'The color palette is rooted in nature...' },
        { name: 'trend2Image', label: 'Trend 2 Image', type: 'image', default: '/images/product-3.webp' },
        { name: 'ctaTitle', label: 'Footer CTA Title', type: 'text', default: 'Ready to Update Your Wardrobe?' },
        { name: 'ctaDesc', label: 'Footer CTA Description', type: 'text', default: 'Shop the pieces featured in this guide...' },
        { name: 'ctaBtnText', label: 'Footer CTA Button', type: 'text', default: 'Shop The Collection' },
      ]
    },
    clothingGuide: {
      title: 'Clothing Guide',
      category: 'Guides',
      fields: [
        { name: 'heroEyebrow', label: 'Hero Eyebrow', type: 'text', default: 'Fit & Fabrication' },
        { name: 'heroTitle', label: 'Hero Title', type: 'text', default: 'Clothing Guide' },
        { name: 'heroDesc', label: 'Hero Description', type: 'textarea', default: 'Understanding our fits...' },
        { name: 'fit1Title', label: 'Fit 1 Title', type: 'text', default: 'Form-Fitting' },
        { name: 'fit1Desc', label: 'Fit 1 Description', type: 'textarea', default: 'Designed to sit close to the body...' },
        { name: 'fit1Image', label: 'Fit 1 Image', type: 'image', default: '/images/product-2.webp' },
        { name: 'fit2Title', label: 'Fit 2 Title', type: 'text', default: 'Relaxed Fit' },
        { name: 'fit2Desc', label: 'Fit 2 Description', type: 'textarea', default: 'Our standard fit. Not too tight...' },
        { name: 'fit2Image', label: 'Fit 2 Image', type: 'image', default: '/images/product-1.webp' },
        { name: 'fit3Title', label: 'Fit 3 Title', type: 'text', default: 'Oversized' },
        { name: 'fit3Desc', label: 'Fit 3 Description', type: 'textarea', default: 'Exaggerated proportions with dropped shoulders...' },
        { name: 'fit3Image', label: 'Fit 3 Image', type: 'image', default: '/images/product-3.webp' },
        { name: 'careTitle', label: 'Care Title', type: 'text', default: 'Care Instructions' },
        { name: 'careDesc', label: 'Care Description', type: 'textarea', default: 'Our garments are constructed from premium fabrics...' },
      ]
    },
    braFitGuide: {
      title: 'Bra Fit Guide',
      category: 'Guides',
      fields: [
        { name: 'heroEyebrow', label: 'Hero Eyebrow', type: 'text', default: 'The Intimates Edit' },
        { name: 'heroTitle', label: 'Hero Title', type: 'text', default: 'Bra Fit Guide' },
        { name: 'heroDesc', label: 'Hero Description', type: 'textarea', default: 'Find your perfect fit. A supportive...' },
        { name: 'heroImage', label: 'Hero Background Image', type: 'image', default: '/images/editorial-wide.webp' },
        { name: 'measureTitle', label: 'Measure Section Title', type: 'text', default: 'How To Measure' },
        { name: 'measureDesc', label: 'Measure Section Description', type: 'textarea', default: 'Grab a soft measuring tape...' },
        { name: 'measureImage', label: 'Measure Image', type: 'image', default: '/images/product-3.webp' },
        { name: 'sisterTitle', label: 'Sister Size Title', type: 'text', default: 'Sister Sizing' },
        { name: 'sisterDesc', label: 'Sister Size Description', type: 'textarea', default: 'If your recommended size feels slightly off...' },
        { name: 'style1Title', label: 'Style 1 Title', type: 'text', default: 'T-Shirt Bras' },
        { name: 'style1Desc', label: 'Style 1 Description', type: 'text', default: 'Smooth, seamless cups invisible...' },
        { name: 'style1Image', label: 'Style 1 Image', type: 'image', default: '/images/product-2.webp' },
        { name: 'style2Title', label: 'Style 2 Title', type: 'text', default: 'Unlined' },
        { name: 'style2Desc', label: 'Style 2 Description', type: 'text', default: 'Natural shape with wire support...' },
        { name: 'style2Image', label: 'Style 2 Image', type: 'image', default: '/images/product-1.webp' },
        { name: 'style3Title', label: 'Style 3 Title', type: 'text', default: 'Push-Up' },
        { name: 'style3Desc', label: 'Style 3 Description', type: 'text', default: 'Targeted padding for lift...' },
        { name: 'style3Image', label: 'Style 3 Image', type: 'image', default: '/images/product-3.webp' },
      ]
    },
    underwearGuide: {
      title: 'Underwear Guide',
      category: 'Guides',
      fields: [
        { name: 'heroTitle', label: 'Hero Title', type: 'text', default: 'Underwear Guide' },
        { name: 'heroDesc', label: 'Hero Description', type: 'textarea', default: 'From seamless invisibility to cotton comfort...' },
        { name: 'heroImage', label: 'Hero Background Image', type: 'image', default: '/images/campaign-1.webp' },
        { name: 'cut1Title', label: 'Cut 1 Title', type: 'text', default: 'Thong' },
        { name: 'cut1Desc', label: 'Cut 1 Description', type: 'textarea', default: 'Zero back coverage. The ultimate solution...' },
        { name: 'cut1Image', label: 'Cut 1 Image', type: 'image', default: '/images/product-1.webp' },
        { name: 'cut2Title', label: 'Cut 2 Title', type: 'text', default: 'Cheeky' },
        { name: 'cut2Desc', label: 'Cut 2 Description', type: 'textarea', default: 'Minimal back coverage that flatters...' },
        { name: 'cut2Image', label: 'Cut 2 Image', type: 'image', default: '/images/product-2.webp' },
        { name: 'cut3Title', label: 'Cut 3 Title', type: 'text', default: 'Bikini' },
        { name: 'cut3Desc', label: 'Cut 3 Description', type: 'textarea', default: 'Moderate coverage with a slightly higher cut...' },
        { name: 'cut3Image', label: 'Cut 3 Image', type: 'image', default: '/images/product-3.webp' },
        { name: 'cut4Title', label: 'Cut 4 Title', type: 'text', default: 'Brief / Boyshort' },
        { name: 'cut4Desc', label: 'Cut 4 Description', type: 'textarea', default: 'Full coverage and maximum comfort...' },
        { name: 'cut4Image', label: 'Cut 4 Image', type: 'image', default: '/images/editorial-wide.webp' },
        { name: 'fabric1Title', label: 'Fabric 1 Title', type: 'text', default: 'Seamless Microfiber' },
        { name: 'fabric1Desc', label: 'Fabric 1 Description', type: 'textarea', default: 'Our seamless fabric is laser-cut...' },
        { name: 'fabric2Title', label: 'Fabric 2 Title', type: 'text', default: 'Breathable Cotton' },
        { name: 'fabric2Desc', label: 'Fabric 2 Description', type: 'textarea', default: 'Premium, ethically sourced cotton blended...' },
      ]
    },
    swimFitGuide: {
      title: 'Swim Fit Guide',
      category: 'Guides',
      fields: [
        { name: 'heroEyebrow', label: 'Hero Eyebrow', type: 'text', default: 'The Resort Edit' },
        { name: 'heroTitle', label: 'Hero Title', type: 'text', default: 'Swim Fit Guide' },
        { name: 'heroDesc', label: 'Hero Description', type: 'textarea', default: 'Finding swimwear that flatters...' },
        { name: 'heroImage', label: 'Hero Background Image', type: 'image', default: '/images/editorial-wide.webp' },
        { name: 'topTitle', label: 'Top Section Title', type: 'text', default: 'Top Fits & Support' },
        { name: 'topDesc', label: 'Top Section Description', type: 'textarea', default: 'Our swim tops are designed...' },
        { name: 'topImage', label: 'Top Section Image', type: 'image', default: '/images/product-2.webp' },
        { name: 'bottomTitle', label: 'Bottom Section Title', type: 'text', default: 'Bottom Coverage' },
        { name: 'bottomDesc', label: 'Bottom Section Description', type: 'textarea', default: 'From high-waisted to minimal coverage...' },
        { name: 'bottomImage', label: 'Bottom Section Image', type: 'image', default: '/images/product-1.webp' },
        { name: 'careTitle', label: 'Care Section Title', type: 'text', default: 'Swim Care 101' },
        { name: 'careDesc', label: 'Care Section Description', type: 'textarea', default: 'Chlorine, salt water, and sunscreen...' },
      ]
    },
    contact: {
      title: 'Contact Us',
      category: 'Informational',
      fields: [
        { name: 'title', label: 'Page Title', type: 'text', default: 'Contact Support' },
        { name: 'subtitle', label: 'Page Subtitle', type: 'textarea', default: 'Need help with an order, fit advice, or just want to say hi?' },
        { name: 'email', label: 'Support Email', type: 'text', default: 'hello@revolt.com' },
        { name: 'phone', label: 'Support Phone', type: 'text', default: '+254 700 000 000' },
        { name: 'hours', label: 'Operating Hours', type: 'text', default: 'Mon - Fri, 9am - 6pm EAT' },
      ]
    },
    ourStory: {
      title: 'Our Story',
      category: 'Informational',
      fields: [
        { name: 'title', label: 'Page Title', type: 'text', default: 'Our Story' },
        { name: 'content', label: 'Page Content', type: 'textarea', default: 'This is a placeholder page for Our Story.' },
      ]
    },
    faq: {
      title: 'FAQs',
      category: 'Informational',
      fields: [
        { name: 'title', label: 'Page Title', type: 'text', default: 'Frequently Asked Questions' },
        { name: 'content', label: 'FAQ Content (Text)', type: 'textarea', default: 'Coming soon...' },
      ]
    },
    privacyPolicy: {
      title: 'Privacy Policy',
      category: 'Policies',
      isLegal: true, // Uses settings.legal
      field: 'privacyPolicy'
    },
    terms: {
      title: 'Terms & Conditions',
      category: 'Policies',
      isLegal: true,
      field: 'terms'
    },
    refund: {
      title: 'Refund Policy',
      category: 'Policies',
      isLegal: true,
      field: 'refund'
    }
  };

  const activeSchema = PAGE_SCHEMAS[activePage];

  // Derive initial/current values
  const getValue = (fieldDef) => {
    if (activeSchema.isLegal) {
      return draftDb?.settings?.legal?.[activeSchema.field] || '';
    }
    return draftDb?.pages?.[activePage]?.[fieldDef.name] || fieldDef.default || '';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#000000]">Page Content</h1>
          <p className="text-sm text-[#000000]/60 mt-2">Edit static pages, guides, and policies without writing code.</p>
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

      <div className="flex flex-col md:flex-row gap-8 items-start mt-8">
        {/* SIDEBAR NAVIGATION */}
        <div className="w-full md:w-64 flex-shrink-0 bg-white border border-[#000000]/10 p-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/50 mb-4 px-2">Guides</h3>
          <ul className="space-y-1 mb-6">
            {Object.keys(PAGE_SCHEMAS).filter(k => PAGE_SCHEMAS[k].category === 'Guides').map(key => (
              <li key={key}>
                <button
                  onClick={() => setActivePage(key)}
                  className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${activePage === key ? 'bg-[#000000] text-white' : 'text-[#000000]/70 hover:bg-[#000000]/5'}`}
                >
                  {PAGE_SCHEMAS[key].title}
                </button>
              </li>
            ))}
          </ul>

          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/50 mb-4 px-2">Informational</h3>
          <ul className="space-y-1 mb-6">
            {Object.keys(PAGE_SCHEMAS).filter(k => PAGE_SCHEMAS[k].category === 'Informational').map(key => (
              <li key={key}>
                <button
                  onClick={() => setActivePage(key)}
                  className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${activePage === key ? 'bg-[#000000] text-white' : 'text-[#000000]/70 hover:bg-[#000000]/5'}`}
                >
                  {PAGE_SCHEMAS[key].title}
                </button>
              </li>
            ))}
          </ul>

          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/50 mb-4 px-2">Policies</h3>
          <ul className="space-y-1">
            {Object.keys(PAGE_SCHEMAS).filter(k => PAGE_SCHEMAS[k].category === 'Policies').map(key => (
              <li key={key}>
                <button
                  onClick={() => setActivePage(key)}
                  className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${activePage === key ? 'bg-[#000000] text-white' : 'text-[#000000]/70 hover:bg-[#000000]/5'}`}
                >
                  {PAGE_SCHEMAS[key].title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* MAIN EDITOR AREA */}
        <div className="flex-1 bg-white border border-[#000000]/10 p-6 md:p-8 w-full">
          <div className="mb-8 border-b border-[#000000]/10 pb-4">
            <h2 className="text-xl font-bold uppercase tracking-tight text-[#000000]">
              Editing: {activeSchema.title}
            </h2>
            <p className="text-xs text-[#000000]/50 mt-1">Changes are saved as drafts until published.</p>
          </div>

          <div className="space-y-8">
            {activeSchema.isLegal ? (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-[#000000]/70">
                  {activeSchema.title} Content (Supports plain text with line breaks)
                </label>
                <textarea
                  value={getValue()}
                  onChange={(e) => handleLegalChange(activeSchema.field, e.target.value)}
                  rows="20"
                  className="w-full bg-[#f9f9f9] border border-[#000000]/20 p-4 text-sm focus:border-[#000000] outline-none font-mono"
                  placeholder="Paste your legal text here..."
                />
              </div>
            ) : (
              activeSchema.fields.map((field, idx) => {
                const val = getValue(field);
                return (
                  <div key={idx} className="border-l-2 border-[#000000]/10 pl-4 py-1">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-[#000000]/70">
                      {field.label}
                    </label>
                    
                    {field.type === 'text' && (
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handlePageFieldChange(activePage, field.name, e.target.value)}
                        placeholder={field.default}
                        className="w-full max-w-xl bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm focus:border-[#000000] outline-none"
                      />
                    )}

                    {field.type === 'textarea' && (
                      <textarea
                        value={val}
                        onChange={(e) => handlePageFieldChange(activePage, field.name, e.target.value)}
                        placeholder={field.default}
                        rows="4"
                        className="w-full max-w-xl bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm focus:border-[#000000] outline-none resize-none"
                      />
                    )}

                    {field.type === 'image' && (
                      <div className="flex items-end gap-4">
                        <div className="w-32 h-32 bg-[#f5f5f5] border border-[#000000]/10 overflow-hidden flex items-center justify-center relative group">
                          {val ? (
                            <img src={val} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-[#000000]/40">No Image</span>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                             <button
                               onClick={() => handleImageUpload(activePage, field.name)}
                               className="text-[10px] text-white font-bold uppercase tracking-wider"
                             >
                               Replace
                             </button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleImageUpload(activePage, field.name)}
                            className="bg-[#000000] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-[#000000]/80"
                          >
                            Upload Image
                          </button>
                          {val && val !== field.default && (
                            <button
                              onClick={() => handlePageFieldChange(activePage, field.name, field.default)}
                              className="text-[10px] text-red-600 font-bold uppercase tracking-wider hover:underline"
                            >
                              Reset to Default
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
