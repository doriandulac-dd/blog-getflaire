import { supabase } from '../lib/supabase';
import { BlogPost } from '../types/blog';

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

    return data?.map(post => ({
      ...post,
      author: post.authors,
      categories: post.categories?.map((pc: any) => pc.category) || []
    })) || [];
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

    return {
      ...data,
      author: data.authors,
      categories: data.categories?.map((pc: any) => pc.category) || []
    };
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

    return data?.map(post => ({
      ...post,
      author: post.authors,
      categories: post.categories?.map((pc: any) => pc.category) || []
    })) || [];
  }
}