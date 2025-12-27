import * as React from 'react';
import { useSession, signOut } from 'next-auth/react';
// REMOVED: Heavy import causing slow compile
// import { useEmployeeStore } from '../features/employees/store';
import type { Employee } from '@/lib/types/prisma-extended';
import { loadGeneralSettings, clearGeneralSettingsCache } from '../lib/settings-cache';

interface User {
  systemId: string;
  email: string;
  fullName?: string;
  name?: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF' | 'admin' | 'user';
  employeeId?: string;
  employee?: Employee;
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
  isLoading: boolean;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

// In-memory user cache
let cachedUser: User | null = null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  // REMOVED: Heavy store import - use employee from session instead
  // const { data: employees } = useEmployeeStore();
  const [user, setUser] = React.useState<User | null>(cachedUser);
  const isLoading = status === 'loading';

  // Load general settings when authenticated
  React.useEffect(() => {
    if (status === 'authenticated') {
      // Load settings from database into cache
      loadGeneralSettings().catch(console.error);
    } else if (status === 'unauthenticated') {
      // Clear settings cache on logout
      clearGeneralSettingsCache();
    }
  }, [status]);

  // Sync user from NextAuth session
  React.useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const sessionUser = session.user as any;
      const userObj: User = {
        systemId: sessionUser.id || sessionUser.systemId || '',
        email: sessionUser.email || '',
        fullName: sessionUser.name,
        name: sessionUser.name || sessionUser.email,
        role: sessionUser.role || 'STAFF',
        employeeId: sessionUser.employeeId,
        employee: sessionUser.employee,
      };
      cachedUser = userObj;
      setUser(userObj);
    } else if (status === 'unauthenticated') {
      cachedUser = null;
      setUser(null);
    }
  }, [session, status]);

  // Find employee based on email or employeeId
  // SIMPLIFIED: Use employee from session directly instead of store lookup
  const employee = React.useMemo(() => {
    if (!user) return null;
    
    // Use employee from user data if available (from NextAuth session)
    if (user.employee) return user.employee as Employee;
    
    // Return null - employee lookup should be done by components that need it
    return null;
  }, [user]);

  // Logout via NextAuth
  const logout = React.useCallback(async () => {
    try {
      await signOut({ redirect: false });
      cachedUser = null;
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  // Refresh user - just trigger session refresh
  const refreshUser = React.useCallback(async () => {
    // NextAuth session will be refreshed automatically
    // This is a no-op placeholder for compatibility
  }, []);

  const updateUser = React.useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      cachedUser = updated;
      return updated;
    });
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      employee,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN' || user?.role === 'admin',
      isLoading,
      logout,
      updateUser,
      refreshUser,
    }),
    [user, employee, isLoading, logout, updateUser, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    // Development warning
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.warn('useAuth must be used within AuthProvider - returning default values');
    }
    // Return safe defaults instead of throwing
    return {
      user: null,
      employee: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: true,
      logout: async () => {},
      updateUser: () => {},
      refreshUser: async () => {},
    };
  }
  return context;
}

// Helper to get current user systemId for store tracking
// NOTE: This is now async-first, but provides sync fallback for backwards compat
export function getCurrentUserInfo(): CurrentUserInfo {
  // Use cached user if available
  if (cachedUser) {
    return {
      systemId: cachedUser.employeeId || cachedUser.systemId || 'SYSTEM',
      name: cachedUser.fullName || cachedUser.name || 'Hệ thống',
      email: cachedUser.email,
      role: cachedUser.role,
    };
  }
  return { systemId: 'SYSTEM', name: 'Hệ thống' };
}

export function getCurrentUserSystemId(): string {
  return getCurrentUserInfo().systemId;
}

export function getCurrentUserName(): string {
  return getCurrentUserInfo().name;
}
