"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function TaskPage() {
  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <p>Here you can view and manage tasks.</p>
      </div>
    </ProtectedRoute>
  );
}
