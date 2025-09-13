"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../Services/AuthService";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // If no user found, redirect to auth page
      router.push("/auth");
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <div className="mb-6">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role || "N/A"}
          </p>
          <p>
            <strong>Department:</strong> {user.department || "N/A"}
          </p>
          {user.id && (
            <p>
              <strong>ID:</strong> {user.id}
            </p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
