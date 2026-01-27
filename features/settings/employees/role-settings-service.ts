/**
 * Role Settings Service
 * 
 * Service layer for accessing role settings from Prisma database.
 * Compatible with the existing CustomRole interface used in employee-roles-page.tsx
 */

import { DEFAULT_ROLE_PERMISSIONS, type Permission } from '../../employees/permissions';

export interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isDefault: boolean;
}

// Default roles (fallback when API fails or no data in DB)
const DEFAULT_ROLES: CustomRole[] = [
  { id: 'Admin', name: 'Quản trị viên', description: 'Toàn quyền hệ thống', permissions: DEFAULT_ROLE_PERMISSIONS.Admin, isDefault: true },
  { id: 'Manager', name: 'Quản lý', description: 'Quản lý phòng ban', permissions: DEFAULT_ROLE_PERMISSIONS.Manager, isDefault: true },
  { id: 'Sales', name: 'Kinh doanh', description: 'Nhân viên kinh doanh', permissions: DEFAULT_ROLE_PERMISSIONS.Sales, isDefault: true },
  { id: 'Warehouse', name: 'Kho', description: 'Nhân viên kho', permissions: DEFAULT_ROLE_PERMISSIONS.Warehouse, isDefault: true },
];

const API_ENDPOINT = '/api/settings/roles';

export async function fetchRoleSettings(): Promise<CustomRole[]> {
  try {
    const response = await fetch(API_ENDPOINT);
    if (!response.ok) {
      console.warn('[RoleService] API not available, using defaults');
      return DEFAULT_ROLES;
    }
    const result = await response.json();
    return result.data ?? DEFAULT_ROLES;
  } catch (error) {
    console.error('[RoleService] Failed to fetch roles:', error);
    return DEFAULT_ROLES;
  }
}

export async function saveRoleSettings(roles: CustomRole[]): Promise<CustomRole[]> {
  const response = await fetch(API_ENDPOINT, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roles }),
  });
  if (!response.ok) {
    throw new Error(`Failed to save role settings: ${response.statusText}`);
  }
  const result = await response.json();
  return result.data ?? roles;
}

// In-memory cache
let rolesCache: CustomRole[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000;

export async function getRoleSettings(): Promise<CustomRole[]> {
  const now = Date.now();
  if (rolesCache && (now - cacheTimestamp) < CACHE_TTL) {
    return rolesCache;
  }
  
  const data = await fetchRoleSettings();
  rolesCache = data;
  cacheTimestamp = now;
  return data;
}

export function getRoleSettingsSync(): CustomRole[] {
  return rolesCache ?? DEFAULT_ROLES;
}

export function invalidateRolesCache(): void {
  rolesCache = null;
  cacheTimestamp = 0;
}

export function updateRolesCache(roles: CustomRole[]): void {
  rolesCache = roles;
  cacheTimestamp = Date.now();
}

export { DEFAULT_ROLES };
