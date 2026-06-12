import React, { useState, useEffect } from 'react';
import { useCms } from '../../context/CmsContext';

const EyeOff = ({ size = 10 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
    <line x1="2" y1="2" x2="22" y2="22"></line>
  </svg>
);


const createGuideSchema = (title) => ({
  title,
  sections: [
    {
      id: 'hero',
      label: 'Hero Section',
      fields: [
        { name: 'heroVisible', label: 'Show Section', type: 'boolean', default: true },
        { name: 'heroImage', label: 'Hero Image', type: 'image' },
        { name: 'heroEyebrow', label: 'Eyebrow Text', type: 'text' },
        { name: 'heroTitle', label: 'Title', type: 'text' },
        { name: 'heroDesc', label: 'Description', type: 'textarea' }
      ]
    },
    {
      id: 'intro',
      label: 'Intro Text',
      fields: [
        { name: 'introVisible', label: 'Show Section', type: 'boolean', default: true },
        { name: 'introTitle', label: 'Title', type: 'text' },
        { name: 'introText', label: 'Content', type: 'textarea' },
        { name: 'introBtnText', label: 'Button Text', type: 'text' },
        { name: 'introBtnLink', label: 'Button Link', type: 'text' }
      ]
    },
    {
      id: 'section1',
      label: 'Focus Section 1',
      fields: [
        { name: 'section1Visible', label: 'Show Section', type: 'boolean', default: true },
        { name: 'section1Image', label: 'Image', type: 'image' },
        { name: 'section1Eyebrow', label: 'Eyebrow', type: 'text' },
        { name: 'section1Title', label: 'Title', type: 'text' },
        { name: 'section1Desc', label: 'Description', type: 'textarea' },
        { name: 'section1BtnText', label: 'Button Text', type: 'text' },
        { name: 'section1BtnLink', label: 'Button Link', type: 'text' }
      ]
    },
    {
      id: 'section2',
      label: 'Focus Section 2',
      fields: [
        { name: 'section2Visible', label: 'Show Section', type: 'boolean', default: true },
        { name: 'section2Image', label: 'Image', type: 'image' },
        { name: 'section2Eyebrow', label: 'Eyebrow', type: 'text' },
        { name: 'section2Title', label: 'Title', type: 'text' },
        { name: 'section2Desc', label: 'Description', type: 'textarea' },
        { name: 'section2BtnText', label: 'Button Text', type: 'text' },
        { name: 'section2BtnLink', label: 'Button Link', type: 'text' }
      ]
    },
    {
      id: 'cta',
      label: 'Footer CTA',
      fields: [
        { name: 'ctaVisible', label: 'Show Section', type: 'boolean', default: true },
        { name: 'ctaTitle', label: 'Title', type: 'text' },
        { name: 'ctaDesc', label: 'Description', type: 'textarea' },
        { name: 'ctaBtnText', label: 'Button Text', type: 'text' },
        { name: 'ctaBtnLink', label: 'Button Link', type: 'text' }
      ]
    }
  ]
});

const PAGE_SCHEMA = {
  home: {
    title: 'Home Page',
    sections: [
      {
        id: 'hero',
        label: 'Hero Section',
        fields: [
          { name: 'heroVisible', label: 'Show Section', type: 'boolean', default: true },
          { name: 'heroTitle', label: 'Title', type: 'text', default: 'Refined Luxury Essentials' },
          { name: 'heroDesc', label: 'Description', type: 'textarea', default: 'Discover the latest collection of premium essentials designed for modern living.' },
          { name: 'heroBtnText', label: 'Button Text', type: 'text', default: 'Shop Now' },
          { name: 'heroBtnLink', label: 'Button Link', type: 'text', default: '/new-in/all-new-arrivals' },
          { name: 'heroImage', label: 'Background Image URL', type: 'image', default: '/images/hero.webp' },
          { name: 'heroVideo', label: 'Background Video (optional)', type: 'video' }
        ]
      },
      {
        id: 'products',
        label: 'Most Wanted Categories',
        fields: [
          { name: 'productsVisible', label: 'Show Section', type: 'boolean', default: true },
          { name: 'productsTitle', label: 'Section Title', type: 'text', default: 'Most Wanted' },
          { name: 'cat1Image', label: 'Category 1 Image', type: 'image', default: '/images/product-1.webp' },
          { name: 'cat1Title', label: 'Category 1 Title', type: 'text', default: 'Category 1' },
          { name: 'cat1Link', label: 'Category 1 Link', type: 'text', default: '/clothing' },
          { name: 'cat2Image', label: 'Category 2 Image', type: 'image', default: '/images/product-2.webp' },
          { name: 'cat2Title', label: 'Category 2 Title', type: 'text', default: 'Category 2' },
          { name: 'cat2Link', label: 'Category 2 Link', type: 'text', default: '/clothing' },
          { name: 'cat3Image', label: 'Category 3 Image', type: 'image', default: '/images/product-3.webp' },
          { name: 'cat3Title', label: 'Category 3 Title', type: 'text', default: 'Category 3' },
          { name: 'cat3Link', label: 'Category 3 Link', type: 'text', default: '/clothing' },
          { name: 'cat4Image', label: 'Category 4 Image', type: 'image', default: '/images/product-4.webp' },
          { name: 'cat4Title', label: 'Category 4 Title', type: 'text', default: 'Category 4' },
          { name: 'cat4Link', label: 'Category 4 Link', type: 'text', default: '/clothing' }
        ]
      },
      {
        id: 'editorial',
        label: 'Editorial Feature',
        fields: [
          { name: 'editorialVisible', label: 'Show Section', type: 'boolean', default: true },
          { name: 'editorialTitle', label: 'Title', type: 'text', default: 'Behind the Design' },
          { name: 'editorialDesc', label: 'Description', type: 'textarea', default: 'A look into our meticulous design process.' },
          { name: 'editorialImage', label: 'Image URL', type: 'image', default: '/images/editorial-wide.webp' },
          { name: 'editorialBtnText', label: 'Button Text', type: 'text', default: 'Read More' },
          { name: 'editorialBtnLink', label: 'Button Link', type: 'text', default: '/about/our-story' }
        ]
      },
      {
        id: 'newArrivals',
        label: 'New Arrivals Product Ribbon',
        fields: [
          { name: 'newArrivalsVisible', label: 'Show Section', type: 'boolean', default: true }
        ]
      },
      {
        id: 'curation',
        label: 'Curated For You',
        fields: [
          { name: 'curationVisible', label: 'Show Section', type: 'boolean', default: true },
          { name: 'curationTitle', label: 'Section Title', type: 'text', default: 'Curated For You' },
          { name: 'curationMainImage', label: 'Main Curation Image', type: 'image', default: '/images/campaign-2.webp' },
          { name: 'curationMainTitle', label: 'Main Curation Title', type: 'text', default: 'The Lounge Edit' },
          { name: 'curationMainLink', label: 'Main Curation Link', type: 'text', default: '/other/shop-the-collection' },
          { name: 'curationSub1Image', label: 'Sub Item 1 Image', type: 'image', default: '/images/product-2.webp' },
          { name: 'curationSub1Title', label: 'Sub Item 1 Title', type: 'text', default: 'Seamless Tops' },
          { name: 'curationSub1Link', label: 'Sub Item 1 Link', type: 'text', default: '/other/view' },
          { name: 'curationSub2Image', label: 'Sub Item 2 Image', type: 'image', default: '/images/product-3.webp' },
          { name: 'curationSub2Title', label: 'Sub Item 2 Title', type: 'text', default: 'Performance Leggings' },
          { name: 'curationSub2Link', label: 'Sub Item 2 Link', type: 'text', default: '/other/view' }
        ]
      }
    ]
  },
  trendGuide: {
    title: 'Trend Guide',
    sections: [
      {
        id: 'hero',
        label: 'Hero Section',
        fields: [
          { name: 'heroImage', label: 'Hero Image URL', type: 'text' },
          { name: 'heroEyebrow', label: 'Eyebrow Text', type: 'text' },
          { name: 'heroTitle', label: 'Title', type: 'text' },
          { name: 'heroDesc', label: 'Description', type: 'textarea' },
          { name: 'heroVisible', label: 'Show Section', type: 'boolean', default: true }
        ]
      },
      {
        id: 'intro',
        label: 'Intro Section',
        fields: [
          { name: 'introTitle', label: 'Title', type: 'text' },
          { name: 'introText', label: 'Content', type: 'textarea' },
          { name: 'introBtnText', label: 'Button Text', type: 'text' },
          { name: 'introBtnLink', label: 'Button Link', type: 'text' },
          { name: 'introVisible', label: 'Show Section', type: 'boolean', default: true }
        ]
      },
      {
        id: 'trend1',
        label: 'Trend 1',
        fields: [
          { name: 'trend1Image', label: 'Image URL', type: 'text' },
          { name: 'trend1Title', label: 'Title', type: 'text' },
          { name: 'trend1Desc', label: 'Description', type: 'textarea' },
          { name: 'trend1Visible', label: 'Show Section', type: 'boolean', default: true }
        ]
      },
      {
        id: 'trend2',
        label: 'Trend 2',
        fields: [
          { name: 'trend2Image', label: 'Image URL', type: 'text' },
          { name: 'trend2Title', label: 'Title', type: 'text' },
          { name: 'trend2Desc', label: 'Description', type: 'textarea' },
          { name: 'trend2Visible', label: 'Show Section', type: 'boolean', default: true }
        ]
      },
      {
        id: 'cta',
        label: 'Footer CTA',
        fields: [
          { name: 'ctaTitle', label: 'Title', type: 'text' },
          { name: 'ctaDesc', label: 'Description', type: 'textarea' },
          { name: 'ctaBtnText', label: 'Button Text', type: 'text' },
          { name: 'ctaBtnLink', label: 'Button Link', type: 'text' },
          { name: 'ctaVisible', label: 'Show Section', type: 'boolean', default: true }
        ]
      }
    ]
  },
  clothingGuide: { title: 'Clothing Guide', sections: [{ id: 'main', label: 'Page Content', fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'content', label: 'Content', type: 'textarea' }, { name: 'visible', label: 'Show Page', type: 'boolean', default: true }] }] },
  braFitGuide: { title: 'Bra Fit Guide', sections: [{ id: 'main', label: 'Page Content', fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'content', label: 'Content', type: 'textarea' }, { name: 'visible', label: 'Show Page', type: 'boolean', default: true }] }] },
  underwearGuide: { title: 'Underwear Guide', sections: [{ id: 'main', label: 'Page Content', fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'content', label: 'Content', type: 'textarea' }, { name: 'visible', label: 'Show Page', type: 'boolean', default: true }] }] },
  swimFitGuide: { title: 'Swim Fit Guide', sections: [{ id: 'main', label: 'Page Content', fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'content', label: 'Content', type: 'textarea' }, { name: 'visible', label: 'Show Page', type: 'boolean', default: true }] }] },
  ourStory: { title: 'Our Story', sections: [{ id: 'main', label: 'Page Content', fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'content', label: 'Content', type: 'textarea' }, { name: 'visible', label: 'Show Page', type: 'boolean', default: true }] }] },
  sustainability: { title: 'Sustainability', sections: [{ id: 'main', label: 'Page Content', fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'content', label: 'Content', type: 'textarea' }, { name: 'visible', label: 'Show Page', type: 'boolean', default: true }] }] },
  careers: { title: 'Careers', sections: [{ id: 'main', label: 'Page Content', fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'content', label: 'Content', type: 'textarea' }, { name: 'visible', label: 'Show Page', type: 'boolean', default: true }] }] },
  press: { title: 'Press', sections: [{ id: 'main', label: 'Page Content', fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'content', label: 'Content', type: 'textarea' }, { name: 'visible', label: 'Show Page', type: 'boolean', default: true }] }] },
  returns: { title: 'Returns Policy', sections: [{ id: 'main', label: 'Page Content', fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'content', label: 'Content', type: 'textarea' }, { name: 'visible', label: 'Show Page', type: 'boolean', default: true }] }] },
  orderTracking: { title: 'Order Tracking Help', sections: [{ id: 'main', label: 'Page Content', fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'content', label: 'Content', type: 'textarea' }, { name: 'visible', label: 'Show Page', type: 'boolean', default: true }] }] },
  sizeGuide: { title: 'Size Guide', sections: [{ id: 'main', label: 'Page Content', fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'content', label: 'Content', type: 'textarea' }, { name: 'visible', label: 'Show Page', type: 'boolean', default: true }] }] },
  contact: { title: 'Contact Us', sections: [{ id: 'main', label: 'Page Content', fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'content', label: 'Content', type: 'textarea' }, { name: 'visible', label: 'Show Page', type: 'boolean', default: true }] }] },
  policyPage: { title: 'Dynamic Policies (Terms, Privacy)', sections: [{ id: 'main', label: 'Page Content', fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'content', label: 'Content', type: 'textarea' }, { name: 'visible', label: 'Show Page', type: 'boolean', default: true }] }] },
  navbar: {
    title: 'Navigation Bar',
    sections: [
      {
        id: 'newIn',
        label: 'New In Dropdown',
        fields: [
          { name: 'newInImage', label: 'Dropdown Image URL', type: 'image', default: '/images/campaign-1.webp' },
          { name: 'newInTitle', label: 'Image Title', type: 'text', default: 'Volume 02 Preview' },
          { name: 'newInDesc', label: 'Image Description', type: 'text', default: 'Discover the next evolution of our essentials.' }
        ]
      },
      {
        id: 'clothing',
        label: 'Clothing Dropdown',
        fields: [
          { name: 'clothingImage', label: 'Dropdown Image URL', type: 'image', default: '/images/editorial-wide.webp' },
          { name: 'clothingTitle', label: 'Image Title', type: 'text', default: 'The Essentials Edit' },
          { name: 'clothingDesc', label: 'Image Description', type: 'text', default: 'Shop the looks from our latest campaign.' }
        ]
      },
      {
        id: 'bras',
        label: 'Bras Dropdown',
        fields: [
          { name: 'brasImage', label: 'Dropdown Image URL', type: 'image', default: '/images/product-3.webp' },
          { name: 'brasTitle', label: 'Image Title', type: 'text', default: 'Second-Skin Feel' },
          { name: 'brasDesc', label: 'Image Description', type: 'text', default: 'Engineered for invisible, weightless support.' }
        ]
      },
      {
        id: 'underwear',
        label: 'Underwear Dropdown',
        fields: [
          { name: 'underwearImage', label: 'Dropdown Image URL', type: 'image', default: '/images/product-2.webp' },
          { name: 'underwearTitle', label: 'Image Title', type: 'text', default: 'Seamless Collection' },
          { name: 'underwearDesc', label: 'Image Description', type: 'text', default: 'Smooth lines and ultimate comfort for every body.' }
        ]
      },
      {
        id: 'accessories',
        label: 'Accessories Dropdown',
        fields: [
          { name: 'accessoriesImage', label: 'Dropdown Image URL', type: 'image', default: '/images/campaign-2.webp' },
          { name: 'accessoriesTitle', label: 'Image Title', type: 'text', default: 'Signature Scents' },
          { name: 'accessoriesDesc', label: 'Image Description', type: 'text', default: 'Complete the uniform with our new fragrance line.' }
        ]
      },
      {
        id: 'swimwear',
        label: 'Swimwear Dropdown',
        fields: [
          { name: 'swimwearImage', label: 'Dropdown Image URL', type: 'image', default: '/images/product-1.webp' },
          { name: 'swimwearTitle', label: 'Image Title', type: 'text', default: 'The Resort Edit' },
          { name: 'swimwearDesc', label: 'Image Description', type: 'text', default: 'Minimal silhouettes ready for the sun.' }
        ]
      }
    ]
  }
};

export default function AdminPages() {
  const { db, draftDb, updateDraft, publishChanges, isLoading, uploadFile } = useCms();
  const [activePage, setActivePage] = useState('home');
  const [openSections, setOpenSections] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize draft on mount
  useEffect(() => {
    setHasUnsavedChanges(false);
  }, [db]);

  const toggleSection = (id) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFieldChange = (fieldName, value) => {
    updateDraft((prev) => {
      const nextPages = { ...prev.pages };
      nextPages[activePage] = { ...(nextPages[activePage] || {}), [fieldName]: value };
      return { ...prev, pages: nextPages };
    });
    setHasUnsavedChanges(true);
  };

  const handleFileUpload = async (fieldName, file) => {
    const result = await uploadFile(file);
    if (result.success) {
      handleFieldChange(fieldName, result.url);
    }
  };

  const handlePublish = async () => {
    await publishChanges();
    setHasUnsavedChanges(false);
  };

  const currentSchema = PAGE_SCHEMA[activePage];
  const currentData = draftDb?.pages?.[activePage] || db?.pages?.[activePage] || {};

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-ink">Page Content</h1>
          <p className="text-sm text-cocoa mt-1">Manage content blocks for all static pages.</p>
        </div>
        <button
          onClick={handlePublish}
          disabled={isLoading || !hasUnsavedChanges}
          className="flex items-center gap-2 bg-ink text-canvas px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-ink/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Publishing...' : 'Publish Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-1 border-r border-clay/30 pr-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-cocoa mb-4 pl-3">Pages</h3>
          {Object.entries(PAGE_SCHEMA).map(([key, schema]) => (
            <button
              key={key}
              onClick={() => setActivePage(key)}
              className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                activePage === key ? 'bg-sand text-ink border-l-2 border-ink' : 'text-cocoa hover:bg-sand/50'
              }`}
            >
              {schema.title}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white border border-clay/30 p-6">
            <h2 className="text-lg font-bold uppercase tracking-tight text-ink mb-6">{currentSchema.title}</h2>
            
            <div className="space-y-4">
              {currentSchema.sections.map((section, idx) => {
                const isOpen = openSections[section.id] !== false; // Default open
                // Check if visibility field exists and its value
                const visibilityField = section.fields.find(f => f.type === 'boolean');
                const isVisible = visibilityField ? (currentData[visibilityField.name] !== false) : true;

                return (
                  <div key={section.id} className={`border ${isVisible ? 'border-clay/50' : 'border-red-200 bg-red-50/20'} overflow-hidden`}>
                    <div 
                      className={`flex justify-between items-center p-4 cursor-pointer hover:bg-sand/30 transition-colors ${isVisible ? 'bg-sand/20' : 'bg-red-50'}`}
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-cocoa bg-white px-2 py-1 uppercase tracking-widest border border-clay/30">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 className={`text-sm font-bold uppercase tracking-wider ${isVisible ? 'text-ink' : 'text-red-800'}`}>
                          {section.label}
                        </h3>
                        {!isVisible && (
                          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                            <EyeOff size={10} /> Hidden
                          </span>
                        )}
                      </div>
                      <svg 
                        className={`w-5 h-5 text-cocoa transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {isOpen && (
                      <div className="p-6 space-y-6 border-t border-clay/30 bg-white">
                        {section.fields.map(field => {
                          const val = currentData[field.name] !== undefined ? currentData[field.name] : (field.default || '');
                          
                          if (field.type === 'boolean') {
                            return (
                              <div key={field.name} className="flex items-center justify-between border-b border-clay/20 pb-4">
                                <div>
                                  <label className="text-xs font-bold uppercase tracking-wider text-ink block">{field.label}</label>
                                  <span className="text-[10px] text-cocoa mt-1 block">Toggle to show or hide this entire section on the storefront.</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleFieldChange(field.name, !val)}
                                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${val ? 'bg-ink' : 'bg-clay'}`}
                                >
                                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${val ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                              </div>
                            );
                          }

                          return (
                            <div key={field.name} className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-cocoa">
                                {field.label}
                              </label>
                              {field.type === 'textarea' ? (
                                <textarea
                                  value={val}
                                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                  className="w-full border border-clay p-3 text-sm focus:border-ink focus:ring-0 outline-none transition-colors min-h-[100px] whitespace-pre-wrap font-mono"
                                  placeholder={`Enter ${field.label.toLowerCase()}`}
                                />
                              ) : field.type === 'image' || field.type === 'video' ? (
                                <div className="space-y-3">
                                  <div 
                                    className="border-2 border-dashed border-clay/60 hover:border-ink transition-colors rounded p-6 flex flex-col items-center justify-center cursor-pointer text-center group bg-canvas"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                        handleFileUpload(field.name, e.dataTransfer.files[0]);
                                      }
                                    }}
                                    onClick={() => document.getElementById(`upload-${field.name}`).click()}
                                  >
                                    <input 
                                      id={`upload-${field.name}`}
                                      type="file" 
                                      accept={field.type === 'image' ? "image/*" : "video/*"}
                                      className="hidden" 
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                          handleFileUpload(field.name, e.target.files[0]);
                                        }
                                      }} 
                                    />
                                    <div className="w-10 h-10 rounded-full bg-sand flex items-center justify-center mb-3 group-hover:bg-ink group-hover:text-white transition-colors">
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    </div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-ink mb-1">
                                      Drag & Drop or Click to Upload {field.type}
                                    </p>
                                    <p className="text-[10px] text-cocoa">
                                      Supports {field.type === 'image' ? 'JPG, PNG, WEBP' : 'MP4, WEBM'} (max 4.5MB)
                                    </p>
                                  </div>
                                  
                                  <div className="flex items-center gap-3">
                                    <div className="flex-1 relative">
                                      <input
                                        type="text"
                                        value={val}
                                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                        className="w-full border border-clay p-3 text-sm focus:border-ink focus:ring-0 outline-none transition-colors"
                                        placeholder={`Or enter ${field.label.toLowerCase()} URL`}
                                      />
                                    </div>
                                    {field.type === 'image' && val && (
                                      <div className="shrink-0 w-20 h-12 bg-sand border border-clay/30 overflow-hidden relative group">
                                        <img src={val} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                          <a href={val} target="_blank" rel="noreferrer" className="text-white hover:text-sand" onClick={(e) => e.stopPropagation()}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                          </a>
                                        </div>
                                      </div>
                                    )}
                                    {field.type === 'video' && val && (
                                      <div className="shrink-0 w-20 h-12 bg-sand border border-clay/30 overflow-hidden relative">
                                        <video src={val} className="w-full h-full object-cover" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : field.type === 'text' ? (
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={val}
                                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                    className="w-full border border-clay p-3 text-sm focus:border-ink focus:ring-0 outline-none transition-colors"
                                    placeholder={`Enter ${field.label.toLowerCase()}`}
                                  />
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
