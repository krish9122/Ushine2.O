import React, { useState } from "react";
import { useAuth, api } from "./AuthContext";
import {
  User,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader,
  KeyRound,
  ShieldCheck
} from "lucide-react";

export default function AdminSettings() {
  const { admin, changeName } = useAuth();

  // Name Form State
  const [newAdminName, setNewAdminName] = useState(admin?.username || "");
  const [nameError, setNameError] = useState("");
  const [nameSuccess, setNameSuccess] = useState("");
  const [nameLoading, setNameLoading] = useState(false);

  // Password Form State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");
  const [passLoading, setPassLoading] = useState(false);

  // Handle Name update
  const handleNameUpdate = async (e) => {
    e.preventDefault();
    if (!newAdminName.trim()) {
      setNameError("Username cannot be empty.");
      return;
    }

    setNameError("");
    setNameSuccess("");
    setNameLoading(true);

    try {
      const response = await api.post("/admin/change-name", { newAdminName });
      if (response.data?.success) {
        changeName(newAdminName);
        setNameSuccess("Profile name updated successfully!");
      }
    } catch (err) {
      console.error(err);
      setNameError(err.response?.data?.message || "Failed to update profile name.");
    } finally {
      setNameLoading(false);
    }
  };

  // Handle Password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPassError("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError("New passwords do not match.");
      return;
    }

    setPassError("");
    setPassSuccess("");
    setPassLoading(true);

    try {
      const response = await api.post("/admin/change-password", {
        oldPassword,
        newPassword,
      });

      if (response.data?.success) {
        setPassSuccess("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error(err);
      setPassError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      <div>
        <p className="text-slate-400 text-sm mt-0.5">
          Manage your account configurations and system security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Name Settings */}
        <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm rounded-2xl p-6 flex flex-col shadow-md">
          <div className="flex items-center gap-2.5 border-b border-slate-850 pb-4 mb-5">
            <div className="p-2 bg-violet-600/10 text-violet-400 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Profile Settings</h3>
          </div>

          {nameError && (
            <div className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{nameError}</span>
            </div>
          )}

          {nameSuccess && (
            <div className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{nameSuccess}</span>
            </div>
          )}

          <form onSubmit={handleNameUpdate} className="space-y-4 flex-1 flex flex-col">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Administrator Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                  <User className="w-4.5 h-4.5" />
                </span>
                <input
                  type="text"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 hover:bg-slate-950/80 focus:bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl text-slate-200 placeholder-slate-600 outline-none transition-all duration-300 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-600 pointer-events-none">
                  <KeyRound className="w-4.5 h-4.5" />
                </span>
                <input
                  type="text"
                  value={admin?.gmail || ""}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/20 border border-slate-800/40 text-slate-500 rounded-xl text-sm select-none cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Email address is read-only for security.</p>
            </div>

            <div className="pt-4 mt-auto">
              <button
                type="submit"
                disabled={nameLoading}
                className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs shadow-md shadow-indigo-600/10 transition-all duration-300 disabled:opacity-50 cursor-pointer"
              >
                {nameLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-3.5 h-3.5 animate-spin" />
                    Saving Changes...
                  </span>
                ) : (
                  "Update Profile Name"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Settings */}
        <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-2.5 border-b border-slate-850 pb-4 mb-5">
            <div className="p-2 bg-indigo-600/10 text-indigo-400 rounded-xl">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Security Settings</h3>
          </div>

          {passError && (
            <div className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{passError}</span>
            </div>
          )}

          {passSuccess && (
            <div className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{passSuccess}</span>
            </div>
          )}

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Current Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                  <Lock className="w-4.5 h-4.5" />
                </span>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 hover:bg-slate-950/80 focus:bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl text-slate-200 placeholder-slate-600 outline-none transition-all duration-300 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                  <Lock className="w-4.5 h-4.5" />
                </span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 hover:bg-slate-950/80 focus:bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl text-slate-200 placeholder-slate-600 outline-none transition-all duration-300 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 hover:bg-slate-950/80 focus:bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl text-slate-200 placeholder-slate-600 outline-none transition-all duration-300 text-sm"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={passLoading}
                className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs shadow-md shadow-indigo-600/10 transition-all duration-300 disabled:opacity-50 cursor-pointer"
              >
                {passLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-3.5 h-3.5 animate-spin" />
                    Changing Password...
                  </span>
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
