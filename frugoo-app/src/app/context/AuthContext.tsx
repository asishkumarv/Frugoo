import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("frugoo_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("frugoo_user");
      }
    }

    // Create demo user if it doesn't exist
    const existingUsers = JSON.parse(localStorage.getItem("frugoo_users") || "[]");
    const demoExists = existingUsers.some((u: any) => u.email === "demo@frugoo.com");
    
    if (!demoExists) {
      const demoUser = {
        id: "demo-user-1",
        name: "Demo User",
        email: "demo@frugoo.com",
        phone: "+91 98765 43210",
        password: "demo123",
        createdAt: new Date().toISOString(),
      };
      existingUsers.push(demoUser);
      localStorage.setItem("frugoo_users", JSON.stringify(existingUsers));
    }
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      const data = await res.json();
      if (!data.success) return { success: false, error: data.error };
      setUser(data.user);
      localStorage.setItem("frugoo_user", JSON.stringify(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Registration failed" };
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!data.success) return { success: false, error: data.error };
      setUser(data.user);
      localStorage.setItem("frugoo_user", JSON.stringify(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Login failed" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("frugoo_user");
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem("frugoo_user", JSON.stringify(updatedUser));

    // Update in users list
    const existingUsers = JSON.parse(localStorage.getItem("frugoo_users") || "[]");
    const updatedUsers = existingUsers.map((u: any) =>
      u.id === user.id ? { ...u, ...data } : u
    );
    localStorage.setItem("frugoo_users", JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
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