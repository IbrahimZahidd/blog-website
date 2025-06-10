"use client";

import { useBlog } from "@/context/blog-context";
import type { BlogPost } from "@/types";
import BlogPostCard from "@/components/blog/blog-post-card";

interface RelatedPostsProps {
  currentPost: BlogPost;
}

export default function RelatedPosts({ currentPost }: RelatedPostsProps) {
  const { getPublishedPosts } = useBlog();

  const getRelatedPosts = () => {
    const allPosts = getPublishedPosts().filter(
      (post) => post.id !== currentPost.id
    );

    // Find posts with similar tags
    const relatedPosts = allPosts.filter((post) =>
      post.tags.some((tag) => currentPost.tags.includes(tag))
    );

    // If we have related posts, return them, otherwise return recent posts
    const postsToShow = relatedPosts.length > 0 ? relatedPosts : allPosts;

    return postsToShow.slice(0, 3);
  };

  const relatedPosts = getRelatedPosts();

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Related Posts
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
