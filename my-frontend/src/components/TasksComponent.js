"use client";

import { useState, useEffect } from "react";
import { Loader, CheckCircle, Clock, List } from "lucide-react";

export default function TaskComponent() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data (replace with API call later)
  const mockData = [
    {
      _id: "68c511906d37501b3e43a201",
      userId: "68c511906d37501b3e43a200",
      taskName: "Initial Task",
      description: "This is a sample task",
      status: "todo",
      subject: "General",
      createdAt: "2025-09-13T06:39:12.485Z",
    },
    {
      _id: "68c51296c6099c53c9e87eae",
      userId: "64f5c2e1a123456789abcdef",
      taskName: "Complete Hackathon Project",
      description: "Finish the project and submit before the deadline.",
      status: "completed",
      subject: "Hackathons",
      createdAt: "2025-09-13T06:43:34.604Z",
    },
    {
      _id: "68c51296c6099c53c9e87eaf",
      userId: "64f5c2e1a123456789abcdee",
      taskName: "Study for Exams",
      description: "Revise important topics.",
      status: "in progress",
      subject: "Studies",
      createdAt: "2025-09-13T08:00:00.000Z",
    },
  ];

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setTasks(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inProgressCount = tasks.filter((t) => t.status === "in progress").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-24">
        <Loader className="animate-spin w-6 h-6 mr-2" /> Loading tasks...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Status cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-yellow-100 p-6 rounded-xl shadow flex items-center space-x-4">
          <List className="w-8 h-8 text-yellow-600" />
          <div>
            <p className="text-gray-500">To Do</p>
            <p className="text-2xl font-bold">{todoCount}</p>
          </div>
        </div>

        <div className="bg-blue-100 p-6 rounded-xl shadow flex items-center space-x-4">
          <Clock className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-gray-500">In Progress</p>
            <p className="text-2xl font-bold">{inProgressCount}</p>
          </div>
        </div>

        <div className="bg-green-100 p-6 rounded-xl shadow flex items-center space-x-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
          <div>
            <p className="text-gray-500">Completed</p>
            <p className="text-2xl font-bold">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Task list */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">All Tasks</h2>
        <ul className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <li key={task._id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{task.taskName}</p>
                <p className="text-sm text-gray-500">{task.subject}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  task.status === "todo"
                    ? "bg-yellow-200 text-yellow-800"
                    : task.status === "in progress"
                    ? "bg-blue-200 text-blue-800"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {task.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
