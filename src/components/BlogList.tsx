import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { BlogService } from '../services/blogService';
import { BlogCard } from './BlogCard';
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '../lib/gsap';

export const BlogList: React.FC = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredPost, ...regularPosts] = useMemo(() => posts, [posts]);

  useEffect(() => {
    BlogService.getAllPosts().then(setPosts).catch((err) => { setError('Erreur lors du chargement des articles'); console.error(err); }).finally(() => setLoading(false));
  }, []);

  useGSAP(() => {
    if (loading || error || prefersReducedMotion()) return;
    gsap.from('.featured-post', { y: 28, autoAlpha: 0, duration: 0.6, ease: 'power2.out' });
    ScrollTrigger.batch('.post-grid [data-blog-card]', { start: 'top 90%', once: true, onEnter: (batch) => gsap.from(batch, { y: 24, autoAlpha: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' }) });
  }, { scope: listRef, dependencies: [loading, error, posts.length], revertOnUpdate: true });

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-7 w-7 animate-spin text-primary" /><span className="sr-only">Chargement des articles</span></div>;
  if (error) return <div className="border border-red-200 bg-red-50 px-6 py-12 text-center"><p className="text-red-700">{error}</p><button onClick={() => window.location.reload()} className="button-primary mt-5">Réessayer</button></div>;
  if (!posts.length) return <p className="border border-[var(--flaire-line)] py-16 text-center text-tertiary">Aucun article publié pour le moment.</p>;

  return (
    <div ref={listRef}>
      {featuredPost && <div className="featured-post"><BlogCard post={featuredPost} featured /></div>}
      {regularPosts.length > 0 && <div className="post-grid mt-16 grid gap-8 md:grid-cols-2 md:gap-y-14 lg:grid-cols-3 lg:gap-x-0">{regularPosts.map((post) => <BlogCard key={post.id} post={post} />)}</div>}
    </div>
  );
};
