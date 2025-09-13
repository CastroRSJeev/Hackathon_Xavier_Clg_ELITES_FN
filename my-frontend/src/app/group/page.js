"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function GroupPage() {
  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Groups</h1>
        <p>Here you can manage your groups.</p>
      </div>
    </ProtectedRoute>
  );
}
