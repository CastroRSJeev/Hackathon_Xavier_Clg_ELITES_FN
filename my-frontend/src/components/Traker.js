import React, { useState } from "react";
import { Search, Plus, Edit2, Trash2, GripVertical } from "lucide-react";

const StudentProgressTracker = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Linear Algebra Chapter 3",
      subject: "Maths",
      subjectCode: "P-1.0.1.C-1",
      description: "Matrix operations",
      status: "pending",
      dueDate: "12/09/2025",
    },
    {
      id: 2,
      title: "Calculus Problem Set",
      subject: "Maths",
      subjectCode: "P-1.0.1.C-1",
      description: "Integration by parts",
      status: "ongoing",
      dueDate: "13/09/2025",
    },
    {
      id: 3,
      title: "Statistics Quiz Prep",
      subject: "Maths",
      subjectCode: "P-1.0.1.C-1",
      description: "Probability distributions",
      status: "completed",
      dueDate: "11/09/2025",
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    subject: "Maths",
    subjectCode: "P-1.0.1.C-1",
    description: "",
    status: "pending",
    dueDate: "",
  });

  const subjects = [
    { name: "Maths", code: "P-1.0.1.C-1", color: "bg-blue-500" },
    { name: "DSA", code: "P-1.0.1.C-2", color: "bg-gray-500" },
    { name: "Physics", code: "P-1.0.1.C-1", color: "bg-gray-400" },
  ];

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const task = {
        ...newTask,
        id: Date.now(),
        dueDate: newTask.dueDate || new Date().toLocaleDateString("en-GB"),
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: "",
        subject: "Maths",
        subjectCode: "P-1.0.1.C-1",
        description: "",
        status: "pending",
        dueDate: "",
      });
      setShowAddModal(false);
    }
  };

  const handleEditTask = (taskId, updatedTask) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
    );
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedTask) {
      setTasks(
        tasks.map((task) =>
          task.id === draggedTask.id ? { ...task, status: newStatus } : task
        )
      );
      setDraggedTask(null);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || task.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getTasksByStatus = (status) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-blue-600";
      case "ongoing":
        return "text-blue-500";
      case "completed":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const TaskCard = ({ task }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description);

    const handleSaveEdit = () => {
      handleEditTask(task.id, {
        title: editTitle,
        description: editDescription,
      });
      setIsEditing(false);
    };

    return (
      <div
        className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-gray-400" />
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="font-medium text-gray-800 bg-gray-50 border rounded px-2 py-1 text-sm"
                onKeyPress={(e) => e.key === "Enter" && handleSaveEdit()}
              />
            ) : (
              <h3 className="font-medium text-gray-800">{task.title}</h3>
            )}
          </div>
          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="text-green-600 hover:text-green-700 p-1"
                >
                  ✓
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-600 hover:text-gray-700 p-1"
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-700 p-1"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="text-sm text-gray-600 mb-3 w-full bg-gray-50 border rounded px-2 py-1"
            placeholder="Description"
            onKeyPress={(e) => e.key === "Enter" && handleSaveEdit()}
          />
        ) : (
          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div
            className={`w-3 h-3 rounded-full ${
              task.status === "completed" ? "bg-green-500" : "bg-blue-500"
            }`}
          ></div>
          <span className="text-xs text-gray-500">{task.dueDate}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Student Progress Tracker
        </h1>

        {/* Search and Add Task */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
          <div className="text-gray-600">Export/Import</div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-4 mb-6">
          {[
            { key: "all", label: "All", count: filteredTasks.length },
            {
              key: "pending",
              label: "Pending",
              count: getTasksByStatus("pending").length,
            },
            {
              key: "ongoing",
              label: "Ongoing",
              count: getTasksByStatus("ongoing").length,
            },
            {
              key: "completed",
              label: "Completed",
              count: getTasksByStatus("completed").length,
            },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeFilter === filter.key
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        {/* Task Columns */}
        <div
          className={`${
            activeFilter === "all"
              ? "grid grid-cols-3 gap-6"
              : "max-w-2xl mx-auto"
          }`}
        >
          {/* Show all columns when filter is 'all' */}
          {activeFilter === "all" && (
            <>
              {/* Pending Column */}
              <div
                className="bg-gray-100 rounded-lg p-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "pending")}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-blue-600">
                    Pending
                  </h2>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                    {getTasksByStatus("pending").length}
                  </span>
                </div>
                <div className="space-y-3">
                  {getTasksByStatus("pending").map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>

              {/* Ongoing Column */}
              <div
                className="bg-gray-100 rounded-lg p-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "ongoing")}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-blue-500">
                    Ongoing
                  </h2>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                    {getTasksByStatus("ongoing").length}
                  </span>
                </div>
                <div className="space-y-3">
                  {getTasksByStatus("ongoing").map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>

              {/* Completed Column */}
              <div
                className="bg-gray-100 rounded-lg p-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "completed")}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-green-600">
                    Completed
                  </h2>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                    {getTasksByStatus("completed").length}
                  </span>
                </div>
                <div className="space-y-3">
                  {getTasksByStatus("completed").map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Show single column when specific filter is selected */}
          {activeFilter === "pending" && (
            <div
              className="bg-gray-100 rounded-lg p-4 w-full"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "pending")}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-blue-600">Pending</h2>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                  {getTasksByStatus("pending").length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {getTasksByStatus("pending").map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {activeFilter === "ongoing" && (
            <div
              className="bg-gray-100 rounded-lg p-4 w-full"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "ongoing")}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-blue-500">Ongoing</h2>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                  {getTasksByStatus("ongoing").length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {getTasksByStatus("ongoing").map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {activeFilter === "completed" && (
            <div
              className="bg-gray-100 rounded-lg p-4 w-full"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "completed")}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-green-600">
                  Completed
                </h2>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                  {getTasksByStatus("completed").length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {getTasksByStatus("completed").map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add Task Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Task Title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({ ...newTask, status: e.target.value })
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProgressTracker;
