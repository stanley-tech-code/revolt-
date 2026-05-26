import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useCms } from '../context/CmsContext';

export default function PolicyPage() {
  const { slug } = useParams();
  const { db } = useCms();
  const legal = db?.settings?.legal || {};

  // Map slugs to CMS state fields and titles
  const policiesMap = {
    'privacy': { title: 'Privacy Policy', content: legal.privacyPolicy },
    'terms': { title: 'Terms & Conditions', content: legal.terms },
    'refund': { title: 'Refund Policy', content: legal.refund }
  };

  const policy = policiesMap[slug];

  if (!policy) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-[60vh] max-w-4xl mx-auto px-6 py-16 md:py-24 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold tracking-tight uppercase">{policy.title}</h1>
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#000000]/50 mt-4">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-sm max-w-none text-sm text-[#000000]/80">
        {policy.content ? (
          <div className="whitespace-pre-wrap">{policy.content}</div>
        ) : (
          <p className="text-center italic opacity-50">This policy is currently being updated. Please check back later.</p>
        )}
      </div>
    </div>
  );
}
