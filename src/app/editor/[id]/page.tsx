"use client";

import ProtectedRoute from "@/components/ui/protected-route";
import PostEditor from "@/components/editor/post-editor";

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { id } = params; // ✅ No need for `use()`, since it's not a Promise

  return (
    <ProtectedRoute>
      <PostEditor postId={id} />
    </ProtectedRoute>
  );
}
