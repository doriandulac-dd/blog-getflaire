import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { BlogService } from '../services/blogService';
import { BlogCard } from './BlogCard';
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '../lib/gsap';

export const BlogSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const data = await BlogService.getLatestPosts(3);
        setPosts(data);
      } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  useGSAP(() => {
    if (loading || prefersReducedMotion()) return;

    const cards = gsap.utils.toArray<HTMLElement>('[data-blog-card]');

    gsap.from('.blog-section-heading', {
      y: 36,
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 76%',
        toggleActions: 'play none none reverse',
      },
    });

    ScrollTrigger.batch(cards, {
      start: 'top 86%',
      once: true,
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          { y: 42, autoAlpha: 0, rotateX: -8, filter: 'blur(10px)' },
          { y: 0, autoAlpha: 1, rotateX: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out', stagger: 0.12 }
        );
      },
    });

    return () => ScrollTrigger.refresh();
  }, { scope: sectionRef, dependencies: [loading, posts.length], revertOnUpdate: true });

  if (loading) {
    return (
      <section className="editorial-shell py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-secondary mb-4">
              Blog GetFlaire
            </h2>
            <p className="text-xl text-tertiary max-w-3xl mx-auto">
              Découvrez nos derniers articles sur la prospection immobilière.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="aspect-video bg-tertiary/20"></div>
                <div className="p-6">
                  <div className="h-4 bg-tertiary/20 rounded mb-3"></div>
                  <div className="h-6 bg-tertiary/20 rounded mb-3"></div>
                  <div className="h-4 bg-tertiary/20 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

    return (
    <section ref={sectionRef} className="editorial-shell py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="blog-section-heading mx-auto mb-14 max-w-4xl text-center">
          <span className="mb-4 inline-flex rounded-full border border-secondary/10 bg-white/80 px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-primary shadow-sm">
            Le radar des agences modernes
          </span>
          <h2 className="text-4xl font-black text-secondary mb-4 md:text-6xl">
            Des idées qui accélèrent vos mandats
          </h2>
          <p className="text-lg text-tertiary md:text-xl">
            Découvrez nos derniers articles sur la pige immobilière, l'investissement et les stratégies digitales des agences.
          </p>
        </div>

        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/blog"
                className="btn-primary inline-flex items-center gap-2 px-8 py-4"
              >
                Voir tous les articles
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-tertiary text-lg mb-6">
              Aucun article publié pour le moment.
            </p>
            <p className="text-tertiary/80">
              Revenez bientôt pour découvrir nos premiers contenus !
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
