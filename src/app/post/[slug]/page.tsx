import { Metadata } from "next";
import PostContent from "@/components/post/post-content";

interface PageProps {
  params: {
    slug: string;
  };
}

// ✅ Correct way to type params for generateMetadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // Temporary use to silence warning
  void params;

  return {
    title: `Blog Post - BlogSpace`,
    description: "Read this amazing blog post on BlogSpace",
  };
}

export default function PostPage({ params }: PageProps) {
  return <PostContent slug={params.slug} />;
}
