import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Sparkles, Mail, Lock, User, AlertCircle, Loader } from "lucide-react";

export default function AdminLogin() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();

  const [inputVal, setInputVal] = useState(""); // Can be username or gmail
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (admin) {
      navigate("/admin");
    }
  }, [admin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setLoading(true);

    // Determine if input is email or username
    const isEmail = inputVal.includes("@");
    const username = isEmail ? "" : inputVal;
    const gmail = isEmail ? inputVal : "";

    try {
      await login(username, gmail, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Header Logo & Text */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4 animate-bounce">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Admin Portal
          </h2>
          <p className="text-sm text-slate-400 mt-1.5">
            Sign in to manage your appointments & bookings
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5.5">
          {/* Email / Username Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Username or Gmail
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                {inputVal.includes("@") ? (
                  <Mail className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="admin or admin@ushine.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/50 hover:bg-slate-950/80 focus:bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl text-slate-200 placeholder-slate-600 outline-none transition-all duration-300 text-sm"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/50 hover:bg-slate-950/80 focus:bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl text-slate-200 placeholder-slate-600 outline-none transition-all duration-300 text-sm"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-300 disabled:opacity-50 cursor-pointer text-sm"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Setup / Register Link */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-500">
            First time setting up?{" "}
            <Link
              to="/admin/register"
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Register Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
