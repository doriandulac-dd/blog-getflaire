import { supabase } from '../lib/supabase';
import { Author, BlogPost, Category } from '../types/blog';

type BlogPostRow = Omit<BlogPost, 'author' | 'categories'> & {
  authors: Author | null;
  categories: Array<{ category: Category | null }> | null;
};

export interface AdjacentPosts {
  previousPost: BlogPost | null;
  nextPost: BlogPost | null;
}

const blogPostSelect = `
  *,
  authors(*),
  categories:post_categories(
    category:categories(*)
  )
`;

const mapPost = (post: BlogPostRow): BlogPost => ({
  ...post,
  author: post.authors || undefined,
  categories: post.categories?.map((pc) => pc.category).filter((category): category is Category => Boolean(category)) || []
});

export class BlogService {
  static async getAllPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(blogPostSelect)
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      throw error;
    }

    return (data as BlogPostRow[] | null)?.map(mapPost) || [];
  }

  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(blogPostSelect)
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Post not found
      }
      console.error('Erreur lors de la récupération de l\'article:', error);
      throw error;
    }

    if (!data) return null;

    return mapPost(data as BlogPostRow);
  }

  static async getLatestPosts(limit: number = 3): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(blogPostSelect)
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erreur lors de la récupération des derniers articles:', error);
      throw error;
    }

    return (data as BlogPostRow[] | null)?.map(mapPost) || [];
  }

  static async getAdjacentPosts(currentPublishedAt: string, currentId: string): Promise<AdjacentPosts> {
    const [previousResult, nextResult] = await Promise.all([
      supabase
        .from('blog_posts')
        .select(blogPostSelect)
        .eq('is_published', true)
        .neq('id', currentId)
        .gt('published_at', currentPublishedAt)
        .order('published_at', { ascending: true })
        .limit(1),
      supabase
        .from('blog_posts')
        .select(blogPostSelect)
        .eq('is_published', true)
        .neq('id', currentId)
        .lt('published_at', currentPublishedAt)
        .order('published_at', { ascending: false })
        .limit(1),
    ]);

    if (previousResult.error) {
      console.error('Erreur lors de la récupération de l\'article précédent:', previousResult.error);
      throw previousResult.error;
    }

    if (nextResult.error) {
      console.error('Erreur lors de la récupération de l\'article suivant:', nextResult.error);
      throw nextResult.error;
    }

    const previousPost = (previousResult.data as BlogPostRow[] | null)?.[0];
    const nextPost = (nextResult.data as BlogPostRow[] | null)?.[0];

    return {
      previousPost: previousPost ? mapPost(previousPost) : null,
      nextPost: nextPost ? mapPost(nextPost) : null,
    };
  }
}
