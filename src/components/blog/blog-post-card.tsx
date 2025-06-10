import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/types";
import { Calendar, Clock, User } from "lucide-react";

interface BlogPostCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogPostCard({
  post,
  featured = false,
}: BlogPostCardProps) {
  const cardClass = featured
    ? "card hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full"
    : "card hover:shadow-md transition-shadow duration-300 overflow-hidden h-full";

  return (
    <article className={cardClass}>
      <Link href={`/post/${post.slug}`}>
        <div className="relative h-48 bg-gray-200">
          <Image
            src={post.featuredImage || "/placeholder.svg?height=200&width=400"}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{post.author.name}</span>
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

          <h3
            className={`font-bold text-gray-900 mb-2 line-clamp-2 ${
              featured ? "text-xl" : "text-lg"
            }`}
          >
            {post.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
