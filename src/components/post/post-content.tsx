"use client";

import { useEffect, useState } from "react";
import { useBlog } from "@/context/blog-context";
import { useAuth } from "@/context/auth-context";
import type { BlogPost } from "@/types";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Tag,
  Edit,
  ArrowLeft,
  Share2,
  Heart,
  MessageCircle,
} from "lucide-react";
import RelatedPosts from "./related-posts";
import CommentsSection from "./comments-section";

interface PostContentProps {
  slug: string;
}

export default function PostContent({ slug }: PostContentProps) {
  const { posts } = useBlog();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const foundPost = posts.find(
      (p) => p.slug === slug && p.status === "published"
    );
    setPost(foundPost || null);
    setLoading(false);

    // Simulate like data from localStorage
    if (foundPost) {
      const likes = JSON.parse(
        localStorage.getItem(`post_likes_${foundPost.id}`) || "[]"
      );
      setLikeCount(likes.length);
      setLiked(user ? likes.includes(user.id) : false);
    }
  }, [slug, posts, user]);

  const handleLike = () => {
    if (!user || !post) return;

    const likesKey = `post_likes_${post.id}`;
    const likes = JSON.parse(localStorage.getItem(likesKey) || "[]");

    if (liked) {
      const newLikes = likes.filter((id: string) => id !== user.id);
      localStorage.setItem(likesKey, JSON.stringify(newLikes));
      setLikeCount(newLikes.length);
      setLiked(false);
    } else {
      const newLikes = [...likes, user.id];
      localStorage.setItem(likesKey, JSON.stringify(newLikes));
      setLikeCount(newLikes.length);
      setLiked(true);
    }
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log(error);
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Post Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The blog post you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-orange-500 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to posts
          </Link>

          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center space-x-2">
                <Image
                  src={
                    post.author.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.name}`
                  }
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <Link
                  href={`/profile/${post.author.id}`}
                  className="hover:text-orange-500"
                >
                  {post.author.name}
                </Link>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(
                    post.publishedAt || post.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?tag=${tag}`}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    liked
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  disabled={!user}
                >
                  <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                  <span>{likeCount}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>

                <a
                  href="#comments"
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Comments</span>
                </a>
              </div>

              {user?.id === post.authorId && (
                <Link
                  href={`/editor/${post.id}`}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <article className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Author Bio */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
          <div className="flex items-start space-x-4">
            <Image
              src={
                post.author.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.name}`
              }
              alt={post.author.name}
              width={64}
              height={64}
              className="rounded-full"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {post.author.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {post.author.bio ||
                  "A passionate writer sharing thoughts and experiences through blogging."}
              </p>
              <Link
                href={`/profile/${post.author.id}`}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                View Profile →
              </Link>
            </div>
          </div>
        </div>

        {/* Comments */}
        <CommentsSection postId={post.id} />

        {/* Related Posts */}
        <RelatedPosts currentPost={post} />
      </div>
    </div>
  );
}
