"use client";

import { useState } from "react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");

  const navigationItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Subjects", icon: "📚" },
    { name: "Progress", icon: "📈" },
    { name: "Settings", icon: "⚙️" },
  ];

  return (
    <aside
      className={`h-screen flex flex-col shadow-sm transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      style={{ backgroundColor: "#E3F2FD" }}
    >
      {/* Top section - Logo and collapse toggle */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-bold" style={{ color: "#212121" }}></h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-full hover:bg-white/50 transition-colors duration-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isCollapsed ? "rotate-180" : ""
              }`}
              style={{ color: "#212121" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Middle section - Navigation items */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <div key={item.name} className="relative group">
              <button
                onClick={() => setActiveItem(item.name)}
                className={`w-full flex items-center px-3 py-3 rounded-2xl font-medium transition-all duration-200 hover:scale-105 ${
                  activeItem === item.name
                    ? "text-white shadow-md"
                    : "text-gray-700 hover:bg-white/50"
                }`}
                style={{
                  backgroundColor:
                    activeItem === item.name ? "#1976D2" : "transparent",
                }}
                aria-label={item.name}
              >
                <span className="text-lg">{item.icon}</span>
                {!isCollapsed && (
                  <span className="ml-3 text-sm">{item.name}</span>
                )}
              </button>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom section - Logout */}
      <div className="p-4 border-t border-white/20">
        <div className="relative group">
          <button
            className="w-full flex items-center px-3 py-3 rounded-2xl font-medium transition-all duration-200 hover:scale-105 hover:bg-red-50"
            style={{ color: "#D32F2F" }}
            aria-label="Logout"
          >
            <span className="text-lg">🚪</span>
            {!isCollapsed && <span className="ml-3 text-sm">Logout</span>}
          </button>

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
