import React from 'react';
import { Link } from 'react-router-dom';

export default function OurStory() {
  return (
    <main>
      <section className="py-32 bg-canvas min-h-[60vh] flex items-center justify-center">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-tight text-ink mb-4">Our Story</h1>
          <p className="text-cocoa">This is a placeholder page for Our Story.</p>
          <Link to="/" className="inline-block mt-8 text-xs font-bold uppercase tracking-[0.2em] border-b border-ink pb-1 hover:text-cocoa transition-colors">Return Home</Link>
        </div>
      </section>
    </main>
  );
}
