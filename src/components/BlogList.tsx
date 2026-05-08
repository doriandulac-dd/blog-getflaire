import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BlogPost } from '../types/blog';
import { BlogService } from '../services/blogService';
import { BlogCard } from './BlogCard';
import { Loader2 } from 'lucide-react';
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '../lib/gsap';

export const BlogList: React.FC = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredPost, ...regularPosts] = useMemo(() => posts, [posts]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await BlogService.getAllPosts();
        setPosts(data);
      } catch (err) {
        setError('Erreur lors du chargement des articles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useGSAP(() => {
    if (loading || error || prefersReducedMotion()) return;

    gsap.from('.featured-post', {
      y: 42,
      autoAlpha: 0,
      scale: 0.98,
      filter: 'blur(12px)',
      duration: 0.8,
      ease: 'power3.out',
    });

    ScrollTrigger.batch('.post-grid [data-blog-card]', {
      start: 'top 86%',
      once: true,
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          { y: 46, autoAlpha: 0, filter: 'blur(10px)' },
          { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.72, ease: 'power3.out', stagger: 0.1 }
        );
      },
    });

    return () => ScrollTrigger.refresh();
  }, { scope: listRef, dependencies: [loading, error, posts.length], revertOnUpdate: true });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-tertiary text-lg">Aucun article publié pour le moment.</p>
      </div>
    );
  }

  return (
    <div ref={listRef} className="space-y-8">
      {featuredPost && (
        <div className="featured-post">
          <BlogCard post={featuredPost} featured />
        </div>
      )}

      {regularPosts.length > 0 && (
        <div className="post-grid grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {regularPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};
