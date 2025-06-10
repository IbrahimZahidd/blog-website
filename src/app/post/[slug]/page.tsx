import { Metadata } from "next";
import PostContent from "@/components/post/post-content";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({}: PostPageProps): Promise<Metadata> {
  // In a real app, you'd fetch the post data here
  return {
    title: `Blog Post - BlogSpace`,
    description: "Read this amazing blog post on BlogSpace",
  };
}

export default function PostPage({ params }: PostPageProps) {
  return <PostContent slug={params.slug} />;
}
