'use client';

import * as React from 'react';
import { useSession, signOut } from 'next-auth/react';
// REMOVED: Heavy import causing slow compile
// import { useEmployeeStore } from '../features/employees/store';
import type { Employee } from '@/lib/types/prisma-extended';
import { loadGeneralSettings, clearGeneralSettingsCache } from '../lib/settings-cache';
import { logError } from '@/lib/logger'
import { hasPermission as checkPermission, type Permission, normalizeRole } from '@/features/employees/permissions';
import { useRoleSettings } from '@/features/settings/employees/hooks/use-role-settings';

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
  /** Check if current user has a specific permission */
  can: (permission: Permission) => boolean;
  /** Check if current user has ALL specified permissions */
  canAll: (permissions: Permission[]) => boolean;
  /** Check if current user has ANY of the specified permissions */
  canAny: (permissions: Permission[]) => boolean;
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
  // Also loading when session is authenticated but user state hasn't synced yet
  const isLoading = status === 'loading' || (status === 'authenticated' && !user);

  // Load general settings when authenticated
  React.useEffect(() => {
    if (status === 'authenticated') {
      // Load settings from database into cache
      loadGeneralSettings().catch(err => logError('Failed to load general settings', err));
    } else if (status === 'unauthenticated') {
      // Clear settings cache on logout
      clearGeneralSettingsCache();
    }
  }, [status]);

  // Sync user from NextAuth session
  React.useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const sessionUser = session.user as unknown as {
        id?: string;
        systemId?: string;
        email?: string | null;
        name?: string | null;
        role?: string;
        employeeId?: string;
        employee?: Employee;
      };
      const userObj: User = {
        systemId: sessionUser.id || sessionUser.systemId || '',
        email: sessionUser.email || '',
        fullName: sessionUser.name ?? undefined,
        name: sessionUser.name || sessionUser.email || undefined,
        role: (sessionUser.role || 'STAFF') as User['role'],
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
      logError('Logout error', error);
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

  // Load custom role permissions from settings
  const { data: customRoles } = useRoleSettings();

  // Employee.role stores the actual role ID ('Warehouse', 'Sales', etc.)
  // User.role is the UserRole enum (ADMIN/MANAGER/STAFF) — less granular
  // Prefer employee role for permission resolution
  const effectiveRole = user?.employee?.role as string || user?.role;

  // Resolve the current user's actual permissions (custom role > default)
  const userPermissions = React.useMemo<Permission[] | undefined>(() => {
    if (!effectiveRole) return undefined;
    const role = normalizeRole(effectiveRole);
    const matchedRole = customRoles?.find(r => r.id === role);
    return matchedRole?.permissions;
  }, [effectiveRole, customRoles]);

  // Permission check callbacks — use custom role permissions when available
  const can = React.useCallback((permission: Permission) => {
    if (!effectiveRole) return false;
    return checkPermission(effectiveRole, permission, userPermissions);
  }, [effectiveRole, userPermissions]);

  const canAll = React.useCallback((permissions: Permission[]) => {
    if (!effectiveRole) return false;
    return permissions.every(p => checkPermission(effectiveRole, p, userPermissions));
  }, [effectiveRole, userPermissions]);

  const canAny = React.useCallback((permissions: Permission[]) => {
    if (!effectiveRole) return false;
    return permissions.some(p => checkPermission(effectiveRole, p, userPermissions));
  }, [effectiveRole, userPermissions]);

  const value = React.useMemo(
    () => ({
      user,
      employee,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN' || user?.role === 'admin',
      isLoading,
      can,
      canAll,
      canAny,
      logout,
      updateUser,
      refreshUser,
    }),
    [user, employee, isLoading, can, canAll, canAny, logout, updateUser, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    // Development warning
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      // useAuth called outside AuthProvider
    }
    // Return safe defaults instead of throwing
    return {
      user: null,
      employee: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: true,
      can: () => false,
      canAll: () => false,
      canAny: () => false,
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
