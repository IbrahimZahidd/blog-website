import Link from "next/link";
import { PenTool, Users, BookOpen } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-orange-50 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Share Your <span className="text-orange-500">Stories</span> with the
            World
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            BlogSpace is a modern platform where writers and readers connect.
            Create beautiful blog posts, discover amazing content, and join a
            community of passionate storytellers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary text-lg px-8 py-3">
              Start Writing
            </Link>
            <Link href="#featured" className="btn-outline text-lg px-8 py-3">
              Explore Posts
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PenTool className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Easy Writing
            </h3>
            <p className="text-gray-600">
              Intuitive editor with rich formatting options to bring your ideas
              to life.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Community
            </h3>
            <p className="text-gray-600">
              Connect with fellow writers and readers who share your interests.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Discover
            </h3>
            <p className="text-gray-600">
              Find amazing stories and insights from writers around the world.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
