import { supabase } from '../lib/supabase';
import { Author, BlogPost, Category } from '../types/blog';

type BlogPostRow = BlogPost & {
  authors: Author | null;
  categories?: Array<{ category: Category | null }> | null;
};

const mapPostRow = (post: BlogPostRow): BlogPost => ({
  ...post,
  author: post.authors || undefined,
  categories: post.categories?.map((pc) => pc.category).filter((category): category is Category => Boolean(category)) || []
});

export class BlogService {
  static async getAllPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        authors(*),
        categories:post_categories(
          category:categories(*)
        )
      `)
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      throw error;
    }

    return (data as BlogPostRow[] | null)?.map(mapPostRow) || [];
  }

  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        authors(*),
        categories:post_categories(
          category:categories(*)
        )
      `)
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

    return mapPostRow(data as BlogPostRow);
  }

  static async getLatestPosts(limit: number = 3): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        authors(*),
        categories:post_categories(
          category:categories(*)
        )
      `)
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erreur lors de la récupération des derniers articles:', error);
      throw error;
    }

    return (data as BlogPostRow[] | null)?.map(mapPostRow) || [];
  }
}
