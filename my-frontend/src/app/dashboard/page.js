"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if no user
  useEffect(() => {
    if (!user) router.push("/");
  }, [user, router]);

  if (!user) {
    // Optionally, return a loading state
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">User Dashboard</h2>
        <div className="space-y-3">
          <div>
            <span className="font-semibold">Name:</span> {user.name}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {user.email}
          </div>
          <div>
            <span className="font-semibold">Department:</span> {user.department}
          </div>
          <div>
            <span className="font-semibold">Role:</span> {user.role}
          </div>
          <div>
            <span className="font-semibold">ID:</span> {user.id}
          </div>
        </div>
        <button
          className="mt-8 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
