import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

// Central API instance with credentials support for HTTP-only cookies
export const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load admin profile from localStorage on boot
  useEffect(() => {
    const savedAdmin = localStorage.getItem("ushine_admin");
    if (savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch (e) {
        localStorage.removeItem("ushine_admin");
      }
    }
    setLoading(false);
  }, []);

  // Handle login
  const login = async (username, gmail, password) => {
    const payload = {};
    if (username) payload.username = username;
    if (gmail) payload.gmail = gmail;
    payload.password = password;

    const response = await api.post("/admin/login", payload);
    if (response.data?.success) {
      const adminData = response.data.data.admin;
      setAdmin(adminData);
      localStorage.setItem("ushine_admin", JSON.stringify(adminData));
      return response.data;
    }
    throw new Error(response.data?.message || "Login failed");
  };

  // Handle logout
  const logout = async () => {
    try {
      await api.post("/admin/logout");
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setAdmin(null);
      localStorage.removeItem("ushine_admin");
    }
  };

  // Update local admin name in state and store
  const changeName = (newName) => {
    setAdmin((prev) => {
      if (!prev) return null;
      const updated = { ...prev, username: newName };
      localStorage.setItem("ushine_admin", JSON.stringify(updated));
      return updated;
    });
  };

  // Automatically clear session if API requests fail with 401 (Unauthorized)
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          setAdmin(null);
          localStorage.removeItem("ushine_admin");
        }
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, changeName, setAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
