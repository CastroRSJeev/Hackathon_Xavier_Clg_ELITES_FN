import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, GripVertical } from 'lucide-react';

const StudentProgressTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [tasks, setTasks] = useState([]);

  const [newTask, setNewTask] = useState({
    taskName: '',
    subject: 'General',
    description: '',
    status: 'pending'
  });

  const API_BASE_URL = 'http://localhost:5000/api';
  const USER_ID = '64f5c2e1a123456789abcdef';

  // Fetch tasks from API
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new task
  const createTask = async (taskData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...taskData,
          userId: USER_ID
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      
      await fetchTasks(); // Refresh the task list
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error creating task:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update task
  const updateTask = async (taskId, taskData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...taskData,
          userId: USER_ID
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      await fetchTasks(); // Refresh the task list
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error updating task:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      await fetchTasks(); // Refresh the task list
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error deleting task:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (newTask.taskName.trim()) {
      const success = await createTask(newTask);
      if (success) {
        setNewTask({
          taskName: '',
          subject: 'General',
          description: '',
          status: 'pending'
        });
        setShowAddModal(false);
      }
    }
  };

  const handleEditTask = async (taskId, updatedTask) => {
    const success = await updateTask(taskId, updatedTask);
    if (success) {
      setEditingTask(null);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

 const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (draggedTask && mapStatus(draggedTask.status) !== newStatus) {
      const updatedTask = {
        taskName: draggedTask.taskName,
        description: draggedTask.description,
        subject: draggedTask.subject,
        status: mapStatusToAPI(newStatus) // Map display status to API status
      };
      
      await updateTask(draggedTask._id, updatedTask);
      setDraggedTask(null);
    }
  };

  // Map API status to display status
  const mapStatus = (apiStatus) => {
    switch (apiStatus) {
      case 'todo':
      case 'pending':
        return 'pending';
      case 'in-progress':
        return 'ongoing';
      case 'completed':
        return 'completed';
      default:
        return 'pending';
    }
  };

  // Map display status to API status
  const mapStatusToAPI = (displayStatus) => {
    switch (displayStatus) {
      case 'pending':
        return 'pending';
      case 'ongoing':
        return 'in-progress';
      case 'completed':
        return 'completed';
      default:
        return 'pending';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const mappedStatus = mapStatus(task.status);
    const matchesSearch = task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || mappedStatus === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getTasksByStatus = (status) => {
    return filteredTasks.filter(task => mapStatus(task.status) === status);
  };

  const TaskCard = ({ task }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTaskName, setEditTaskName] = useState(task.taskName);
    const [editDescription, setEditDescription] = useState(task.description);
    const [editSubject, setEditSubject] = useState(task.subject);

    const handleSaveEdit = async () => {
      const updatedTask = {
        taskName: editTaskName,
        description: editDescription,
        subject: editSubject,
        status: mapStatusToAPI(mapStatus(task.status))
      };
      
      const success = await handleEditTask(task._id, updatedTask);
      if (success) {
        setIsEditing(false);
      }
    };

    const mappedStatus = mapStatus(task.status);

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
                value={editTaskName}
                onChange={(e) => setEditTaskName(e.target.value)}
                className="font-medium text-gray-800 bg-gray-50 border rounded px-2 py-1 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
              />
            ) : (
              <h3 className="font-medium text-gray-800">{task.taskName}</h3>
            )}
          </div>
          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="text-green-600 hover:text-green-700 p-1"
                  disabled={loading}
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
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-red-600 hover:text-red-700 p-1"
                  disabled={loading}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <>
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="text-sm text-gray-600 mb-2 w-full bg-gray-50 border rounded px-2 py-1"
              placeholder="Description"
              onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
            />
            <input
              type="text"
              value={editSubject}
              onChange={(e) => setEditSubject(e.target.value)}
              className="text-sm text-gray-600 mb-3 w-full bg-gray-50 border rounded px-2 py-1"
              placeholder="Subject"
              onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
            />
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-1">{task.description}</p>
            <p className="text-xs text-gray-500 mb-3">Subject: {task.subject}</p>
          </>
        )}
        
        <div className="flex items-center justify-between">
          <div className={`w-3 h-3 rounded-full ${
            mappedStatus === 'completed' ? 'bg-green-500' : 
            mappedStatus === 'ongoing' ? 'bg-yellow-500' : 'bg-blue-500'
          }`}></div>
          <span className="text-xs text-gray-500">
            {new Date(task.createdAt).toLocaleDateString('en-GB')}
          </span>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md w-full">
          <h2 className="text-red-800 font-semibold mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchTasks}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Student Progress Tracker</h1>
          {loading && <div className="text-blue-600">Loading...</div>}
        </div>
        
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
            disabled={loading}
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-4 mb-6">
          {[
            { key: 'all', label: 'All', count: filteredTasks.length },
            { key: 'pending', label: 'Pending', count: getTasksByStatus('pending').length },
            { key: 'ongoing', label: 'Ongoing', count: getTasksByStatus('ongoing').length },
            { key: 'completed', label: 'Completed', count: getTasksByStatus('completed').length }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeFilter === filter.key
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        {/* Task Columns */}
        <div className={`${activeFilter === 'all' ? 'grid grid-cols-3 gap-6' : 'max-w-2xl mx-auto'}`}>
          {/* Show all columns when filter is 'all' */}
          {activeFilter === 'all' && (
            <>
              {/* Pending Column */}
              <div
                className="bg-gray-100 rounded-lg p-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'pending')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-blue-600">Pending</h2>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                    {getTasksByStatus('pending').length}
                  </span>
                </div>
                <div className="space-y-3">
                  {getTasksByStatus('pending').map(task => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                </div>
              </div>

              {/* Ongoing Column */}
              <div
                className="bg-gray-100 rounded-lg p-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'ongoing')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-yellow-600">Ongoing</h2>
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-sm">
                    {getTasksByStatus('ongoing').length}
                  </span>
                </div>
                <div className="space-y-3">
                  {getTasksByStatus('ongoing').map(task => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                </div>
              </div>

              {/* Completed Column */}
              <div
                className="bg-gray-100 rounded-lg p-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'completed')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-green-600">Completed</h2>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                    {getTasksByStatus('completed').length}
                  </span>
                </div>
                <div className="space-y-3">
                  {getTasksByStatus('completed').map(task => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Show single column when specific filter is selected */}
          {activeFilter !== 'all' && (
            <div
              className="bg-gray-100 rounded-lg p-4 w-full"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, activeFilter)}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold ${
                  activeFilter === 'pending' ? 'text-blue-600' :
                  activeFilter === 'ongoing' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
                </h2>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  activeFilter === 'pending' ? 'bg-blue-100 text-blue-700' :
                  activeFilter === 'ongoing' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {getTasksByStatus(activeFilter).length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {getTasksByStatus(activeFilter).map(task => (
                  <TaskCard key={task._id} task={task} />
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
                  placeholder="Task Name"
                  value={newTask.taskName}
                  onChange={(e) => setNewTask({...newTask, taskName: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  value={newTask.subject}
                  onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Task'}
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