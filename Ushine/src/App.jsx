import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Hero } from "./components/heroPage/heroPage";
import { Services } from "./components/Services/Services";
import { Gallery } from "./components/Gallery/Gallery";
import { About } from "./components/About/About";
import { Contact } from "./components/Contact/Contact";
import { Footer } from "./components/Footer/footer";

// Admin Imports
import { AuthProvider, useAuth } from "./admin/AuthContext";
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import AdminRegister from "./admin/AdminRegister";
import AdminDashboard from "./admin/AdminDashboard";
import AdminBookings from "./admin/AdminBookings";
import AdminSettings from "./admin/AdminSettings";

const LandingPage = () => {
  return (
    <>
      <Hero />
      <Services />
      <Gallery />
      <About />
      <Contact />
      <Footer />
    </>
  );
};

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-slate-400">
        <div className="w-8 h-8 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
        <span className="text-xs">Verifying administrative session...</span>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Client Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* Protected Admin Dashboard Layout & Subroutes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Redirect any unresolved path to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}