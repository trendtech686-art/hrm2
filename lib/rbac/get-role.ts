/**
 * RBAC — Unified role resolution
 *
 * Một nguồn duy nhất cho logic lấy role:
 * - Ưu tiên `employee.role` (string, khớp RoleSetting.id — phân quyền nghiệp vụ chi tiết).
 * - Fallback `user.role` (enum UserRole — coarse-grained).
 *
 * Dùng ở cả middleware (edge), server handlers, và client (AuthContext) để
 * bảo đảm mọi nơi cùng 1 kết quả.
 */

import { normalizeRole } from '@/features/employees/permissions';
import type { EmployeeRole } from '@/features/employees/roles';

/**
 * Tối thiểu input shape — khớp session/JWT ở cả middleware và handler.
 */
export interface RoleSource {
  role?: string | null;
  employee?: {
    role?: string | null;
  } | null;
}

/**
 * Lấy role "effective" dùng cho permission check.
 *
 * Ưu tiên thứ tự:
 * 1. `employee.role` nếu có (phản ánh vai trò nghiệp vụ trong RoleSetting).
 * 2. `user.role` (enum UserRole hoặc string thô).
 *
 * @returns string role raw (chưa normalize) hoặc `null` nếu không có.
 */
export function getEffectiveRole(source: RoleSource | null | undefined): string | null {
  if (!source) return null;
  const employeeRole = source.employee?.role;
  if (employeeRole && typeof employeeRole === 'string' && employeeRole.trim() !== '') {
    return employeeRole;
  }
  const userRole = source.role;
  if (userRole && typeof userRole === 'string' && userRole.trim() !== '') {
    return userRole;
  }
  return null;
}

/**
 * Lấy role đã normalize về một trong 4 EmployeeRole chuẩn (Admin/Manager/Sales/Warehouse).
 *
 * Dùng khi cần mapping về tập DEFAULT_ROLE_PERMISSIONS.
 */
export function getNormalizedRole(source: RoleSource | null | undefined): EmployeeRole {
  const role = getEffectiveRole(source);
  return normalizeRole(role);
}

/**
 * True nếu effective role (sau normalize) là Admin.
 *
 * Chuẩn hoá mọi check `isAdmin` trong codebase: không còn so sánh trực tiếp
 * `user.role === 'ADMIN'` / `'Admin'` / `'admin'`.
 */
export function isAdminRole(source: RoleSource | null | undefined): boolean {
  return getNormalizedRole(source) === 'Admin';
}

/**
 * True nếu effective role là Admin hoặc Manager.
 */
export function isAdminOrManagerRole(source: RoleSource | null | undefined): boolean {
  const role = getNormalizedRole(source);
  return role === 'Admin' || role === 'Manager';
}
