import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const DashboardLayout = ({ children }) => {
  const { user, clearUser } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Admin navigation items
  const adminNavItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/tasks", label: "Manage Tasks", icon: "✅" },
    { path: "/admin/create-task", label: "Create Task", icon: "➕" },
    { path: "/admin/users", label: "Team Members", icon: "👥" },
  ];

  // User navigation items
  const userNavItems = [
    { path: "/users/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/users/my-tasks", label: "My Tasks", icon: "✅" },
  ];

  const navItems = user?.role === "admin" ? adminNavItems : userNavItems;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-3">
              {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-2 capitalize">
              {user?.role || "user"}
            </span>
            <p className="font-semibold text-gray-800 text-lg">
              {user?.name || "User"}
            </p>
            <p className="text-sm text-gray-500">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors relative ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {isActive(item.path) && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l"></div>
                  )}
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-xl">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
