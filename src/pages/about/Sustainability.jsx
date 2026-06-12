import React from 'react';
import { Link } from 'react-router-dom';
import { useCms } from '../../context/CmsContext';

export default function Sustainability() {
  const { db } = useCms();
  const content = db?.pages?.sustainability || {};

  if (content.visible === false) return null;

  return (
    <main>
      <section className="py-32 bg-canvas min-h-[60vh] flex items-center justify-center">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-tight text-ink mb-4">{content.title || 'Sustainability'}</h1>
          <p className="text-cocoa whitespace-pre-wrap">{content.content || 'This is a placeholder page for Sustainability.'}</p>
          <Link to="/" className="inline-block mt-8 text-xs font-bold uppercase tracking-[0.2em] border-b border-ink pb-1 hover:text-cocoa transition-colors">Return Home</Link>
        </div>
      </section>
    </main>
  );
}
