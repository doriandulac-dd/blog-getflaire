import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { BlogService } from '../services/blogService';
import { BlogCard } from './BlogCard';
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '../lib/gsap';

export const BlogSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BlogService.getLatestPosts(3).then(setPosts).catch((error) => console.error('Erreur lors du chargement des articles:', error)).finally(() => setLoading(false));
  }, []);

  useGSAP(() => {
    if (loading || prefersReducedMotion()) return;
    gsap.from('.section-reveal', { y: 24, autoAlpha: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true } });
    ScrollTrigger.batch('[data-blog-card]', { start: 'top 88%', once: true, onEnter: (batch) => gsap.from(batch, { y: 26, autoAlpha: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out' }) });
  }, { scope: sectionRef, dependencies: [loading, posts.length], revertOnUpdate: true });

  return (
    <section ref={sectionRef} className="bg-white py-24 md:py-32">
      <div className="site-container">
        <div className="section-reveal flex flex-col gap-8 border-b border-[var(--flaire-line)] pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">Le terrain évolue</span>
            <h2 className="mt-5 max-w-3xl text-[clamp(2.6rem,5vw,4.8rem)] font-extrabold leading-[0.96] text-secondary">Conseils et actualités immobilières.</h2>
          </div>
          <Link to="/blog" className="text-link shrink-0">Tous les articles <ArrowUpRight className="h-4 w-4" /></Link>
        </div>

        {loading ? (
          <div className="grid gap-8 pt-10 md:grid-cols-3"><div className="aspect-[4/3] animate-pulse bg-background" /><div className="aspect-[4/3] animate-pulse bg-background" /><div className="aspect-[4/3] animate-pulse bg-background" /></div>
        ) : posts.length > 0 ? (
          <div className="grid gap-8 pt-10 md:grid-cols-3 md:gap-0">{posts.map((post) => <BlogCard key={post.id} post={post} />)}</div>
        ) : (
          <p className="py-16 text-tertiary">Aucun article publié pour le moment.</p>
        )}
      </div>
    </section>
  );
};
