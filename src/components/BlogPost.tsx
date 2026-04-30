import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Calendar, User, ArrowLeft, Share2, ArrowRight, Zap, TrendingUp } from 'lucide-react';
import { BlogPost as BlogPostType } from '../types/blog';
import { BlogService } from '../services/blogService';
import { formatDate } from '../utils/dateUtils';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';

export const BlogPost: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await BlogService.getPostBySlug(slug);
        if (!data) {
          setError('Article non trouvé');
          return;
        }
        setPost(data);
        
        // Update page title
        document.title = `${data.title} - GetFlaire Blog`;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', data.excerpt);
        } else {
          const meta = document.createElement('meta');
          meta.name = 'description';
          meta.content = data.excerpt;
          document.head.appendChild(meta);
        }
      } catch (err) {
        setError('Erreur lors du chargement de l\'article');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();

    // Cleanup: Reset title on unmount
    return () => {
      document.title = 'GetFlaire';
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'GetFlaire - Blog');
      }
    };
  }, [slug]);

  useGSAP(() => {
    if (loading || !post) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const headerTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      headerTl
        .from('.article-back', { autoAlpha: 0, x: -18, duration: 0.45 })
        .from('.article-category', { autoAlpha: 0, y: 14, scale: 0.96, stagger: 0.06, duration: 0.4 }, '-=0.15')
        .from('.article-title', { autoAlpha: 0, y: 36, duration: 0.72 }, '-=0.1')
        .from('.article-meta', { autoAlpha: 0, y: 18, duration: 0.5 }, '-=0.25')
        .from('.article-share', { autoAlpha: 0, y: 14, stagger: 0.05, duration: 0.35 }, '-=0.2');

      gsap.from('.article-image', {
        autoAlpha: 0,
        y: 40,
        scale: 0.96,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.article-image',
          start: 'top 84%',
          once: true
        }
      });

      gsap.from('.article-reveal', {
        autoAlpha: 0,
        y: 28,
        duration: 0.62,
        ease: 'power2.out',
        stagger: 0.055,
        scrollTrigger: {
          trigger: '.article-body',
          start: 'top 78%',
          once: true
        }
      });

      gsap.from('.article-cta', {
        autoAlpha: 0,
        y: 48,
        scale: 0.94,
        duration: 0.8,
        ease: 'back.out(1.35)',
        scrollTrigger: {
          trigger: '.article-cta',
          start: 'top 82%',
          once: true
        }
      });

      gsap.to('.article-cta-orb', {
        rotate: 18,
        scale: 1.15,
        yoyo: true,
        repeat: -1,
        duration: 3.8,
        ease: 'sine.inOut'
      });

      ScrollTrigger.refresh();
    });

    return () => mm.revert();
  }, { scope: pageRef, dependencies: [loading, post?.id] });

  const sharePost = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    if (!post) return;
    
    const url = window.location.href;
    const text = `${post.title} - ${post.excerpt}`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="aspect-video bg-gray-200 rounded-2xl mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {error || 'Article non trouvé'}
          </h1>
          <p className="text-gray-600 mb-8">
            L'article que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Link
            to="/blog"
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          to="/blog"
          className="article-back inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au blog
        </Link>

        <article>
          <header className="mb-8">
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((category) => (
                  <span
                    key={category.id}
                    className="article-category px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            <h1 className="article-title text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="article-meta flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600 mb-6">
              {post.author && (
                <div className="flex items-center gap-3">
                  {post.author.avatar_url && (
                    <img
                      src={post.author.avatar_url}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{post.author.name}</span>
                    </div>
                    {post.author.bio && (
                      <p className="text-sm text-gray-500 max-w-md">
                        {post.author.bio}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
            </div>

            <div className="article-share flex items-center gap-4 mb-8">
              <span className="text-sm font-medium text-gray-700">Partager :</span>
              <div className="flex gap-2">
                <button
                  onClick={() => sharePost('twitter')}
                  className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Partager sur Twitter"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => sharePost('linkedin')}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Partager sur LinkedIn"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => sharePost('facebook')}
                  className="p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Partager sur Facebook"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          {post.featured_image_url && (
            <div className="article-image aspect-video mb-8 rounded-2xl overflow-hidden">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="article-body prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="article-reveal text-3xl font-bold text-gray-900 mt-8 mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="article-reveal text-2xl font-bold text-gray-900 mt-6 mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="article-reveal text-xl font-semibold text-gray-900 mt-5 mb-2">{children}</h3>,
                p: ({ children }) => <p className="article-reveal text-gray-700 leading-relaxed mb-4">{children}</p>,
                ul: ({ children }) => <ul className="article-reveal list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="article-reveal list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="text-gray-700">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="article-reveal border-l-4 border-blue-500 pl-4 py-2 my-6 bg-blue-50 rounded-r-lg">
                    <div className="text-gray-700 italic">{children}</div>
                  </blockquote>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                      {children}
                    </code>
                  );
                },
                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                em: ({ children }) => <em className="italic text-gray-700">{children}</em>
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* CTA Section */}
        <div className="article-cta my-16 bg-gradient-to-br from-secondary to-secondary/90 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="article-cta-orb absolute top-4 right-4 w-20 h-20 bg-primary/10 rounded-full"></div>
          <div className="article-cta-orb absolute bottom-4 left-4 w-16 h-16 bg-primary/5 rounded-full"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/GetFlaire logo long hd 2000*500-min.png" 
                alt="Logo GetFlaire" 
                className="h-8 w-auto"
              />
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à transformer votre prospection ?
            </h3>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Découvrez comment GetFlaire peut vous aider à gagner du temps et à signer plus de mandats 
              grâce à notre pige immobilière intelligente.
            </p>
            
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span>+300% de mandats</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span>Automatisation complète</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="https://app.getflaire.fr"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 inline-flex items-center gap-2 group"
              >
                Essayer gratuitement
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a 
                href="https://getflaire.fr"
                className="border-2 border-white text-white hover:bg-white hover:text-secondary px-8 py-4 rounded-2xl font-semibold transition-all duration-200"
              >
                Découvrir GetFlaire
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            to="/blog"
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>
        </div>
      </div>
    </div>
  );
};
