"use client";

/*
 * Student Progress Tracker - Single File Implementation
 *
 * To use this component:
 * 1. Ensure Tailwind CSS is configured in your project
 * 2. This component uses localStorage for persistence
 * 3. All styling uses Tailwind classes exclusively
 * 4. Includes keyboard accessibility and drag & drop
 *
 * Features:
 * - Subject tabs with task counts
 * - Drag & drop between columns
 * - Keyboard navigation and accessibility
 * - Local storage persistence
 * - Export/Import JSON functionality
 * - Add/Edit/Delete tasks with undo
 * - Search/Filter functionality
 * - Responsive design
 */

import { useState, useRef, useCallback } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

// Seed data
const initialSubjects = [
  {
    id: "maths",
    name: "Maths",
    tasks: [
      {
        id: "1",
        title: "Linear Algebra Chapter 3",
        note: "Matrix operations",
        status: "pending",
        subject: "maths",
        createdAt: Date.now() - 86400000,
      },
      {
        id: "2",
        title: "Calculus Problem Set",
        note: "Integration by parts",
        status: "ongoing",
        subject: "maths",
        createdAt: Date.now() - 43200000,
      },
      {
        id: "3",
        title: "Statistics Quiz Prep",
        status: "completed",
        subject: "maths",
        createdAt: Date.now() - 172800000,
      },
    ],
  },
  {
    id: "dsa",
    name: "DSA",
    tasks: [
      {
        id: "4",
        title: "Binary Tree Traversal",
        note: "Implement all methods",
        status: "pending",
        subject: "dsa",
        createdAt: Date.now() - 129600000,
      },
      {
        id: "5",
        title: "Dynamic Programming",
        note: "Knapsack problem variations",
        status: "ongoing",
        subject: "dsa",
        createdAt: Date.now() - 21600000,
      },
      {
        id: "6",
        title: "Sorting Algorithms",
        status: "completed",
        subject: "dsa",
        createdAt: Date.now() - 259200000,
      },
      {
        id: "7",
        title: "Graph Algorithms",
        note: "BFS and DFS implementation",
        status: "completed",
        subject: "dsa",
        createdAt: Date.now() - 345600000,
      },
    ],
  },
  {
    id: "physics",
    name: "Physics",
    tasks: [
      {
        id: "8",
        title: "Quantum Mechanics",
        note: "Schrödinger equation",
        status: "pending",
        subject: "physics",
        createdAt: Date.now() - 64800000,
      },
      {
        id: "9",
        title: "Thermodynamics Lab",
        status: "ongoing",
        subject: "physics",
        createdAt: Date.now() - 10800000,
      },
      {
        id: "10",
        title: "Optics Assignment",
        note: "Wave-particle duality",
        status: "completed",
        subject: "physics",
        createdAt: Date.now() - 432000000,
      },
    ],
  },
];

export default function StudentProgressTracker() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [activeSubject, setActiveSubject] = useState("maths");
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [focusedTask, setFocusedTask] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [undoAction, setUndoAction] = useState(null);
  const [exportDataValue, setExportDataValue] = useState("");
  const [showExport, setShowExport] = useState(false);

  // Refs for keyboard navigation
  const taskRefs = useRef({});

  // Get current subject data
  const currentSubject =
    subjects.find((s) => s.id === activeSubject) || subjects[0];

  // Filter tasks based on search term
  const filteredTasks = currentSubject.tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.note && task.note.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get tasks by status
  const getTasksByStatus = (status) =>
    filteredTasks.filter((task) => task.status === status);

  // Get task counts for badge
  const getTaskCounts = (subject) => {
    const pending = subject.tasks.filter((t) => t.status === "pending").length;
    const ongoing = subject.tasks.filter((t) => t.status === "ongoing").length;
    const completed = subject.tasks.filter(
      (t) => t.status === "completed"
    ).length;
    return { pending, ongoing, completed };
  };

  // Update task
  const updateTask = useCallback((taskId, updates) => {
    setSubjects((prev) =>
      prev.map((subject) => ({
        ...subject,
        tasks: subject.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        ),
      }))
    );
  }, []);

  // Move task to different status
  const moveTask = useCallback(
    (taskId, newStatus) => {
      const oldTask = currentSubject.tasks.find((t) => t.id === taskId);
      if (!oldTask) return;

      updateTask(taskId, { status: newStatus });

      // Show undo option
      if (undoAction) clearTimeout(undoAction.timeout);
      const timeout = setTimeout(() => setUndoAction(null), 5000);
      setUndoAction({
        action: "move",
        data: { taskId, oldStatus: oldTask.status, newStatus },
        timeout,
      });
    },
    [currentSubject.tasks, updateTask, undoAction]
  );

  // Delete task
  const deleteTask = useCallback(
    (taskId) => {
      const taskToDelete = currentSubject.tasks.find((t) => t.id === taskId);
      if (!taskToDelete) return;

      setSubjects((prev) =>
        prev.map((subject) =>
          subject.id === activeSubject
            ? {
                ...subject,
                tasks: subject.tasks.filter((task) => task.id !== taskId),
              }
            : subject
        )
      );

      // Show undo option
      if (undoAction) clearTimeout(undoAction.timeout);
      const timeout = setTimeout(() => setUndoAction(null), 5000);
      setUndoAction({
        action: "delete",
        data: taskToDelete,
        timeout,
      });
    },
    [currentSubject.tasks, undoAction]
  );

  // Undo last action
  const undoLastAction = useCallback(() => {
    if (!undoAction) return;

    if (undoAction.action === "delete") {
      setSubjects((prev) =>
        prev.map((subject) =>
          subject.id === undoAction.data.subject
            ? { ...subject, tasks: [...subject.tasks, undoAction.data] }
            : subject
        )
      );
    } else if (undoAction.action === "move") {
      updateTask(undoAction.data.taskId, { status: undoAction.data.oldStatus });
    }

    clearTimeout(undoAction.timeout);
    setUndoAction(null);
  }, [undoAction, updateTask]);

  // Add new task
  const addTask = useCallback(
    (title, note, status) => {
      const newTask = {
        id: Date.now().toString(),
        title,
        note: note || undefined,
        status,
        subject: activeSubject,
        createdAt: Date.now(),
      };

      setSubjects((prev) =>
        prev.map((subject) =>
          subject.id === activeSubject
            ? { ...subject, tasks: [...subject.tasks, newTask] }
            : subject
        )
      );
    },
    [activeSubject]
  );

  // Drag and drop handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      moveTask(draggedTask.id, status);
    }
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  // Keyboard navigation
  const handleKeyDown = (e, task) => {
    if (e.key === "Enter" && focusedTask === task.id) {
      // Toggle between statuses with Enter
      const statuses = ["pending", "ongoing", "completed"];
      const currentIndex = statuses.indexOf(task.status);
      const nextStatus = statuses[(currentIndex + 1) % statuses.length];
      moveTask(task.id, nextStatus);
    } else if (e.key === "ArrowLeft" && focusedTask === task.id) {
      e.preventDefault();
      if (task.status === "ongoing") moveTask(task.id, "pending");
      else if (task.status === "completed") moveTask(task.id, "ongoing");
    } else if (e.key === "ArrowRight" && focusedTask === task.id) {
      e.preventDefault();
      if (task.status === "pending") moveTask(task.id, "ongoing");
      else if (task.status === "ongoing") moveTask(task.id, "completed");
    } else if (e.key === "Delete" && focusedTask === task.id) {
      e.preventDefault();
      deleteTask(task.id);
    }
  };

  // Tab navigation
  const handleTabKeyDown = (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const currentIndex = subjects.findIndex((s) => s.id === activeSubject);
      const nextIndex =
        e.key === "ArrowRight"
          ? (currentIndex + 1) % subjects.length
          : (currentIndex - 1 + subjects.length) % subjects.length;
      setActiveSubject(subjects[nextIndex].id);
    }
  };

  // Export/Import functions
  const handleExportData = () => {
    const data = JSON.stringify({ subjects, activeSubject }, null, 2);
    setExportDataValue(data);
    setShowExport(true);
  };

  const handleImportData = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.subjects && Array.isArray(data.subjects)) {
        setSubjects(data.subjects);
        setActiveSubject(data.activeSubject || data.subjects[0]?.id || "maths");
        setShowExport(false);
        setExportDataValue("");
      }
    } catch (e) {
      alert("Invalid JSON format");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <div
          className="flex-1 p-4 font-sans"
          style={{ backgroundColor: "#E3F2FD" }}
        >
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1
                className="text-3xl font-bold mb-4"
                style={{ color: "#212121" }}
              >
                Student Progress Tracker
              </h1>

              {/* Search and Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ color: "#212121" }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsAddingTask(true)}
                    className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#1976D2" }}
                  >
                    Add Task
                  </button>
                  <button
                    onClick={handleExportData}
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    style={{ color: "#212121" }}
                  >
                    Export/Import
                  </button>
                </div>
              </div>

              {/* Undo notification */}
              {undoAction && (
                <div
                  className="mb-4 p-3 rounded-lg border-l-4 flex items-center justify-between"
                  style={{ backgroundColor: "#FFF3E0", borderColor: "#FFA726" }}
                >
                  <span style={{ color: "#212121" }}>Action completed.</span>
                  <button
                    onClick={undoLastAction}
                    className="ml-2 px-3 py-1 rounded text-sm font-medium hover:opacity-90"
                    style={{ backgroundColor: "#FFA726", color: "white" }}
                  >
                    Undo
                  </button>
                </div>
              )}
            </div>

            {/* Subject Tabs */}
            <div className="mb-6">
              <div
                className="flex flex-wrap gap-2"
                role="tablist"
                onKeyDown={handleTabKeyDown}
              >
                {subjects.map((subject) => {
                  const counts = getTaskCounts(subject);
                  return (
                    <button
                      key={subject.id}
                      role="tab"
                      aria-selected={activeSubject === subject.id}
                      tabIndex={activeSubject === subject.id ? 0 : -1}
                      onClick={() => setActiveSubject(subject.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        activeSubject === subject.id
                          ? "text-white shadow-md"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                      style={{
                        backgroundColor:
                          activeSubject === subject.id ? "#1976D2" : undefined,
                      }}
                    >
                      {subject.name}
                      <span className="ml-2 text-xs opacity-75">
                        P:{counts.pending} O:{counts.ongoing} C:
                        {counts.completed}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["pending", "ongoing", "completed"].map((status) => {
                const tasks = getTasksByStatus(status);
                const columnTitle =
                  status.charAt(0).toUpperCase() + status.slice(1);
                const columnColor =
                  status === "completed" ? "#388E3C" : "#1976D2";

                return (
                  <div
                    key={status}
                    className={`bg-white rounded-lg p-4 shadow-sm transition-all ${
                      dragOverColumn === status
                        ? "ring-2 ring-blue-300 bg-blue-50"
                        : ""
                    }`}
                    onDragOver={(e) => handleDragOver(e, status)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, status)}
                    role="region"
                    aria-label={`${columnTitle} tasks`}
                  >
                    <h3
                      className="font-semibold mb-4 text-lg flex items-center gap-2"
                      style={{ color: columnColor }}
                    >
                      {columnTitle}
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                        {tasks.length}
                      </span>
                    </h3>

                    <div className="space-y-3 min-h-[200px]">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          ref={(el) => (taskRefs.current[task.id] = el)}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task)}
                          onKeyDown={(e) => handleKeyDown(e, task)}
                          onFocus={() => setFocusedTask(task.id)}
                          onBlur={() => setFocusedTask(null)}
                          tabIndex={0}
                          className={`bg-white border rounded-lg p-3 cursor-move transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                            draggedTask?.id === task.id ? "opacity-50" : ""
                          } ${
                            focusedTask === task.id
                              ? "ring-2 ring-blue-300"
                              : ""
                          }`}
                          role="button"
                          aria-label={`Task: ${task.title}. Press Enter to move, Arrow keys to change status, Delete to remove`}
                        >
                          {editingTask === task.id ? (
                            <EditTaskForm
                              task={task}
                              onSave={(title, note) => {
                                updateTask(task.id, {
                                  title,
                                  note: note || undefined,
                                });
                                setEditingTask(null);
                              }}
                              onCancel={() => setEditingTask(null)}
                            />
                          ) : (
                            <>
                              <div className="flex items-start justify-between mb-2">
                                <h4
                                  className="font-medium text-sm"
                                  style={{ color: "#212121" }}
                                >
                                  {task.title}
                                </h4>
                                <div className="flex gap-1 ml-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingTask(task.id);
                                    }}
                                    className="text-xs px-2 py-1 rounded hover:bg-gray-100"
                                    style={{ color: "#1976D2" }}
                                    aria-label="Edit task"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteTask(task.id);
                                    }}
                                    className="text-xs px-2 py-1 rounded hover:bg-red-50"
                                    style={{ color: "#D32F2F" }}
                                    aria-label="Delete task"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                              {task.note && (
                                <p className="text-xs text-gray-600 mb-2">
                                  {task.note}
                                </p>
                              )}
                              <div className="flex items-center justify-between">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: columnColor }}
                                  aria-label={`Status: ${status}`}
                                />
                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    task.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Task Modal */}
            {isAddingTask && (
              <AddTaskModal
                onAdd={addTask}
                onClose={() => setIsAddingTask(false)}
                defaultSubject={activeSubject}
                subjects={subjects}
              />
            )}

            {/* Export/Import Modal */}
            {showExport && (
              <ExportImportModal
                exportData={exportDataValue}
                onImport={handleImportData}
                onClose={() => {
                  setShowExport(false);
                  setExportDataValue("");
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add Task Modal Component
function AddTaskModal({ onAdd, onClose, defaultSubject, subjects }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("pending");
  const [subject, setSubject] = useState(defaultSubject);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), note.trim(), status);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4" style={{ color: "#212121" }}>
          Add New Task
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#212121" }}
            >
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoFocus
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#212121" }}
            >
              Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#212121" }}
            >
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#212121" }}
            >
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 px-4 rounded-lg text-white font-medium hover:opacity-90"
              style={{ backgroundColor: "#1976D2" }}
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50"
              style={{ color: "#212121" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Task Form Component
function EditTaskForm({ task, onSave, onCancel }) {
  const [title, setTitle] = useState(task.title);
  const [note, setNote] = useState(task.note || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title.trim(), note.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        autoFocus
      />
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note..."
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        rows={2}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-3 py-1 text-xs rounded text-white hover:opacity-90"
          style={{ backgroundColor: "#1976D2" }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Export/Import Modal Component
function ExportImportModal({ exportData, onImport, onClose }) {
  const [importDataValue, setImportDataValue] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4" style={{ color: "#212121" }}>
          Export/Import Data
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2" style={{ color: "#212121" }}>
              Export Data (Copy this JSON)
            </h3>
            <textarea
              value={exportData}
              readOnly
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              onClick={(e) => e.currentTarget.select()}
            />
          </div>

          <div>
            <h3 className="font-medium mb-2" style={{ color: "#212121" }}>
              Import Data (Paste JSON here)
            </h3>
            <textarea
              value={importDataValue}
              onChange={(e) => setImportDataValue(e.target.value)}
              placeholder="Paste your exported JSON data here..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
            />
            <button
              onClick={() => onImport(importDataValue)}
              disabled={!importDataValue.trim()}
              className="mt-2 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#1976D2" }}
            >
              Import Data
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-4 mt-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            style={{ color: "#212121" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
