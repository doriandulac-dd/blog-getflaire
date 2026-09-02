import React, { useEffect, useRef } from 'react';
import { BlogList } from '../components/BlogList';
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap';

export const BlogPage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const ogUrl = document.head.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    const twitterUrl = document.head.querySelector<HTMLMetaElement>('meta[name="twitter:url"]');
    const blogUrl = 'https://blog.getflaire.fr/blog';

    canonical?.setAttribute('href', blogUrl);
    ogUrl?.setAttribute('content', blogUrl);
    twitterUrl?.setAttribute('content', blogUrl);

    return () => {
      canonical?.setAttribute('href', 'https://blog.getflaire.fr/');
      ogUrl?.setAttribute('content', 'https://blog.getflaire.fr/');
      twitterUrl?.setAttribute('content', 'https://blog.getflaire.fr/');
    };
  }, []);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from('.blog-intro > *', { y: 24, autoAlpha: 0, duration: 0.58, stagger: 0.075, ease: 'power3.out' });
  }, { scope: pageRef });

  return (
    <div ref={pageRef} className="min-h-screen bg-white">
      <section className="dark-grid pt-[73px] text-white">
        <div className="site-container grid min-h-[500px] items-end gap-10 py-16 lg:grid-cols-[1fr_0.55fr] lg:py-20">
          <div className="blog-intro">
            <span className="eyebrow">Ressources GetFlaire</span>
            <h1 className="mt-7 max-w-4xl text-[clamp(3.5rem,8vw,7.6rem)] font-extrabold leading-[0.88] tracking-[-0.06em]">Le terrain,<br /><span className="text-primary">décrypté.</span></h1>
          </div>
          <p className="blog-intro max-w-md border-l border-primary pl-6 text-base leading-7 text-[#C0C8D2] lg:mb-2">Pige immobilière, prospection et stratégies digitales : des ressources concrètes pour prendre une longueur d’avance.</p>
        </div>
      </section>
      <section className="py-20 md:py-28"><div className="site-container"><BlogList /></div></section>
    </div>
  );
};
