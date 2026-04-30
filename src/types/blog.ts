export interface Author {
  id: string;
  created_at: string;
  name: string;
  bio: string;
  avatar_url: string;
}

export interface Category {
  id: string;
  created_at: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  created_at: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author_id: string;
  published_at: string;
  featured_image_url: string;
  is_published: boolean;
  author?: Author;
  categories?: Category[];
}

export interface PostCategory {
  post_id: string;
  category_id: string;
}