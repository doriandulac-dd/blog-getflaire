import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock3,
  Share2,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react';
import { BlogPost as BlogPostType } from '../types/blog';
import { BlogService } from '../services/blogService';
import { formatDate } from '../utils/dateUtils';
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '../lib/gsap';

const BLOG_URL = 'https://blog.getflaire.fr';
const DEFAULT_TITLE = 'Le blog GetFlaire — Pige immobilière et prospection';
const DEFAULT_DESCRIPTION =
  'Conseils terrain, méthodes et analyses pour aider les professionnels de l’immobilier à mieux prospecter.';

const setMeta = (selector: string, attribute: 'name' | 'property', value: string, content: string) => {
  let meta = document.head.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, value);
    document.head.appendChild(meta);
  }
  meta.content = content;
};

export const BlogPost: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [previousPost, setPreviousPost] = useState<BlogPostType | null>(null);
  const [nextPost, setNextPost] = useState<BlogPostType | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const readingTime = useMemo(() => {
    if (!post) return 0;
    return Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 220));
  }, [post]);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        setPost(null);
        setPreviousPost(null);
        setNextPost(null);
        setReadingProgress(0);

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
          console.error('Erreur lors du chargement des articles voisins :', adjacentError);
        }
      } catch (fetchError) {
        setError('Erreur lors du chargement de l’article');
        console.error(fetchError);
      } finally {
        setLoading(false);
      }
    };

    void fetchPost();
  }, [slug]);

  useEffect(() => {
    if (!post) return;

    const canonicalUrl = `${BLOG_URL}/blog/${post.slug}`;
    document.title = `${post.title} — Le blog GetFlaire`;
    setMeta('meta[name="description"]', 'name', 'description', post.excerpt);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'article');
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[property="og:title"]', 'property', 'og:title', post.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', post.excerpt);
    setMeta('meta[name="twitter:url"]', 'name', 'twitter:url', canonicalUrl);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', post.title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', post.excerpt);

    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    canonical?.setAttribute('href', canonicalUrl);

    const imageUrl = post.featured_image_url?.trim();
    const ogImage = document.head.querySelector<HTMLMetaElement>('meta[property="og:image"]');
    const twitterImage = document.head.querySelector<HTMLMetaElement>('meta[name="twitter:image"]');
    if (imageUrl) {
      setMeta('meta[property="og:image"]', 'property', 'og:image', imageUrl);
      setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl);
    } else {
      ogImage?.remove();
      twitterImage?.remove();
    }

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('meta[name="description"]', 'name', 'description', DEFAULT_DESCRIPTION);
      setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
      setMeta('meta[property="og:url"]', 'property', 'og:url', `${BLOG_URL}/`);
      setMeta('meta[property="og:title"]', 'property', 'og:title', DEFAULT_TITLE);
      setMeta('meta[property="og:description"]', 'property', 'og:description', DEFAULT_DESCRIPTION);
      setMeta('meta[property="og:image"]', 'property', 'og:image', `${BLOG_URL}/og-getflaire-blog.png`);
      setMeta('meta[name="twitter:url"]', 'name', 'twitter:url', `${BLOG_URL}/`);
      setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', DEFAULT_TITLE);
      setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', DEFAULT_DESCRIPTION);
      setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', `${BLOG_URL}/og-getflaire-blog.png`);
      canonical?.setAttribute('href', `${BLOG_URL}/`);
    };
  }, [post]);

  useGSAP(
    () => {
      if (!post || loading || !articleRef.current) return;

      gsap.set('.reading-progress', { scaleX: 0, transformOrigin: 'left center' });
      ScrollTrigger.create({
        trigger: articleRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: ({ progress }) => {
          gsap.set('.reading-progress', { scaleX: progress });
          setReadingProgress(Math.round(progress * 100));
        },
      });

      if (prefersReducedMotion()) return;

      gsap
        .timeline({ defaults: { duration: 0.5, ease: 'power2.out' } })
        .from('.post-intro', { y: 18, autoAlpha: 0, stagger: 0.07 })
        .from('.post-hero', { y: 22, autoAlpha: 0 }, '-=0.2');

      ScrollTrigger.batch('.markdown-reveal, .post-adjacent-card, .post-cta > *', {
        start: 'top 90%',
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { y: 18, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.48, stagger: 0.06, ease: 'power2.out', overwrite: true },
          ),
      });
    },
    { scope: pageRef, dependencies: [post?.id, loading], revertOnUpdate: true },
  );

  const sharePost = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    if (!post) return;

    const url = `${BLOG_URL}/blog/${post.slug}`;
    const text = `${post.title} — ${post.excerpt}`;
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    window.open(shareUrls[platform], '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28">
        <div className="site-container animate-pulse py-16">
          <div className="mb-6 h-4 w-32 rounded-sm bg-slate-200" />
          <div className="mb-4 h-12 max-w-3xl rounded-sm bg-slate-200" />
          <div className="mb-12 h-12 max-w-xl rounded-sm bg-slate-200" />
          <div className="aspect-[16/8] rounded-md bg-slate-200" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <section className="dark-grid min-h-[70vh] bg-secondary pt-32 text-white">
        <div className="site-container py-20 text-center">
          <p className="eyebrow mb-5 text-primary">Le blog GetFlaire</p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl">{error || 'Article non trouvé'}</h1>
          <p className="mx-auto mb-8 max-w-xl text-white/65">
            L’article que vous recherchez n’existe pas ou n’est plus disponible.
          </p>
          <Link to="/blog" className="button-primary">
            <ArrowLeft className="h-4 w-4" /> Retour au blog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-white">
      <div className="fixed left-0 top-[72px] z-40 h-0.5 w-full bg-white/15">
        <div className="reading-progress h-full w-full origin-left scale-x-0 bg-primary" />
      </div>

      <article ref={articleRef}>
        <header className="dark-grid bg-secondary pt-32 text-white">
          <div className="site-container py-12 md:py-20">
            <Link to="/blog" className="post-intro text-link mb-10 inline-flex items-center gap-2 text-sm text-white/70">
              <ArrowLeft className="h-4 w-4" /> Retour au blog
            </Link>

            {post.categories && post.categories.length > 0 && (
              <div className="post-intro mb-5 flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <span key={category.id} className="border border-primary/60 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            <h1 className="post-intro max-w-5xl text-4xl font-extrabold leading-[1.04] tracking-[-0.045em] sm:text-5xl md:text-7xl">
              {post.title}
            </h1>

            <div className="post-intro mt-9 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-white/15 pt-6 text-sm text-white/65">
              {post.author && (
                <div className="flex items-center gap-3">
                  {post.author.avatar_url ? (
                    <img src={post.author.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="font-semibold text-white">{post.author.name}</span>
                </div>
              )}
              <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4" />{formatDate(post.published_at)}</span>
              <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4" />{readingTime} min de lecture</span>
              <span className="ml-auto hidden font-semibold text-primary sm:inline">{readingProgress}% lu</span>
            </div>

            <div className="post-intro mt-6 flex items-center gap-2" aria-label="Partager cet article">
              <span className="mr-2 text-xs font-bold uppercase tracking-[0.14em] text-white/50">Partager</span>
              {(['twitter', 'linkedin', 'facebook'] as const).map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => sharePost(platform)}
                  className="inline-flex h-10 items-center gap-2 border border-white/20 px-3 text-xs font-semibold capitalize text-white transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                  aria-label={`Partager sur ${platform}`}
                >
                  <Share2 className="h-3.5 w-3.5" /> {platform === 'twitter' ? 'X' : platform}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="site-container">
          {post.featured_image_url && (
            <figure className="post-hero -mt-px border-x border-b border-[var(--flaire-line)] bg-white p-2 md:p-3">
              <img src={post.featured_image_url} alt={post.title} className="aspect-[16/8] w-full rounded-md object-cover" />
            </figure>
          )}

          <div className="mx-auto max-w-[780px] py-14 md:py-20">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="markdown-reveal mb-5 mt-12 text-3xl font-extrabold tracking-tight text-secondary">{children}</h1>,
                h2: ({ children }) => <h2 className="markdown-reveal mb-4 mt-12 text-3xl font-extrabold tracking-tight text-secondary md:text-4xl">{children}</h2>,
                h3: ({ children }) => <h3 className="markdown-reveal mb-3 mt-9 text-2xl font-bold text-secondary">{children}</h3>,
                p: ({ children }) => <p className="markdown-reveal mb-6 text-[1.075rem] leading-8 text-slate-700">{children}</p>,
                ul: ({ children }) => <ul className="markdown-reveal mb-7 list-disc space-y-2 pl-6 text-[1.075rem] leading-8 text-slate-700 marker:text-primary">{children}</ul>,
                ol: ({ children }) => <ol className="markdown-reveal mb-7 list-decimal space-y-2 pl-6 text-[1.075rem] leading-8 text-slate-700 marker:font-bold marker:text-primary">{children}</ol>,
                blockquote: ({ children }) => <blockquote className="markdown-reveal my-10 border-l-4 border-primary bg-[#FFF8EC] px-6 py-5 text-lg italic leading-8 text-secondary">{children}</blockquote>,
                a: ({ href, children }) => <a href={href} className="font-semibold text-secondary underline decoration-primary decoration-2 underline-offset-4 hover:text-primary">{children}</a>,
                code: ({ children, className }) => className ? (
                  <code className="markdown-reveal my-8 block overflow-x-auto rounded-md bg-secondary p-5 font-mono text-sm text-slate-100">{children}</code>
                ) : (
                  <code className="rounded-sm bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-secondary">{children}</code>
                ),
                img: ({ src, alt }) => <img src={src} alt={alt || ''} className="markdown-reveal my-10 w-full rounded-md border border-[var(--flaire-line)]" loading="lazy" />,
                strong: ({ children }) => <strong className="font-bold text-secondary">{children}</strong>,
                hr: () => <hr className="markdown-reveal my-12 border-[var(--flaire-line)]" />,
                table: ({ children }) => <div className="markdown-reveal my-8 overflow-x-auto"><table className="w-full border-collapse text-left text-sm">{children}</table></div>,
                th: ({ children }) => <th className="border border-[var(--flaire-line)] bg-slate-50 p-3 font-bold text-secondary">{children}</th>,
                td: ({ children }) => <td className="border border-[var(--flaire-line)] p-3 text-slate-700">{children}</td>,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </article>

      {(previousPost || nextPost) && (
        <nav className="site-container grid border-y border-[var(--flaire-line)] md:grid-cols-2" aria-label="Navigation entre articles">
          {previousPost ? (
            <Link to={`/blog/${previousPost.slug}`} className="post-adjacent-card group border-b border-[var(--flaire-line)] py-8 md:border-b-0 md:border-r md:pr-10">
              <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-tertiary"><ArrowLeft className="h-4 w-4" /> Article précédent</span>
              <h2 className="text-xl font-bold leading-tight text-secondary transition-colors group-hover:text-primary md:text-2xl">{previousPost.title}</h2>
            </Link>
          ) : <div />}
          {nextPost ? (
            <Link to={`/blog/${nextPost.slug}`} className="post-adjacent-card group py-8 md:pl-10 md:text-right">
              <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-tertiary">Article suivant <ArrowRight className="h-4 w-4" /></span>
              <h2 className="text-xl font-bold leading-tight text-secondary transition-colors group-hover:text-primary md:text-2xl">{nextPost.title}</h2>
            </Link>
          ) : <div />}
        </nav>
      )}

      <section className="site-container py-16 md:py-24">
        <div className="post-cta gold-grid rounded-md border border-primary/70 bg-primary p-7 text-secondary md:p-12">
          <div className="max-w-4xl">
            <p className="eyebrow mb-5">Passez de la lecture à l’action</p>
            <h2 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.035em] md:text-5xl">Prêt à transformer votre prospection immobilière ?</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-secondary/75 md:text-lg">GetFlaire vous aide à gagner du temps et à signer plus de mandats grâce à une pige immobilière structurée et intelligente.</p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
              <span className="inline-flex items-center gap-2"><TrendingUp className="h-5 w-5" /> +300 % de mandats</span>
              <span className="inline-flex items-center gap-2"><Zap className="h-5 w-5" /> Automatisation complète</span>
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="https://app.getflaire.fr" className="button-secondary">Essayer gratuitement <ArrowRight className="h-4 w-4" /></a>
              <a href="https://getflaire.fr" className="inline-flex min-h-12 items-center justify-center border border-secondary px-6 text-sm font-bold transition hover:bg-secondary hover:text-white">Découvrir GetFlaire</a>
            </div>
          </div>
        </div>
        <Link to="/blog" className="text-link mt-10 inline-flex items-center gap-2 text-sm font-semibold text-secondary"><ArrowLeft className="h-4 w-4" /> Retour à tous les articles</Link>
      </section>
    </div>
  );
};
