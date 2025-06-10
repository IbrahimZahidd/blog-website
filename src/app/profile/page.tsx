"use client";

import ProtectedRoute from "@/components/ui/protected-route";
import UserProfile from "@/components/profile/user-profile";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <UserProfile />
    </ProtectedRoute>
  );
}
