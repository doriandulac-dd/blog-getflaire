import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Calendar, User, ArrowLeft, Share2, ArrowRight, Zap, TrendingUp, MousePointer2 } from 'lucide-react';
import { BlogPost as BlogPostType } from '../types/blog';
import { BlogService } from '../services/blogService';
import { formatDate } from '../utils/dateUtils';
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '../lib/gsap';

export const BlogPost: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [previousPost, setPreviousPost] = useState<BlogPostType | null>(null);
  const [nextPost, setNextPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        setPreviousPost(null);
        setNextPost(null);
        const data = await BlogService.getPostBySlug(slug);
        if (!data) {
          setError('Article non trouvé');
          return;
        }
        setPost(data);

        try {
          const adjacentPosts = await BlogService.getAdjacentPosts(data.published_at, data.id);
          setPreviousPost(adjacentPosts.previousPost);
          setNextPost(adjacentPosts.nextPost);
        } catch (adjacentError) {
          console.error('Erreur lors du chargement des articles voisins:', adjacentError);
        }
        
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
    if (!post || loading) return;
    const reduceMotion = prefersReducedMotion();
    const mm = gsap.matchMedia();

    gsap.set('.reading-progress', { scaleX: 0, transformOrigin: 'left center' });

    ScrollTrigger.create({
      trigger: articleRef.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const progress = Math.round(self.progress * 100);
        gsap.set('.reading-progress', { scaleX: self.progress });
        setReadingProgress(progress);
      },
    });

    if (reduceMotion) return;

    const intro = gsap.timeline({
      defaults: { duration: 0.72, ease: 'power3.out' },
    });

    intro
      .from('.post-back', { x: -18, autoAlpha: 0 })
      .from('.post-category', { y: 18, autoAlpha: 0, stagger: 0.06 }, '-=0.38')
      .from('.post-title-line', { yPercent: 105, rotateX: -20, autoAlpha: 0, stagger: 0.08 }, '-=0.36')
      .from('.post-meta', { y: 24, autoAlpha: 0, filter: 'blur(10px)' }, '-=0.36')
      .from('.post-share', { y: 18, autoAlpha: 0, stagger: 0.05 }, '-=0.34');

    gsap.fromTo(
      '.post-hero-mask',
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.05,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.post-hero-mask',
          start: 'top 86%',
          toggleActions: 'play none none reverse',
        },
      },
    );

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        isMobile: '(max-width: 767px)',
      },
      ({ conditions }) => {
        const { isDesktop } = conditions as { isDesktop: boolean };

        gsap.to('.post-hero-image img', {
          y: isDesktop ? 58 : 24,
          scale: isDesktop ? 1.08 : 1.04,
          ease: 'none',
          scrollTrigger: {
            trigger: '.post-hero-mask',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        gsap.to('.reading-pill', {
          y: isDesktop ? 18 : 0,
          ease: 'none',
          scrollTrigger: {
            trigger: articleRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        });
      }
    );

    ScrollTrigger.batch('.markdown-reveal', {
      interval: 0.08,
      batchMax: 4,
      start: 'top 88%',
      once: true,
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          { y: 28, autoAlpha: 0, filter: 'blur(10px)' },
          {
            y: 0,
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration: 0.68,
            ease: 'power3.out',
            stagger: 0.08,
            overwrite: true,
          }
        );
      },
    });

    gsap.from('.post-cta > *', {
      y: 28,
      autoAlpha: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: '.post-cta',
        start: 'top 78%',
        toggleActions: 'play none none reverse',
      },
    });

    gsap.to('.post-cta-orbit', {
      rotate: 360,
      duration: 24,
      ease: 'none',
      repeat: -1,
    });

    gsap.from('.post-cta-stat', {
      scale: 0.82,
      autoAlpha: 0,
      duration: 0.55,
      ease: 'back.out(1.8)',
      stagger: 0.09,
      scrollTrigger: {
        trigger: '.post-cta',
        start: 'top 76%',
        toggleActions: 'play none none reverse',
      },
    });

    ScrollTrigger.batch('.post-adjacent-card', {
      start: 'top 92%',
      once: true,
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          { y: 24, autoAlpha: 0, filter: 'blur(10px)' },
          {
            y: 0,
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration: 0.62,
            ease: 'power3.out',
            stagger: 0.1,
            overwrite: true,
          }
        );
      },
    });

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, { scope: pageRef, dependencies: [post?.id, loading], revertOnUpdate: true });

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
      <div className="editorial-shell min-h-screen py-28">
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
      <div className="editorial-shell min-h-screen py-28">
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
    <div ref={pageRef} className="editorial-shell min-h-screen py-28">
      <div className="fixed left-0 top-16 z-40 h-1 w-full bg-secondary/10">
        <div className="reading-progress h-full w-full origin-left scale-x-0 bg-primary" />
      </div>

      <div className="reading-pill fixed right-4 top-24 z-40 hidden rounded-full border border-secondary/10 bg-white/90 px-3 py-2 text-xs font-extrabold text-secondary shadow-lg shadow-secondary/10 backdrop-blur md:flex md:items-center md:gap-2">
        <MousePointer2 className="h-3.5 w-3.5 text-primary" />
        <span>{readingProgress}% lu</span>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <Link
          to="/blog"
          className="post-back mb-8 inline-flex items-center gap-2 font-extrabold text-primary transition-colors hover:text-[#ff930f]"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au blog
        </Link>

        <article ref={articleRef}>
          <header className="mb-10">
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((category) => (
                  <span
                    key={category.id}
                    className="post-category rounded-full bg-primary/15 px-3 py-1 text-sm font-extrabold uppercase tracking-wide text-secondary"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            <h1 className="max-w-4xl overflow-hidden text-5xl font-black leading-tight text-secondary mb-6 md:text-7xl">
              {post.title.split(' ').map((word, index) => (
                <span key={`${word}-${index}`} className="inline-block overflow-hidden pr-3 pb-2">
                  <span className="post-title-line inline-block">{word}</span>
                </span>
              ))}
            </h1>

            <div className="post-meta flex flex-col gap-4 text-tertiary mb-6 sm:flex-row sm:items-center">
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
                      <span className="font-bold">{post.author.name}</span>
                    </div>
                    {post.author.bio && (
                      <p className="text-sm text-tertiary max-w-md">
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

            <div className="post-share flex items-center gap-4 mb-8">
              <span className="text-sm font-extrabold text-secondary">Partager :</span>
              <div className="flex gap-2">
                <button
                  onClick={() => sharePost('twitter')}
                  className="rounded-lg p-2 text-tertiary transition-colors hover:bg-primary/10 hover:text-primary"
                  aria-label="Partager sur Twitter"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => sharePost('linkedin')}
                  className="rounded-lg p-2 text-tertiary transition-colors hover:bg-primary/10 hover:text-primary"
                  aria-label="Partager sur LinkedIn"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => sharePost('facebook')}
                  className="rounded-lg p-2 text-tertiary transition-colors hover:bg-primary/10 hover:text-primary"
                  aria-label="Partager sur Facebook"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          {post.featured_image_url && (
            <div className="post-hero-mask aspect-video mb-10 overflow-hidden rounded-xl shadow-2xl shadow-secondary/15">
              <div className="post-hero-image h-full w-full overflow-hidden">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-[112%] object-cover"
              />
              </div>
            </div>
          )}

          <div className="prose prose-lg max-w-none rounded-xl border border-secondary/10 bg-white/80 p-6 shadow-sm md:p-10">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="markdown-reveal text-3xl font-black text-secondary mt-8 mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="markdown-reveal text-2xl font-black text-secondary mt-6 mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="markdown-reveal text-xl font-bold text-secondary mt-5 mb-2">{children}</h3>,
                p: ({ children }) => <p className="markdown-reveal text-[#33415c] leading-relaxed mb-4">{children}</p>,
                ul: ({ children }) => <ul className="markdown-reveal list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="markdown-reveal list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="text-[#33415c]">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="markdown-reveal border-l-4 border-primary pl-4 py-2 my-6 bg-primary/10 rounded-r-lg">
                    <div className="text-[#33415c] italic">{children}</div>
                  </blockquote>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-secondary/10 text-secondary px-2 py-1 rounded text-sm font-mono">
                      {children}
                    </code>
                  ) : (
                    <code className="markdown-reveal block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                      {children}
                    </code>
                  );
                },
                strong: ({ children }) => <strong className="font-bold text-secondary">{children}</strong>,
                em: ({ children }) => <em className="italic text-[#33415c]">{children}</em>
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {(previousPost || nextPost) && (
          <nav className="post-adjacent-nav my-14 grid grid-cols-1 gap-4 md:grid-cols-2" aria-label="Navigation entre articles">
            {previousPost ? (
              <Link
                to={`/blog/${previousPost.slug}`}
                className="post-adjacent-card group overflow-hidden rounded-xl border border-secondary/10 bg-white/85 text-left shadow-lg shadow-secondary/5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
              >
                {previousPost.featured_image_url ? (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={previousPost.featured_image_url}
                      alt={previousPost.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-primary/10" />
                )}
                <div className="p-6">
                  <span className="mb-4 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-primary">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Article précédent
                  </span>
                  <h3 className="mb-3 text-2xl font-black leading-tight text-secondary">
                    {previousPost.title}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-tertiary">
                    {previousPost.excerpt}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="hidden md:block" />
            )}

            {nextPost ? (
              <Link
                to={`/blog/${nextPost.slug}`}
                className="post-adjacent-card group overflow-hidden rounded-xl border border-secondary/10 bg-white/85 text-left shadow-lg shadow-secondary/5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 md:text-right"
              >
                {nextPost.featured_image_url ? (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={nextPost.featured_image_url}
                      alt={nextPost.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-primary/10" />
                )}
                <div className="p-6">
                  <span className="mb-4 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-primary md:justify-end">
                    Article suivant
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <h3 className="mb-3 text-2xl font-black leading-tight text-secondary">
                    {nextPost.title}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-tertiary">
                    {nextPost.excerpt}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="hidden md:block" />
            )}
          </nav>
        )}

        {/* CTA Section */}
        <div className="post-cta relative my-16 overflow-hidden rounded-xl bg-gradient-to-br from-secondary via-[#182640] to-[#0f1728] p-8 text-center text-white shadow-2xl shadow-secondary/20 md:p-12">
          {/* Background decoration */}
          <div className="post-cta-orbit absolute top-4 right-4 w-20 h-20 rounded-full border border-primary/25">
            <div className="absolute -left-1 top-6 h-2.5 w-2.5 rounded-full bg-primary" />
          </div>
          <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-primary/10"></div>
          
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
                <div className="post-cta-stat flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span>+300% de mandats</span>
                </div>
                <div className="post-cta-stat flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span>Automatisation complète</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="https://app.getflaire.fr"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-extrabold text-secondary transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ff9f1f] group"
              >
                Essayer gratuitement
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a 
                href="https://getflaire.fr"
                className="rounded-xl border border-white px-8 py-4 font-extrabold text-white transition-all duration-200 hover:bg-white hover:text-secondary"
              >
                Découvrir GetFlaire
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-secondary/10">
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
