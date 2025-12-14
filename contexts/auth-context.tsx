import * as React from 'react';
import { useEmployeeStore } from '../features/employees/store';
import type { Employee } from '../features/employees/types';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'user';
  employeeId?: string; // Link to Employee systemId
  verified?: boolean;
}

interface CurrentUserInfo {
  systemId: string;
  name: string;
  email?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  employee: Employee | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: employees } = useEmployeeStore();
  const [user, setUser] = React.useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // Find employee based on email or employeeId
  const employee = React.useMemo(() => {
    if (!user) return null;
    
    // First try by employeeId
    if (user.employeeId) {
      const emp = employees.find(e => e.systemId === user.employeeId);
      if (emp) return emp;
    }
    
    // Then try by email
    const emp = employees.find(e => 
      e.workEmail?.toLowerCase() === user.email.toLowerCase() ||
      e.personalEmail?.toLowerCase() === user.email.toLowerCase()
    );
    
    // Auto-link employee if found
    if (emp && !user.employeeId) {
      const updatedUser = { ...user, employeeId: emp.systemId };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return emp;
    }
    
    return emp || null;
  }, [user, employees]);

  const login = React.useCallback((newUser: User) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  }, []);

  const logout = React.useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const updateUser = React.useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      employee,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login,
      logout,
      updateUser,
    }),
    [user, employee, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    // Development warning
    if (import.meta.env.DEV) {
      console.warn('useAuth must be used within AuthProvider - returning default values');
    }
    // Return safe defaults instead of throwing
    return {
      user: null,
      employee: null,
      isAuthenticated: false,
      isAdmin: false,
      login: () => {},
      logout: () => {},
      updateUser: () => {},
    };
  }
  return context;
}

// Helper to get current user systemId for store tracking
export function getCurrentUserInfo(): CurrentUserInfo {
  try {
    const stored = localStorage.getItem('user');
    if (!stored) {
      return { systemId: 'SYSTEM', name: 'Hệ thống' };
    }
    const user = JSON.parse(stored);
    return {
      systemId: user.employeeId || 'SYSTEM',
      name: user.name || 'Hệ thống',
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error('Không thể đọc thông tin user hiện tại:', error);
    return { systemId: 'SYSTEM', name: 'Hệ thống' };
  }
}

export function getCurrentUserSystemId(): string {
  return getCurrentUserInfo().systemId;
}

export function getCurrentUserName(): string {
  return getCurrentUserInfo().name;
}
