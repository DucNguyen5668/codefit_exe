"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      if (api.isLoggedIn()) {
        const data = await api.getMe();
        setUser(data.user);
        localStorage.setItem("nutricore_user", JSON.stringify(data.user));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      api.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
    };

    initializeAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, phone) => {
    return api.register(name, email, password, phone);
  };

  const googleLogin = async (googleData) => {
    const data = await api.googleLogin(googleData);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("nutricore_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      googleLogin,
      logout,
      updateUser,
      isLoggedIn: !!user,
      isAdmin: user?.role === "admin"
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
