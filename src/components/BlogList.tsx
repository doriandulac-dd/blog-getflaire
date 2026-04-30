import React, { useEffect, useRef, useState } from 'react';
import { BlogPost } from '../types/blog';
import { BlogService } from '../services/blogService';
import { BlogCard } from './BlogCard';
import { Loader2 } from 'lucide-react';
import { gsap, useGSAP } from '../lib/gsap';

export const BlogList: React.FC = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    if (loading || error || posts.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.blog-list-card', {
        y: 34,
        scale: 0.96,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: {
          trigger: listRef.current,
          start: 'top 94%',
          once: true
        }
      });
    });

    return () => mm.revert();
  }, { scope: listRef, dependencies: [loading, error, posts.length] });

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
    <div ref={listRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div key={post.id} className="blog-list-card">
          <BlogCard post={post} />
        </div>
      ))}
    </div>
  );
};
