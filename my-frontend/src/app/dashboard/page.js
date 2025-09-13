"use client";
import { useEffect, useState, Suspense, lazy } from "react";
import { useRouter } from "next/navigation";
import { logout as authLogout } from "../Services/AuthService";
import { 
  Home, 
  CheckSquare, 
  BookOpen, 
  MessageSquare,
  Settings, 
  ChevronDown,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  BarChart3
} from "lucide-react";
import DashTasks from "@/components/DashTasks";
import AIStudyAssistant from "@/components/AIStudyAssistant";

// Lazy load components for better performance
const TasksComponent = lazy(() => import("@/components/AIStudyAssistant"));
const StudyMaterialsComponent = lazy(() => import("@/components/StudyMaterialsCRUD"));

// Menu configuration
const menuData = [
  {
    id: 1,
    title: "Dashboard",
    component: "dashboard",
    icon: Home,
    description: "Overview of your learning progress"
  },
  {
    id: 2,
    title: "Tasks",
    component: "tasks",
    icon: CheckSquare,
    description: "Manage your study tasks"
  },
  {
    id: 3,
    title: "Study Materials",
    component: "study-materials",
    icon: BookOpen,
    description: "Access learning resources"
  },
  {
    id: 4,
    title: "Ask AI",
    component: "ask-ai",
    icon: MessageSquare,
    description: "Get AI-powered assistance"
  },
 
];

// Loading component with professional styling
const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
      </div>
      <p className="text-gray-600 font-medium">{text}</p>
    </div>
  </div>
);

// Error component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <X className="h-5 w-5 text-red-400" />
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-red-800">{message}</p>
      </div>
      {onRetry && (
        <div className="ml-auto">
          <button
            onClick={onRetry}
            className="text-red-600 hover:text-red-500 text-sm font-medium"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  </div>
);

// Quick Stats Component
const QuickStats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Active Tasks</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTasks}</p>
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <CheckSquare className="w-6 h-6 text-blue-600" />
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center text-sm">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-green-600 font-medium">+12%</span>
          <span className="text-gray-500 ml-1">from last week</span>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Study Materials</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.studyMaterials}</p>
        </div>
        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-emerald-600" />
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center text-sm">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-green-600 font-medium">+8%</span>
          <span className="text-gray-500 ml-1">from last month</span>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">AI Conversations</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.aiConversations}</p>
        </div>
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-purple-600" />
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center text-sm">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-green-600 font-medium">+25%</span>
          <span className="text-gray-500 ml-1">this week</span>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Study Hours</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">127</p>
        </div>
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <Clock className="w-6 h-6 text-orange-600" />
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center text-sm">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-green-600 font-medium">+15%</span>
          <span className="text-gray-500 ml-1">this month</span>
        </div>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [activeTitle, setActiveTitle] = useState("Dashboard");
  const [stats, setStats] = useState({
    totalTasks: 24,
    studyMaterials: 156,
    aiConversations: 89,
    configurations: 12
  });

  // Check authentication status and get user data
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } else {
          router.push("/auth");
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
        setError("Invalid user session");
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Handle component selection
  const selectComponent = (component, title) => {
    setActiveComponent(component);
    setActiveTitle(title);
    setSidebarOpen(false);
    setProfileDropdownOpen(false);
  };

  // Check if component is active
  const isActive = (component) => activeComponent === component;

  // Handle logout
  const handleLogout = async () => {
    try {
      authLogout();
      router.push("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
      setError("Logout failed. Please try again.");
    }
  };

  // Clear error message
  const clearError = () => {
    setError(null);
  };

  // User profile section for dashboard
  const UserProfileSection = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Profile Overview</h3>
        <button 
          onClick={() => selectComponent("settings", "Settings")}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Edit Profile
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info Card */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <User size={18} className="text-white" />
            </div>
            <h4 className="font-semibold text-gray-900">Personal Details</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Name</span>
              <span className="text-gray-900 font-medium">{user?.name || user?.fullName || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Email</span>
              <span className="text-gray-900 font-medium text-sm">{user?.email || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        {/* Academic Info Card */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
              <Award size={18} className="text-white" />
            </div>
            <h4 className="font-semibold text-gray-900">Academic Info</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Role</span>
              <span className="text-gray-900 font-medium">{user?.role || "Student"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Department</span>
              <span className="text-gray-900 font-medium">{user?.department || "N/A"}</span>
            </div>
            {user?.id && (
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">ID</span>
                <span className="text-gray-900 font-mono text-sm bg-white px-2 py-1 rounded border">
                  {user.id}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Render the active component
  const renderActiveComponent = () => {
    if (activeComponent === "dashboard") {
      return (
        <div className="space-y-6">
          {/* Error Display */}
          {error && (
            <ErrorMessage 
              message={error} 
              onRetry={clearError}
            />
          )}

          {/* Welcome Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome back, {user?.name || user?.fullName || 'User'}! 👋
                </h2>
                <p className="text-gray-600">
                  Here's what's happening with your studies today.
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <QuickStats stats={stats} />
          
          {/* User Profile Section */}
          {user && <UserProfileSection />}
          
          {/* Dashboard Tasks */}
          <DashTasks />
        </div>
      );
    }

    // Render lazy-loaded components with Suspense
    return (
      <Suspense fallback={<LoadingSpinner text={`Loading ${activeTitle}...`} />}>
        {activeComponent === 'tasks' && <TasksComponent />}
        
        {activeComponent === 'study-materials' && <StudyMaterialsComponent />}
        
        {activeComponent === 'ask-ai' && <AIStudyAssistant />}
        
      </Suspense>
    );
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner text="Authenticating..." />
      </div>
    );
  }

  // Don't render dashboard if not authenticated (user will be redirected)
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
          <h2 className="text-xl font-bold text-white">StudyHub</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-500/20"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          {menuData.map((menu) => {
            const IconComponent = menu.icon;
            const isMenuActive = isActive(menu.component);

            return (
              <div key={menu.id} className="mb-1">
                <button
                  onClick={() => selectComponent(menu.component, menu.title)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 group ${
                    isMenuActive 
                      ? 'bg-blue-50 text-blue-700 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent 
                    size={20} 
                    className={`mr-3 ${isMenuActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} 
                  />
                  <div>
                    <span className="font-medium">{menu.title}</span>
                    <p className="text-xs text-gray-500 mt-0.5 leading-tight">{menu.description}</p>
                  </div>
                </button>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 mr-4"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{activeTitle}</h1>
                <p className="text-sm text-gray-500">
                  {menuData.find(m => m.component === activeComponent)?.description}
                </p>
              </div>
            </div>
            
            {/* Top Right Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Button */}
              <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <Search size={20} />
              </button>
              
              {/* Notifications */}
              <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="hidden md:block font-medium text-gray-700 text-sm">
                    {user?.name || user?.fullName}
                  </span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>
                
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name || user?.fullName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        selectComponent("settings", "Settings");
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Settings size={16} className="mr-3" />
                      Account Settings
                    </button>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={() => {
                          handleLogout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut size={16} className="mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderActiveComponent()}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}