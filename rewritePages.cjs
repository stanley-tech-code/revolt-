const fs = require('fs');
const pages = [
  { path: 'src/pages/about/OurStory.jsx', key: 'ourStory', defaultTitle: 'Our Story', defaultText: 'This is a placeholder page for Our Story.' },
  { path: 'src/pages/about/Sustainability.jsx', key: 'sustainability', defaultTitle: 'Sustainability', defaultText: 'This is a placeholder page for Sustainability.' },
  { path: 'src/pages/about/Careers.jsx', key: 'careers', defaultTitle: 'Careers', defaultText: 'This is a placeholder page for Careers.' },
  { path: 'src/pages/about/Press.jsx', key: 'press', defaultTitle: 'Press', defaultText: 'This is a placeholder page for Press.' },
  { path: 'src/pages/help/Returns.jsx', key: 'returns', defaultTitle: 'Returns Policy', defaultText: 'This is a placeholder page for Returns Policy.' },
  { path: 'src/pages/help/OrderTracking.jsx', key: 'orderTracking', defaultTitle: 'Order Tracking', defaultText: 'This is a placeholder page for Order Tracking.' },
  { path: 'src/pages/help/SizeGuide.jsx', key: 'sizeGuide', defaultTitle: 'Size Guide', defaultText: 'This is a placeholder page for Size Guide.' },
  { path: 'src/pages/help/Contact.jsx', key: 'contact', defaultTitle: 'Contact Us', defaultText: 'This is a placeholder page for Contact Us.' },
  { path: 'src/pages/guides/ClothingGuide.jsx', key: 'clothingGuide', defaultTitle: 'Clothing Guide', defaultText: 'This is a placeholder page for Clothing Guide.' },
  { path: 'src/pages/guides/BraFitGuide.jsx', key: 'braFitGuide', defaultTitle: 'Bra Fit Guide', defaultText: 'This is a placeholder page for Bra Fit Guide.' },
  { path: 'src/pages/guides/UnderwearGuide.jsx', key: 'underwearGuide', defaultTitle: 'Underwear Guide', defaultText: 'This is a placeholder page for Underwear Guide.' },
  { path: 'src/pages/guides/SwimFitGuide.jsx', key: 'swimFitGuide', defaultTitle: 'Swim Fit Guide', defaultText: 'This is a placeholder page for Swim Fit Guide.' }
];

pages.forEach(p => {
  const componentName = p.path.split('/').pop().replace('.jsx', '');
  const template = `import React from 'react';
import { Link } from 'react-router-dom';
import { useCms } from '../../context/CmsContext';

export default function ${componentName}() {
  const { db } = useCms();
  const content = db?.pages?.${p.key} || {};

  if (content.visible === false) return null;

  return (
    <main>
      <section className="py-32 bg-canvas min-h-[60vh] flex items-center justify-center">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-tight text-ink mb-4">{content.title || '${p.defaultTitle}'}</h1>
          <p className="text-cocoa whitespace-pre-wrap">{content.content || '${p.defaultText}'}</p>
          <Link to="/" className="inline-block mt-8 text-xs font-bold uppercase tracking-[0.2em] border-b border-ink pb-1 hover:text-cocoa transition-colors">Return Home</Link>
        </div>
      </section>
    </main>
  );
}
`;

  fs.writeFileSync(p.path, template);
});
console.log('Successfully updated 12 static pages!');
