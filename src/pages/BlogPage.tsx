import React, { useRef } from 'react';
import { BlogList } from '../components/BlogList';
import { gsap, useGSAP } from '../lib/gsap';

export const BlogPage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.blog-page-heading', {
        autoAlpha: 0,
        y: 28,
        duration: 0.65,
        ease: 'power3.out'
      });
    });

    return () => mm.revert();
  }, { scope: pageRef });

  return (
    <div ref={pageRef} className="min-h-screen bg-background pt-20 pb-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="blog-page-heading text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
            Blog GetFlaire
          </h1>
          <p className="text-xl text-tertiary max-w-3xl mx-auto leading-relaxed">
            Découvrez nos réflexions sur la pige immobilière, l'investissement et les stratégies digitales des agences.
          </p>
        </div>

        <BlogList />
      </div>
    </div>
  );
};
