"use client";

import { use } from "react"; // Import the hook to unwrap promises
import ProtectedRoute from "@/components/ui/protected-route";
import PostEditor from "@/components/editor/post-editor";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { id } = use(params); // ✅ Unwrap the Promise using use()

  return (
    <ProtectedRoute>
      <PostEditor postId={id} />
    </ProtectedRoute>
  );
}
