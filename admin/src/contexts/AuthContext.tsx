import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const isAuthed = () => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("frugoo_auth") === "true";
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string; role: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
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
    // Return a promise since it's async now, but since the previous interface was sync `boolean`,
    // we should let the caller handle it or update the interface. Wait, `admin/src/pages/Login.tsx` does:
    // `const success = login(email, password);`
    // We can't change it to async without breaking it. We need to update Login.tsx as well!
    return fetch('https://frugoo.onrender.com/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setIsAuthenticated(true);
        setUser(data.user);
        localStorage.setItem("frugoo_auth", "true");
        return true;
      }
      return false;
    })
    .catch(() => false);
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
