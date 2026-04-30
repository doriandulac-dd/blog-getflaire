import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { BlogService } from '../services/blogService';
import { formatDateShort } from '../utils/dateUtils';
import { gsap, useGSAP } from '../lib/gsap';

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
    if (loading) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.home-blog-heading', {
        autoAlpha: 0,
        y: 28,
        duration: 0.65,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true
        }
      });

      gsap.from('.home-blog-card', {
        y: 42,
        scale: 0.94,
        duration: 0.72,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.home-blog-grid',
          start: 'top 94%',
          once: true
        }
      });

      gsap.from('.home-blog-cta', {
        autoAlpha: 0,
        y: 20,
        scale: 0.95,
        duration: 0.55,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.home-blog-cta',
          start: 'top 88%',
          once: true
        }
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [loading, posts.length] });

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Blog GetFlaire
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos derniers articles sur le développement, le design et l'entrepreneurship
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
    <section ref={sectionRef} className="py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="home-blog-heading text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary mb-4">
            Blog GetFlaire
          </h2>
          <p className="text-xl text-tertiary max-w-3xl mx-auto">
            Découvrez nos derniers articles sur la pige immobilière, l'investissement et les stratégies digitales des agences.
          </p>
        </div>

        {posts.length > 0 ? (
          <>
            <div className="home-blog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {posts.map((post) => (
                <article key={post.id} className="home-blog-card card overflow-hidden">
                  {post.featured_image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.categories.map((category) => (
                          <span
                            key={category.id}
                            className="px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-2xl"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <h3 className="text-lg font-bold text-secondary mb-2 line-clamp-2">
                      <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-tertiary mb-4 line-clamp-2 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-tertiary mb-4">
                      <div className="flex items-center gap-3">
                        {post.author && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{post.author.name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDateShort(post.published_at)}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group text-sm"
                    >
                      Lire la suite
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="home-blog-cta text-center">
              <Link
                to="/blog"
                className="btn-primary inline-flex items-center gap-2 px-8 py-4 font-medium"
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
