"use client";

import { useEffect, useState } from "react";
import { Loader, CheckCircle, Clock, List } from "lucide-react";

export default function DashTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Count tasks by status
  const todoCount = tasks.filter((t) => t.status === "pending").length;
  const inProgressCount = tasks.filter((t) => t.status === "in-progress").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-24 text-gray-600">
        <Loader className="animate-spin w-6 h-6 mr-2" /> Loading tasks...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Todo */}
      <div className="p-6 rounded-2xl shadow-sm bg-white border border-gray-100 hover:shadow-md transition">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-yellow-100">
            <List className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-3xl font-semibold text-gray-800">{todoCount}</p>
          </div>
        </div>
      </div>

      {/* In Progress */}
      <div className="p-6 rounded-2xl shadow-sm bg-white border border-gray-100 hover:shadow-md transition">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-blue-100">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Ongoing</p>
            <p className="text-3xl font-semibold text-gray-800">{inProgressCount}</p>
          </div>
        </div>
      </div>

      {/* Completed */}
      <div className="p-6 rounded-2xl shadow-sm bg-white border border-gray-100 hover:shadow-md transition">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-green-100">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-3xl font-semibold text-gray-800">{completedCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
