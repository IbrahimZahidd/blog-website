"use client";

import { useBlog } from "@/context/blog-context";
import BlogPostCard from "@/components/blog/blog-post-card";
import Link from "next/link";

export default function RecentPosts() {
  const { getPublishedPosts } = useBlog();
  const posts = getPublishedPosts().slice(0, 6);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Recent Posts
            </h2>
            <p className="text-lg text-gray-600">
              Latest stories from our writers
            </p>
          </div>
          <Link href="/posts" className="btn-outline">
            View All Posts
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts available yet.</p>
            <Link href="/register" className="btn-primary mt-4">
              Be the first to write!
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
