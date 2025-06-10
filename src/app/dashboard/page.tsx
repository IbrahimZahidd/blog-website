"use client";

import ProtectedRoute from "@/components/ui/protected-route";
import DashboardContent from "@/components/dashboard/dashboard-content";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
