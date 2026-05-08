import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock3, User } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { formatDate } from '../utils/dateUtils';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  return (
    <article className={`blog-card group rounded-xl ${featured ? 'lg:grid lg:grid-cols-[1.08fr_0.92fr]' : ''}`} data-blog-card>
      {post.featured_image_url && (
        <Link to={`/blog/${post.slug}`} className={`block overflow-hidden ${featured ? 'min-h-full' : 'aspect-video'}`}>
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      )}
      
      <div className={`relative z-10 flex h-full flex-col ${featured ? 'p-7 md:p-10' : 'p-6'}`}>
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.map((category) => (
              <span
                key={category.id}
                className="rounded-full bg-primary/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-secondary"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        <h2 className={`${featured ? 'text-3xl md:text-4xl' : 'text-xl'} mb-3 font-black leading-tight text-secondary`}>
          <Link to={`/blog/${post.slug}`} className="animated-underline">
            {post.title}
          </Link>
        </h2>

        <p className={`${featured ? 'text-base md:text-lg' : 'text-sm'} mb-5 line-clamp-3 leading-relaxed text-tertiary`}>
          {post.excerpt}
        </p>

        <div className="mb-5 flex flex-wrap items-center gap-3 text-sm font-bold text-tertiary">
            {post.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author.name}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.published_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock3 className="w-4 h-4" />
              <span>Lecture rapide</span>
            </div>
        </div>

        <Link
          to={`/blog/${post.slug}`}
          className="mt-auto inline-flex items-center gap-2 font-extrabold text-primary transition-colors hover:text-[#ff930f]"
        >
          Lire la suite
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
};
