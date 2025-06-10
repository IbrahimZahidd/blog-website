"use client";

import { useBlog } from "@/context/blog-context";
import BlogPostCard from "@/components/blog/blog-post-card";

export default function FeaturedPosts() {
  const { getPublishedPosts } = useBlog();
  const posts = getPublishedPosts().slice(0, 3);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section id="featured" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Posts
          </h2>
          <p className="text-lg text-gray-600">
            Discover the most popular and engaging stories from our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} featured />
          ))}
        </div>
      </div>
    </section>
  );
}
