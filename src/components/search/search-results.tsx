"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useBlog } from "@/context/blog-context";
import type { BlogPost } from "@/types";
import BlogPostCard from "@/components/blog/blog-post-card";
import { Search, Filter, X } from "lucide-react";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { searchPosts, getPublishedPosts } = useBlog();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [results, setResults] = useState<BlogPost[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    performSearch();
  }, [query, selectedTag, sortBy, searchPosts, getPublishedPosts]);

  const performSearch = () => {
    let searchResults: BlogPost[] = [];

    if (query) {
      searchResults = searchPosts(query);
    } else {
      searchResults = getPublishedPosts();
    }

    // Filter by tag if selected
    if (selectedTag) {
      searchResults = searchResults.filter((post) =>
        post.tags.some((tag) =>
          tag.toLowerCase().includes(selectedTag.toLowerCase())
        )
      );
    }

    // Sort results
    switch (sortBy) {
      case "oldest":
        searchResults.sort(
          (a, b) =>
            new Date(a.publishedAt || a.createdAt).getTime() -
            new Date(b.publishedAt || b.createdAt).getTime()
        );
        break;
      case "title":
        searchResults.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default: // newest
        searchResults.sort(
          (b, a) =>
            new Date(a.publishedAt || a.createdAt).getTime() -
            new Date(b.publishedAt || b.createdAt).getTime()
        );
    }

    setResults(searchResults);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL();
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedTag) params.set("tag", selectedTag);
    if (sortBy !== "newest") params.set("sort", sortBy);

    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedTag("");
    setSortBy("newest");
    router.push("/search");
  };

  // Get all unique tags from published posts
  const allTags = Array.from(
    new Set(getPublishedPosts().flatMap((post) => post.tags))
  ).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Search Posts
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <button type="submit" className="btn-primary px-6">
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="btn-outline px-4 flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Tag
                  </label>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full input-field"
                  >
                    <option value="">All Tags</option>
                    {allTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full input-field"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title (A-Z)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="btn-outline flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {(query || selectedTag) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {query && (
                <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                  Search: &quot;{query}&quot;
                  <button
                    onClick={() => {
                      setQuery("");
                      updateURL();
                    }}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedTag && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  Tag: {selectedTag}
                  <button
                    onClick={() => {
                      setSelectedTag("");
                      updateURL();
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Results Count */}
          <p className="text-gray-600">
            {results.length} {results.length === 1 ? "post" : "posts"} found
            {query && ` for "${query}"`}
          </p>
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 mb-6">
              {query
                ? `No posts match your search for "${query}"`
                : "Try adjusting your filters or search terms"}
            </p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
