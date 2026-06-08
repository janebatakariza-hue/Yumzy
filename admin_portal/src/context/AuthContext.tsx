import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authAPI, type AuthUser, getErrorMessage } from "../api";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(authAPI.getCurrentUser());
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    if (!authAPI.isLoggedIn()) {
      setUser(null);
      return;
    }
    try {
      const res = await authAPI.getProfile();
      const profile = res.data || res.user || res;
      setUser(profile);
      localStorage.setItem("yumzy_admin_user", JSON.stringify(profile));
    } catch {
      setUser(authAPI.getCurrentUser());
    }
  };

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
    if (res.user?.role !== "admin") {
      await authAPI.logout();
      throw new Error("Access denied. Admin account required.");
    }
    setUser(res.user);
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { getErrorMessage };
