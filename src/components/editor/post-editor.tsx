"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useBlog } from "@/context/blog-context";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/editor/rich-text-editor";
import { Save, Eye, Globe, FileText, ImageIcon, Tag } from "lucide-react";
import type { BlogPost } from "@/types";

interface PostEditorProps {
  postId?: string;
}

export default function PostEditor({ postId }: PostEditorProps) {
  const { user } = useAuth();
  const { createPost, updatePost, getPost, loading } = useBlog();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    tags: "",
    featuredImage: "",
    status: "draft" as "draft" | "published",
  });

  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [existingPost, setExistingPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (postId) {
      loadPost();
    }
  }, [postId]);

  const loadPost = async () => {
    if (!postId) return;

    try {
      const post = await getPost(postId);
      if (post && post.authorId === user?.id) {
        setExistingPost(post);
        setFormData({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          tags: post.tags.join(", "),
          featuredImage: post.featuredImage || "",
          status: post.status,
        });
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to load post:", error);
      router.push("/dashboard");
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const generateExcerpt = (content: string) => {
    // Remove HTML tags and get first 150 characters
    const textContent = content.replace(/<[^>]*>/g, "");
    return textContent.length > 150
      ? textContent.substring(0, 150) + "..."
      : textContent;
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, "");
    const wordCount = textContent.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in the title and content");
      return;
    }

    setIsSaving(true);

    try {
      const postData = {
        title: formData.title.trim(),
        content: formData.content,
        excerpt: formData.excerpt || generateExcerpt(formData.content),
        slug: generateSlug(formData.title),
        authorId: user?.id || "",
        status,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        featuredImage:
          formData.featuredImage ||
          `https://picsum.photos/800/400?random=${Date.now()}`,
        readTime: calculateReadTime(formData.content),
      };

      if (existingPost) {
        await updatePost(existingPost.id, postData);
      } else {
        await createPost(postData);
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save post:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {existingPost ? "Edit Post" : "Create New Post"}
            </h1>
            <p className="text-gray-600 mt-2">
              {existingPost
                ? "Update your blog post"
                : "Share your thoughts with the world"}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`btn-outline flex items-center space-x-2 ${
                isPreview ? "bg-gray-100" : ""
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{isPreview ? "Edit" : "Preview"}</span>
            </button>

            <button
              onClick={() => handleSave("draft")}
              disabled={isSaving}
              className="btn-outline flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </button>

            <button
              onClick={() => handleSave("published")}
              disabled={isSaving}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              <Globe className="w-4 h-4" />
              <span>{isSaving ? "Publishing..." : "Publish"}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            <div className="card p-6">
              {!isPreview ? (
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <input
                      type="text"
                      placeholder="Enter your post title..."
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      className="w-full text-3xl font-bold border-none outline-none placeholder-gray-400 resize-none"
                    />
                  </div>

                  {/* Content Editor */}
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content: string) =>
                      handleInputChange("content", content)
                    }
                  />
                </div>
              ) : (
                <div className="prose-content">
                  <h1 className="text-3xl font-bold mb-6">
                    {formData.title || "Untitled Post"}
                  </h1>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formData.content || "<p>No content yet...</p>",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Post Settings */}
            <div className="card p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Post Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="input-field text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Excerpt
                  </label>
                  <textarea
                    placeholder="Brief description of your post..."
                    value={formData.excerpt}
                    onChange={(e) =>
                      handleInputChange("excerpt", e.target.value)
                    }
                    className="input-field text-sm h-20 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="card p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" />
                Featured Image
              </h3>

              <div>
                <input
                  type="url"
                  placeholder="Image URL..."
                  value={formData.featuredImage}
                  onChange={(e) =>
                    handleInputChange("featuredImage", e.target.value)
                  }
                  className="input-field text-sm"
                />
                {formData.featuredImage && (
                  <div className="mt-2">
                    <img
                      src={formData.featuredImage || "/placeholder.svg"}
                      alt="Featured"
                      className="w-full h-24 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src =
                          "/placeholder.svg?height=100&width=200";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="card p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Tags
              </h3>

              <div>
                <input
                  type="text"
                  placeholder="Enter tags separated by commas..."
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  className="input-field text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate tags with commas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
