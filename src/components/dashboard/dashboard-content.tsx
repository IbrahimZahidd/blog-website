"use client";

import { useAuth } from "@/context/auth-context";
import { useBlog } from "@/context/blog-context";
import Link from "next/link";
import {
  PenTool,
  FileText,
  Eye,
  Calendar,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export default function DashboardContent() {
  const { user } = useAuth();
  const { getUserPosts, deletePost } = useBlog();
  const [activeTab, setActiveTab] = useState<"all" | "published" | "drafts">(
    "all"
  );

  const userPosts = getUserPosts(user?.id || "");
  const publishedPosts = userPosts.filter(
    (post) => post.status === "published"
  );
  const draftPosts = userPosts.filter((post) => post.status === "draft");

  const getFilteredPosts = () => {
    switch (activeTab) {
      case "published":
        return publishedPosts;
      case "drafts":
        return draftPosts;
      default:
        return userPosts;
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postId);
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  const stats = [
    {
      name: "Total Posts",
      value: userPosts.length,
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      name: "Published",
      value: publishedPosts.length,
      icon: Eye,
      color: "bg-green-500",
    },
    {
      name: "Drafts",
      value: draftPosts.length,
      icon: Edit,
      color: "bg-yellow-500",
    },
    {
      name: "This Month",
      value: userPosts.filter((post) => {
        const postDate = new Date(post.createdAt);
        const now = new Date();
        return (
          postDate.getMonth() === now.getMonth() &&
          postDate.getFullYear() === now.getFullYear()
        );
      }).length,
      icon: Calendar,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/editor"
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Post</span>
            </Link>
            <Link
              href="/profile"
              className="btn-outline flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </Link>
            <Link
              href="/posts"
              className="btn-outline flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>View All Posts</span>
            </Link>
          </div>
        </div>

        {/* Posts Management */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Posts
            </h2>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {[
                { key: "all", label: "All Posts" },
                { key: "published", label: "Published" },
                { key: "drafts", label: "Drafts" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {getFilteredPosts().length === 0 ? (
              <div className="text-center py-12">
                <PenTool className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start writing your first blog post!
                </p>
                <Link href="/editor" className="btn-primary">
                  Create Your First Post
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {getFilteredPosts().map((post) => (
                  <div
                    key={post.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              post.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {post.status}
                          </span>
                          <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          <span>{post.readTime} min read</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {post.status === "published" && (
                          <Link
                            href={`/post/${post.slug}`}
                            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                            title="View post"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href={`/editor/${post.id}`}
                          className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                          title="Edit post"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
