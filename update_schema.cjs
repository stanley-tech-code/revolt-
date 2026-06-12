const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminPages.jsx', 'utf8');

const createSchemaStr = `
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

const PAGE_SCHEMA`;

content = content.replace('const PAGE_SCHEMA', createSchemaStr);

content = content.replace(/trendGuide: \{[\s\S]*?swimFitGuide: \{[\s\S]*?\}\n    \]\n  \},/m, 
  `trendGuide: createGuideSchema('Trend Guide'),
  clothingGuide: createGuideSchema('Clothing Guide'),
  braFitGuide: createGuideSchema('Bra Fit Guide'),
  underwearGuide: createGuideSchema('Underwear Guide'),
  swimFitGuide: createGuideSchema('Swim Fit Guide'),`);

fs.writeFileSync('src/pages/admin/AdminPages.jsx', content);
console.log('AdminPages.jsx updated with unified guide schema.');
