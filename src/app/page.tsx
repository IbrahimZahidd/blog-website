import HeroSection from "@/components/home/hero-section";
import FeaturedPosts from "@/components/home/featured-posts";
import RecentPosts from "@/components/home/recent-posts";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedPosts />
      <RecentPosts />
    </div>
  );
}
