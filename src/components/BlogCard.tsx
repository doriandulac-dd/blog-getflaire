import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, Clock3 } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { formatDate } from '../utils/dateUtils';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const estimateReadingTime = (content: string) => Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 220));

export const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  const category = post.categories?.[0];
  const articleUrl = `/blog/${post.slug}`;

  if (featured) {
    return (
      <article className="editorial-card group grid overflow-hidden lg:grid-cols-[1.12fr_0.88fr]" data-blog-card>
        <Link to={articleUrl} className="block min-h-[300px] overflow-hidden bg-background lg:min-h-[470px]">
          {post.featured_image_url ? (
            <img src={post.featured_image_url} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
          ) : <div className="dark-grid h-full w-full" />}
        </Link>
        <div className="flex flex-col justify-between p-7 md:p-10 lg:p-12">
          <div>
            <div className="flex items-center justify-between gap-4">
              <span className="bg-secondary px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white">À la une</span>
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#9B681E]">{category?.name || 'Blog'}</span>
            </div>
            <h2 className="mt-10 text-3xl font-extrabold leading-[1.02] text-secondary md:text-5xl">{post.title}</h2>
            <p className="mt-6 line-clamp-4 text-base leading-7 text-tertiary">{post.excerpt}</p>
          </div>
          <div className="mt-10">
            <div className="flex flex-wrap gap-5 border-t border-secondary/10 pt-5 text-xs font-medium text-tertiary">
              <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#9B681E]" />{formatDate(post.published_at)}</span>
              <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#9B681E]" />{estimateReadingTime(post.content)} min</span>
            </div>
            <Link to={articleUrl} className="text-link mt-7">Lire l’article <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col border-b border-[var(--flaire-line)] bg-white px-0 pb-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0" data-blog-card>
      <Link to={articleUrl} className="relative block aspect-[4/3] overflow-hidden bg-background">
        {post.featured_image_url ? <img src={post.featured_image_url} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" /> : <div className="dark-grid h-full w-full" />}
        <span className="absolute left-4 top-4 bg-secondary px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white">{category?.name || 'Blog'}</span>
      </Link>
      <div className="flex flex-1 flex-col pt-5">
        <div className="flex flex-wrap gap-4 text-xs font-medium text-tertiary">
          <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" />{formatDate(post.published_at)}</span>
          <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4" />{estimateReadingTime(post.content)} min</span>
        </div>
        <h2 className="mt-5 text-xl font-extrabold leading-tight text-secondary md:text-2xl"><Link to={articleUrl} className="transition-colors group-hover:text-[#9B681E]">{post.title}</Link></h2>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-tertiary">{post.excerpt}</p>
        <Link to={articleUrl} className="text-link mt-6 self-start">Lire l’article <ArrowUpRight className="h-4 w-4" /></Link>
      </div>
    </article>
  );
};
