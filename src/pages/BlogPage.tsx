import React, { useRef } from 'react';
import { BlogList } from '../components/BlogList';
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap';

export const BlogPage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    gsap.from('.blog-page-intro > *', {
      y: 30,
      autoAlpha: 0,
      filter: 'blur(10px)',
      duration: 0.72,
      ease: 'power3.out',
      stagger: 0.1,
    });
  }, { scope: pageRef });

  return (
    <div ref={pageRef} className="editorial-shell min-h-screen px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="blog-page-intro mx-auto mb-14 max-w-4xl text-center">
          <span className="mb-4 inline-flex rounded-full border border-secondary/10 bg-white/80 px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-primary shadow-sm">
            Ressources GetFlaire
          </span>
          <h1 className="text-5xl font-black leading-tight text-secondary mb-6 md:text-7xl">
            Blog GetFlaire
          </h1>
          <p className="text-lg text-tertiary max-w-3xl mx-auto leading-relaxed md:text-xl">
            Découvrez nos réflexions sur la pige immobilière, l'investissement et les stratégies digitales des agences.
          </p>
        </div>

        <BlogList />
      </div>
    </div>
  );
};
