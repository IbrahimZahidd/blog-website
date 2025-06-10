"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { User, AuthContextType } from "@/types";
import { useToast } from "./toast-context";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem("blogspace_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("blogspace_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const users = JSON.parse(localStorage.getItem("blogspace_users") || "[]");
      const foundUser = users.find((u: User) => u.email === email);

      if (!foundUser) {
        throw new Error("User not found");
      }

      const userData: User = {
        ...foundUser,
        updatedAt: new Date(),
      };

      setUser(userData);
      localStorage.setItem("blogspace_user", JSON.stringify(userData));
      addToast("Welcome back!", "success");
    } catch (error) {
      addToast("Invalid email or password", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const users = JSON.parse(localStorage.getItem("blogspace_users") || "[]");
      const existingUser = users.find((u: User) => u.email === email);

      if (existingUser) {
        throw new Error("User already exists");
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        bio: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      users.push(newUser);
      localStorage.setItem("blogspace_users", JSON.stringify(users));
      localStorage.setItem("blogspace_user", JSON.stringify(newUser));

      setUser(newUser);
      addToast("Account created successfully!", "success");
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Registration failed",
        "error"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("blogspace_user");
    addToast("Logged out successfully", "info");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
