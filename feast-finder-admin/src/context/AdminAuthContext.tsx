import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminUser {
  id: string;
  name: string;
  role: string;
  level: number;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  hasLevel: (level: number) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>({
    id: "1",
    name: "Admin User",
    role: "super_admin",
    level: 4
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string, role: string = "admin") => {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 500));
    const level = role === "super_admin" ? 4 : role === "admin" ? 3 : 1;
    setUser({
      id: Math.random().toString(36).slice(2, 8),
      name: email.split("@")[0] || "Admin",
      role,
      level,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const hasLevel = (level: number) => {
    return (user?.level || 0) >= level;
  };

  return (
    <AdminAuthContext.Provider value={{ user, isLoading, login, logout, hasLevel }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
