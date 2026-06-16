import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const isAuthed = () => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("frugoo_auth") === "true";
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string; role: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

const DEMO_CREDENTIALS = { email: "admin@frugoo.com", password: "admin123" };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  // Hydrate from localStorage on client only (avoids SSR mismatch / crash)
  useEffect(() => {
    if (isAuthed()) {
      setIsAuthenticated(true);
      setUser({ name: "Frugoo Admin", email: "admin@frugoo.com", role: "Admin" });
    }
  }, []);

  const login = (email: string, password: string) => {
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setUser({ name: "Frugoo Admin", email, role: "Admin" });
      localStorage.setItem("frugoo_auth", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("frugoo_auth");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
