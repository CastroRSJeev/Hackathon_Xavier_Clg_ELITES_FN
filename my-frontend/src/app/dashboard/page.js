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
  Clock
} from "lucide-react";
import DashTasks from "@/components/DashTasks";



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
  {
    id: 5,
    title: "Settings",
    component: "settings",
    icon: Settings,
    description: "Customize your preferences"
  }
];

// Loading component with better styling
const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
      </div>
      <p className="text-gray-600 font-medium">{text}</p>
    </div>
  </div>
);

// Error component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
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

  

  // User profile section
  const UserProfileSection = () => (
    <div className="border-t pt-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/30 to-blue-200/30 rounded-full translate-y-6 -translate-x-6"></div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                Welcome back, {user?.name || user?.fullName || 'Scholar'}! 👋
              </h3>
              <p className="text-gray-600 text-sm">
                Here's your learning profile at a glance
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/50 shadow-sm">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                  <User size={16} className="text-white" />
                </div>
                <h4 className="font-semibold text-gray-800">Personal Details</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm w-16">Name:</span>
                  <span className="text-gray-800 font-medium">{user?.name || user?.fullName || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm w-16">Email:</span>
                  <span className="text-gray-800 font-medium text-sm">{user?.email || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            {/* Academic Info Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/50 shadow-sm">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Award size={16} className="text-white" />
                </div>
                <h4 className="font-semibold text-gray-800">Academic Info</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm w-16">Role:</span>
                  <span className="text-gray-800 font-medium">{user?.role || "Student"}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm w-16">Dept:</span>
                  <span className="text-gray-800 font-medium">{user?.department || "N/A"}</span>
                </div>
                {user?.id && (
                  <div className="flex items-center">
                    <span className="text-gray-500 text-sm w-16">ID:</span>
                    <span className="text-gray-800 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {user.id}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
         
          
          <DashTasks />
        </div>
      </div>
    </div>
  );

  // Render the active component
  const renderActiveComponent = () => {
    if (activeComponent === "dashboard") {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Error Display */}
            {error && (
              <ErrorMessage 
                message={error} 
                onRetry={clearError}
              />
            )}

            {/* Welcome Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome back, {user?.name || user?.fullName || 'User'}! 👋
              </h2>
              <p className="text-gray-600">
                Here's what's happening with your studies today.
              </p>
            </div>

         
            
            {/* User Profile Section */}
            {user && <UserProfileSection />}
          </div>
        </div>
      );
    }

    // Render lazy-loaded components with Suspense
    return (
      <Suspense fallback={<LoadingSpinner text={`Loading ${activeTitle}...`} />}>
        {activeComponent === 'tasks' && <TasksComponent />}
        
        {activeComponent === 'study-materials' && <StudyMaterialsComponent />}
        
        {activeComponent === 'ask-ai' && <AskAIComponent />}
        
        {activeComponent === 'settings' && <SettingsComponent />}
      </Suspense>
    );
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner text="Authenticating..." />
      </div>
    );
  }

  // Don't render dashboard if not authenticated (user will be redirected)
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
          <h2 className="text-xl font-bold text-white">Study Hub</h2>
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
              <div key={menu.id} className="mb-2">
                <button
                  onClick={() => selectComponent(menu.component, menu.title)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 group ${
                    isMenuActive 
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center">
                    <IconComponent 
                      size={20} 
                      className={`mr-3 ${isMenuActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} 
                    />
                    <div>
                      <span className="font-medium">{menu.title}</span>
                      <p className="text-xs text-gray-500 mt-0.5">{menu.description}</p>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <User size={16} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{user?.name || user?.fullName}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
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
                <h1 className="text-2xl font-bold text-gray-800">{activeTitle}</h1>
                <p className="text-sm text-gray-500">
                  {menuData.find(m => m.component === activeComponent)?.description}
                </p>
              </div>
            </div>
            
            {/* Top Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <Search size={20} />
              </button>
              
              {/* Notifications */}
              <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="hidden md:block font-medium text-gray-700">
                    {user?.name || user?.fullName}
                  </span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>
                
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{user?.name || user?.fullName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        selectComponent("settings", "Settings");
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-left"
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
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
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
