"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import type { BlogPost, BlogContextType } from "@/types";
import { useAuth } from "./auth-context";
import { useToast } from "./toast-context";

const BlogContext = createContext<BlogContextType | undefined>(undefined);

// Sample blog posts for initial data
const samplePosts: Omit<BlogPost, "author">[] = [
  {
    id: "1",
    title: "Getting Started with Next.js 15",
    content: `<h2>Introduction to Next.js 15</h2>
    <p>Next.js 15 brings exciting new features and improvements that make building React applications even more powerful and efficient. In this comprehensive guide, we'll explore the key features and how to get started.</p>
    
    <h3>Key Features</h3>
    <ul>
      <li>Improved App Router with better performance</li>
      <li>Enhanced Server Components</li>
      <li>Better TypeScript support</li>
      <li>Optimized bundling with Turbopack</li>
    </ul>
    
    <h3>Getting Started</h3>
    <p>To create a new Next.js 15 project, run the following command:</p>
    <pre><code>npx create-next-app@latest my-app</code></pre>
    
    <p>This will set up a new project with all the latest features and best practices built in.</p>`,
    excerpt:
      "Learn the basics of Next.js 15 and how to build modern React applications with the latest features.",
    slug: "getting-started-nextjs-15",
    authorId: "demo-user",
    status: "published",
    tags: ["nextjs", "react", "web-development"],
    featuredImage: "https://picsum.photos/800/400?random=1",
    readTime: 5,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    publishedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "The Art of Modern Web Design",
    content: `<h2>Creating Beautiful User Experiences</h2>
    <p>Modern web design is about more than just making things look pretty. It's about creating intuitive, accessible, and engaging experiences that delight users and achieve business goals.</p>
    
    <h3>Design Principles</h3>
    <p>Great web design follows several key principles:</p>
    <ul>
      <li><strong>Simplicity:</strong> Clean, uncluttered layouts that focus on content</li>
      <li><strong>Consistency:</strong> Uniform design patterns throughout the site</li>
      <li><strong>Accessibility:</strong> Ensuring everyone can use your website</li>
      <li><strong>Performance:</strong> Fast loading times and smooth interactions</li>
    </ul>
    
    <h3>Current Trends</h3>
    <p>Some popular trends in modern web design include:</p>
    <ul>
      <li>Minimalist layouts with plenty of white space</li>
      <li>Bold typography and custom fonts</li>
      <li>Micro-interactions and subtle animations</li>
      <li>Dark mode support</li>
    </ul>`,
    excerpt:
      "Explore the principles and trends that define modern web design and user experience.",
    slug: "art-of-modern-web-design",
    authorId: "demo-user",
    status: "published",
    tags: ["design", "ux", "web-development"],
    featuredImage: "https://picsum.photos/800/400?random=2",
    readTime: 7,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    publishedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    title: "Building Scalable React Applications",
    content: `<h2>Architecture for Growth</h2>
    <p>As your React application grows, maintaining clean, scalable code becomes increasingly important. This guide covers best practices for building applications that can scale with your team and user base.</p>
    
    <h3>Component Architecture</h3>
    <p>A well-structured component hierarchy is the foundation of a scalable React app:</p>
    <ul>
      <li>Keep components small and focused</li>
      <li>Use composition over inheritance</li>
      <li>Implement proper prop drilling solutions</li>
      <li>Create reusable UI components</li>
    </ul>
    
    <h3>State Management</h3>
    <p>Choose the right state management solution for your needs:</p>
    <ul>
      <li>Local state for component-specific data</li>
      <li>Context API for app-wide state</li>
      <li>External libraries for complex state logic</li>
    </ul>`,
    excerpt:
      "Learn how to architect React applications that can grow and scale with your needs.",
    slug: "building-scalable-react-applications",
    authorId: "demo-user",
    status: "published",
    tags: ["react", "architecture", "scalability"],
    featuredImage: "https://picsum.photos/800/400?random=3",
    readTime: 8,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
    publishedAt: new Date("2024-01-05"),
  },
];

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    // Initialize with sample posts if no posts exist
    const storedPosts = localStorage.getItem("blogspace_posts");
    if (storedPosts) {
      try {
        setPosts(JSON.parse(storedPosts));
      } catch (error) {
        console.error("Failed to parse stored posts:", error);
        initializeSamplePosts();
      }
    } else {
      initializeSamplePosts();
    }
  }, []);

  const initializeSamplePosts = () => {
    const demoUser = {
      id: "demo-user",
      name: "Demo Author",
      email: "demo@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
      bio: "A passionate writer and developer",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const postsWithAuthor = samplePosts.map((post) => ({
      ...post,
      author: demoUser,
    }));

    setPosts(postsWithAuthor);
    localStorage.setItem("blogspace_posts", JSON.stringify(postsWithAuthor));
  };

  const createPost = async (
    postData: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "author">
  ) => {
    if (!user) throw new Error("User must be authenticated");

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      const newPost: BlogPost = {
        ...postData,
        id: Date.now().toString(),
        author: user,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: postData.status === "published" ? new Date() : undefined,
      };

      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      localStorage.setItem("blogspace_posts", JSON.stringify(updatedPosts));

      addToast(
        `Post ${
          postData.status === "published" ? "published" : "saved as draft"
        }!`,
        "success"
      );
    } catch (error) {
      addToast("Failed to create post", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (id: string, postData: Partial<BlogPost>) => {
    if (!user) throw new Error("User must be authenticated");

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      const updatedPosts = posts.map((post) => {
        if (post.id === id && post.authorId === user.id) {
          const updatedPost = {
            ...post,
            ...postData,
            updatedAt: new Date(),
            publishedAt:
              postData.status === "published" && !post.publishedAt
                ? new Date()
                : post.publishedAt,
          };
          return updatedPost;
        }
        return post;
      });

      setPosts(updatedPosts);
      localStorage.setItem("blogspace_posts", JSON.stringify(updatedPosts));

      addToast("Post updated successfully!", "success");
    } catch (error) {
      addToast("Failed to update post", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!user) throw new Error("User must be authenticated");

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      const updatedPosts = posts.filter(
        (post) => !(post.id === id && post.authorId === user.id)
      );
      setPosts(updatedPosts);
      localStorage.setItem("blogspace_posts", JSON.stringify(updatedPosts));

      addToast("Post deleted successfully!", "success");
    } catch (error) {
      addToast("Failed to delete post", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getPost = async (id: string): Promise<BlogPost | null> => {
    const post = posts.find((p) => p.id === id);
    if (post) {
      setCurrentPost(post);
      return post;
    }
    return null;
  };

  const getUserPosts = (userId: string): BlogPost[] => {
    return posts.filter((post) => post.authorId === userId);
  };

  const getPublishedPosts = (): BlogPost[] => {
    return posts
      .filter((post) => post.status === "published")
      .sort(
        (a, b) =>
          new Date(b.publishedAt || b.createdAt).getTime() -
          new Date(a.publishedAt || a.createdAt).getTime()
      );
  };

  const searchPosts = (query: string): BlogPost[] => {
    const lowercaseQuery = query.toLowerCase();
    return posts.filter(
      (post) =>
        post.status === "published" &&
        (post.title.toLowerCase().includes(lowercaseQuery) ||
          post.excerpt.toLowerCase().includes(lowercaseQuery) ||
          post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)))
    );
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        currentPost,
        loading,
        createPost,
        updatePost,
        deletePost,
        getPost,
        getUserPosts,
        getPublishedPosts,
        searchPosts,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
}
