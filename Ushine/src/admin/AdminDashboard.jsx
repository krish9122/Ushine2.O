import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "./AuthContext";
import {
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  ClipboardList,
  RefreshCw,
  ChevronRight,
  Sparkles,
  AlertCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError("");
    try {
      const response = await api.get("/admin/dashboard");
      if (response.data?.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard stats. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Loading dashboard analytics...</p>
      </div>
    );
  }

  // Fallbacks & Defaults
  const totalBookings = stats?.totalBookings || 0;
  const statusCounts = {
    pending: stats?.bookingsByStatus?.pending || 0,
    confirmed: stats?.bookingsByStatus?.confirmed || 0,
    completed: stats?.bookingsByStatus?.completed || 0,
  };
  const todaysBookings = stats?.todaysBookings || [];

  // Data for Charts
  const pieData = [
    { name: "Pending", value: statusCounts.pending, color: "#f59e0b" }, // Amber
    { name: "Confirmed", value: statusCounts.confirmed, color: "#6366f1" }, // Indigo
    { name: "Completed", value: statusCounts.completed, color: "#10b981" }, // Emerald
  ].filter(d => d.value > 0);

  // Group by category for bar chart preview (client categories)
  // Let's count categories in today's bookings or set standard default counts based on mock/total if category stats are not grouped by backend.
  // Wait, let's group today's bookings or any bookings by category to make a cool category bar chart!
  const categoryCounts = todaysBookings.reduce((acc, b) => {
    const cat = b.category || "other";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.keys(categoryCounts).map(cat => ({
    category: cat.toUpperCase(),
    appointments: categoryCounts[cat]
  }));

  // If no category counts exist today, fall back to showing a nice mock/empty distribution just for UI showcase, or standard categories
  const barChartData = barData.length > 0 ? barData : [
    { category: "HAIRCUT", appointments: 0 },
    { category: "COLOR", appointments: 0 },
    { category: "TREATMENT", appointments: 0 },
    { category: "OTHER", appointments: 0 },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Header and Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Welcome Back <Sparkles className="w-5 h-5 text-violet-400" />
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Here's what's happening with Ushine bookings today.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="self-start flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-violet-400" : ""}`} />
          <span>{refreshing ? "Refreshing..." : "Refresh Stats"}</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Bookings Card */}
        <div className="group relative bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700/80 transition-all duration-300 shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Bookings
              </p>
              <h3 className="text-3xl font-extrabold text-white mt-2 group-hover:scale-105 transition-transform duration-300 origin-left">
                {totalBookings}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 text-slate-400 group-hover:text-white transition-colors">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">Live</span>
            <span>database count</span>
          </div>
        </div>

        {/* Confirmed Bookings Card */}
        <div className="group relative bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300 shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Confirmed
              </p>
              <h3 className="text-3xl font-extrabold text-indigo-400 mt-2 group-hover:scale-105 transition-transform duration-300 origin-left">
                {statusCounts.confirmed}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400">
            <span>Ready for appointments</span>
          </div>
        </div>

        {/* Pending Bookings Card */}
        <div className="group relative bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300 shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pending Approval
              </p>
              <h3 className="text-3xl font-extrabold text-amber-400 mt-2 group-hover:scale-105 transition-transform duration-300 origin-left">
                {statusCounts.pending}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400">
            <span>Needs attention</span>
          </div>
        </div>

        {/* Completed Bookings Card */}
        <div className="group relative bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Completed
              </p>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-2 group-hover:scale-105 transition-transform duration-300 origin-left">
                {statusCounts.completed}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400">
            <span>Successfully served</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Graphs & Today Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Today's Schedule Timeline (Takes 2 columns on lg screens) */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm rounded-2xl p-6 flex flex-col shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-violet-400" />
              <span>Today's Schedule</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                {todaysBookings.length}
              </span>
            </h3>
            <Link
              to="/admin/bookings"
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-0.5 group transition-colors"
            >
              <span>View All Bookings</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[420px] pr-2 space-y-4">
            {todaysBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="w-12 h-12 text-slate-700 mb-3" />
                <p className="text-slate-400 font-medium">No bookings scheduled for today.</p>
                <p className="text-xs text-slate-600 mt-1">Bookings registered today will show up here.</p>
              </div>
            ) : (
              <div className="relative pl-6 border-l border-slate-800 space-y-6 py-2">
                {todaysBookings.map((booking) => {
                  const bookingTime = new Date(booking.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <div key={booking._id} className="relative group/item">
                      {/* Timeline Dot */}
                      <span className={`absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 bg-slate-700 group-hover/item:scale-125 transition-transform ${
                        booking.status === "confirmed" ? "bg-indigo-500" :
                        booking.status === "completed" ? "bg-emerald-500" : "bg-amber-500"
                      }`} />

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-slate-950/40 rounded-xl border border-slate-800/60 hover:border-slate-700/80 transition-all duration-300">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm font-bold text-violet-300">{bookingTime}</span>
                            <span className="text-xs text-slate-500">•</span>
                            <h4 className="text-sm font-bold text-slate-200">{booking.username}</h4>
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              booking.status === "confirmed" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" :
                              booking.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                              "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          
                          {/* Message/Note excerpt */}
                          {booking.message && (
                            <p className="text-xs text-slate-400 mt-2 line-clamp-1 italic bg-slate-950/50 p-2 rounded-lg border border-slate-900/50">
                              "{booking.message}"
                            </p>
                          )}
                        </div>

                        {/* Booking Details / Category */}
                        <div className="flex items-center gap-4 self-start md:self-center shrink-0">
                          <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 uppercase tracking-wider">
                            {booking.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Breakdown Analytics Column */}
        <div className="space-y-6">
          {/* Status Breakdown (Pie Chart) */}
          <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-4 mb-4">
              Status Breakdown
            </h3>
            <div className="h-60 w-full">
              {pieData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                  No data to display
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: "12px",
                        color: "#f8fafc",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span className="text-xs text-slate-400 font-medium px-1">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Today's Popularity (Bar Chart) */}
          <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-4 mb-4">
              Today's Services
            </h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <XAxis
                    dataKey="category"
                    tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#94a3b8", fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      color: "#f8fafc",
                    }}
                  />
                  <Bar dataKey="appointments" fill="url(#barGradient)" radius={[4, 4, 0, 0]}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#4f46e5" />
                      </linearGradient>
                    </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
