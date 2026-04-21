/**
 * RBAC — Edge-safe permission resolver
 *
 * File này KHÔNG import prisma (hay bất kỳ module Node-only nào) để có thể
 * dùng an toàn trong middleware Edge runtime của Next.js.
 *
 * Dùng cho:
 * - `middleware.ts` (Edge runtime) khi JWT chưa có `permissions` embedded.
 * - Fallback nhanh khi không thể query DB.
 *
 * Nếu cần DB lookup (đúng custom role settings), dùng `resolvePermissions` ở
 * file `resolve-permissions.ts` (server-only, có prisma).
 */

import {
  DEFAULT_ROLE_PERMISSIONS,
  normalizeRole,
  type Permission,
} from '@/features/employees/permissions';

/**
 * Đồng bộ (không query DB): chỉ dùng DEFAULT_ROLE_PERMISSIONS theo role đã chuẩn hoá.
 *
 * Dùng trong middleware edge runtime hoặc khi đã có permissions trong JWT.
 */
export function resolvePermissionsSync(
  role: string | null | undefined,
): Permission[] {
  if (!role) return [];
  const normalized = normalizeRole(role);
  return DEFAULT_ROLE_PERMISSIONS[normalized] ?? [];
}
