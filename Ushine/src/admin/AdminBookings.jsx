import React, { useEffect, useState } from "react";
import { api } from "./AuthContext";
import {
  Search,
  Filter,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Check,
  X,
  Clock,
  Download,
  Calendar,
  Phone,
  Mail,
  MessageSquare
} from "lucide-react";

export default function AdminBookings() {
  // Data state
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [limit] = useState(10);

  // Filter & search states
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // UI States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(null); // ID of booking being updated
  const [selectedBooking, setSelectedBooking] = useState(null); // For detail modal
  const [deleteConfirmId, setDeleteConfirmId] = useState(null); // For delete modal

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      let url = `/admin/bookings?page=${page}&limit=${limit}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (categoryFilter) url += `&category=${categoryFilter}`;

      const response = await api.get(url);
      if (response.data?.success) {
        setBookings(response.data.data.bookings || []);
        const pag = response.data.data.pagination;
        setPage(pag.page);
        setTotalPages(pag.totalPages);
        setTotalBookings(pag.totalBookings);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, statusFilter, categoryFilter]);

  // Handle status update
  const handleStatusChange = async (id, newStatus) => {
    setStatusUpdating(id);
    try {
      const response = await api.patch(`/admin/bookings/${id}/status`, { status: newStatus });
      if (response.data?.success) {
        // Update local state
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
        );
        if (selectedBooking && selectedBooking._id === id) {
          setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setStatusUpdating(null);
    }
  };

  // Handle delete booking
  const handleDeleteBooking = async (id) => {
    try {
      const response = await api.delete(`/admin/bookings/${id}`);
      if (response.data?.success) {
        // Refresh bookings
        fetchBookings();
        setDeleteConfirmId(null);
        if (selectedBooking?._id === id) setSelectedBooking(null);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete booking.");
    }
  };

  // Reset Filters
  const resetFilters = () => {
    setStatusFilter("");
    setCategoryFilter("");
    setSearchTerm("");
    setPage(1);
  };

  // Filter bookings locally by search term (name, email, phone)
  const filteredBookings = bookings.filter((b) => {
    const term = searchTerm.toLowerCase();
    return (
      b.username.toLowerCase().includes(term) ||
      b.email.toLowerCase().includes(term) ||
      String(b.phone_no).includes(term)
    );
  });

  // Export to CSV utility
  const exportToCSV = () => {
    if (filteredBookings.length === 0) return;
    const headers = ["Username", "Email", "Phone", "Category", "Date/Time", "Status", "Message"];
    const rows = filteredBookings.map((b) => [
      b.username,
      b.email,
      b.phone_no,
      b.category,
      new Date(b.date).toLocaleString(),
      b.status,
      b.message || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ushine_bookings_page_${page}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header and Export Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-slate-400 text-sm">
            Total {totalBookings} appointments registered.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            disabled={filteredBookings.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={fetchBookings}
            className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-sm">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none w-5 h-5 my-auto" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client name, email or phone..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-950/50 hover:bg-slate-950/80 focus:bg-slate-950 border border-slate-800/80 focus:border-violet-500/80 rounded-xl text-slate-200 placeholder-slate-600 outline-none transition-all duration-300 text-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3.5 py-2.5 bg-slate-950/50 border border-slate-800/80 rounded-xl text-slate-300 outline-none focus:border-violet-500 appearance-none text-sm cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
          </select>
          <span className="absolute right-3.5 inset-y-0 flex items-center text-slate-500 pointer-events-none text-xs">
            ▼
          </span>
        </div>

        {/* Category Filter */}
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-950/50 border border-slate-800/80 rounded-xl text-slate-300 outline-none focus:border-violet-500 appearance-none text-sm cursor-pointer"
            >
              <option value="">All Services</option>
              <option value="haircut">Haircut</option>
              <option value="color">Color</option>
              <option value="treatment">Treatment</option>
              <option value="other">Other</option>
            </select>
            <span className="absolute right-3.5 inset-y-0 flex items-center text-slate-500 pointer-events-none text-xs">
              ▼
            </span>
          </div>

          {(statusFilter || categoryFilter || searchTerm) && (
            <button
              onClick={resetFilters}
              className="px-3 bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 hover:text-violet-300 border border-violet-500/20 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden shadow-md backdrop-blur-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
              <p className="text-slate-500 text-xs">Retrieving database bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Filter className="w-10 h-10 text-slate-700 mb-3.5" />
              <p className="text-slate-400 font-semibold">No bookings found</p>
              <p className="text-xs text-slate-600 mt-1">Try relaxing filters or search terms.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/20 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm">
                {filteredBookings.map((booking) => {
                  const dateObj = new Date(booking.date);
                  const formattedDate = dateObj.toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const formattedTime = dateObj.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={booking._id}
                      className="hover:bg-slate-800/20 transition-colors group/row"
                    >
                      {/* Customer Info */}
                      <td className="px-6 py-4.5">
                        <div className="font-semibold text-slate-200">
                          {booking.username}
                        </div>
                        <div className="text-xs text-slate-500 flex flex-col gap-0.5 mt-1">
                          <span>{booking.email}</span>
                          <span>{booking.phone_no}</span>
                        </div>
                      </td>

                      {/* Service Category */}
                      <td className="px-6 py-4.5">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 uppercase tracking-wider">
                          {booking.category}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="px-6 py-4.5 text-slate-300">
                        <div className="font-medium">{formattedDate}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{formattedTime}</div>
                      </td>

                      {/* Status Selector */}
                      <td className="px-6 py-4.5">
                        <div className="relative inline-block text-left">
                          <select
                            disabled={statusUpdating === booking._id}
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider outline-none border cursor-pointer select-none appearance-none pr-8 ${
                              booking.status === "confirmed"
                                ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                                : booking.status === "completed"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            } disabled:opacity-50`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                          </select>
                          <span className="absolute right-2.5 top-2.5 pointer-events-none text-[8px] text-slate-500">
                            ▼
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4.5 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-950/40 hover:bg-slate-800 border border-slate-800/80 rounded-xl transition-all duration-300 cursor-pointer"
                          >
                            <Eye className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(booking._id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 bg-slate-950/40 hover:bg-rose-500/10 border border-slate-800/80 rounded-xl transition-all duration-300 cursor-pointer"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {!loading && filteredBookings.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/10">
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredBookings.length} of {totalBookings} bookings
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage(prev => prev - 1)}
                className="p-1.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
              >
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>
              <span className="text-xs font-semibold px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(prev => prev + 1)}
                className="p-1.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
              >
                <ChevronRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL DRAWER */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4.5 mb-5">
              <h3 className="text-lg font-bold text-white">Booking Details</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 text-sm">
              {/* Customer */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Client Name</p>
                  <p className="text-base font-bold text-slate-200 mt-0.5">{selectedBooking.username}</p>
                </div>
              </div>

              {/* Grid Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Email</p>
                    <p className="text-sm font-semibold text-slate-300 mt-0.5 truncate">{selectedBooking.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-semibold text-slate-300 mt-0.5">{selectedBooking.phone_no}</p>
                  </div>
                </div>
              </div>

              {/* Service & Date Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Appointment Date</p>
                    <p className="text-sm font-semibold text-slate-300 mt-0.5">
                      {new Date(selectedBooking.date).toLocaleDateString([], {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      at {new Date(selectedBooking.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Category</p>
                    <p className="text-sm font-semibold text-slate-300 mt-1 uppercase tracking-wider">
                      {selectedBooking.category}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes Message */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-800 text-slate-400 shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Notes / Message</p>
                  <div className="bg-slate-950/60 p-4.5 rounded-2xl border border-slate-850 mt-1.5 max-h-36 overflow-y-auto text-slate-300 leading-relaxed italic">
                    {selectedBooking.message ? `"${selectedBooking.message}"` : "No special instructions provided."}
                  </div>
                </div>
              </div>

              {/* Status Update Quick Bar */}
              <div className="pt-4.5 border-t border-slate-850">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Update Status</p>
                <div className="flex items-center gap-2">
                  {["pending", "confirmed", "completed"].map((stat) => (
                    <button
                      key={stat}
                      onClick={() => handleStatusChange(selectedBooking._id, stat)}
                      disabled={statusUpdating === selectedBooking._id}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-300 cursor-pointer ${
                        selectedBooking.status === stat
                          ? stat === "confirmed"
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : stat === "completed"
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-amber-600 text-white border-amber-600"
                          : "bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {stat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-805/80 rounded-2xl p-6 shadow-2xl text-center">
            <Trash2 className="w-10 h-10 text-rose-500 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-200">Delete Appointment</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Are you sure you want to permanently delete this booking? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBooking(deleteConfirmId)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl text-xs transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
