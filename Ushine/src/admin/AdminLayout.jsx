import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import {
  LayoutDashboard,
  CalendarRange,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Bell,
  Sparkles
} from "lucide-react";

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Bookings",
      path: "/admin/bookings",
      icon: CalendarRange,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/90 border-r border-slate-800/80 backdrop-blur-md flex flex-col transform transition-transform duration-300 lg:static lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand/Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80 bg-slate-950/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-violet-400 via-indigo-200 to-indigo-400 bg-clip-text text-transparent tracking-wide">
              Ushine Admin
            </span>
          </div>
          <button
            className="lg:hidden text-slate-400 hover:text-slate-200"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/10 text-violet-300 border-l-4 border-violet-500 shadow-md shadow-violet-950/10 font-semibold"
                    : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border-l-4 border-transparent"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? "text-violet-400" : "text-slate-400"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Account Profile */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/20">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center shadow-inner">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-200 truncate">
                {admin?.username || "Admin User"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {admin?.gmail || "admin@ushine.com"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 text-sm font-medium transition-colors duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Component */}
        <header className="h-16 bg-slate-900/60 border-b border-slate-800/80 backdrop-blur-md flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800/50"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              {navItems.find((item) => item.path === location.pathname)?.name ||
                "Admin Control Panel"}
            </h1>
          </div>

          {/* Header Action Items */}
          <div className="flex items-center gap-4">
            {/* Notifications Button */}
            <button className="relative text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-slate-800/50 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            </button>

            {/* Quick Profile Icon */}
            <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
              <span className="hidden sm:inline text-sm font-medium text-slate-300">
                {admin?.username || "Admin"}
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-sm">
                {(admin?.username || "A").charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
