"use client";

import ProtectedRoute from "@/components/ui/protected-route";
import PostEditor from "@/components/editor/post-editor";

export default function EditorPage() {
  return (
    <ProtectedRoute>
      <PostEditor />
    </ProtectedRoute>
  );
}
