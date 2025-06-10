export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  authorId: string;
  author: User;
  status: "draft" | "published";
  tags: string[];
  featuredImage?: string;
  readTime: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface BlogContextType {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  loading: boolean;
  createPost: (
    post: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "author">
  ) => Promise<void>;
  updatePost: (id: string, post: Partial<BlogPost>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  getPost: (id: string) => Promise<BlogPost | null>;
  getUserPosts: (userId: string) => BlogPost[];
  getPublishedPosts: () => BlogPost[];
  searchPosts: (query: string) => BlogPost[];
}

export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}
