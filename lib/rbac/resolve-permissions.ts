/**
 * RBAC — Permission resolver (SERVER-ONLY, dùng Prisma)
 *
 * Resolve danh sách permissions cho một role bằng cách:
 * 1. Thử lookup `RoleSetting` theo `id === role` (custom permissions lưu trong DB).
 * 2. Nếu không tìm được, fallback về `DEFAULT_ROLE_PERMISSIONS[normalizeRole(role)]`.
 *
 * Cache in-memory TTL 60s, có thể invalidate thủ công khi admin sửa quyền.
 *
 * ⚠️ KHÔNG được import trong middleware edge runtime (file này dùng Prisma).
 *    Nếu cần hàm sync ở edge, import từ `./resolve-permissions-edge` thay vì file này.
 */

import { prisma } from '@/lib/prisma';
import {
  DEFAULT_ROLE_PERMISSIONS,
  normalizeRole,
  type Permission,
} from '@/features/employees/permissions';
import { logError } from '@/lib/logger';

export { resolvePermissionsSync } from './resolve-permissions-edge';

const CACHE_TTL_MS = 60_000;

interface CacheEntry {
  permissions: Permission[];
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

/**
 * Lấy danh sách permissions cho một role.
 * Custom (DB) > Default (code). Có cache TTL.
 *
 * @param role role raw (string). Nếu null/empty → trả mảng rỗng.
 */
export async function resolvePermissions(
  role: string | null | undefined,
): Promise<Permission[]> {
  if (!role) return [];

  const cacheKey = role;
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.permissions;
  }

  const permissions = await fetchPermissionsFromDb(role);
  cache.set(cacheKey, {
    permissions,
    expiresAt: now + CACHE_TTL_MS,
  });
  return permissions;
}

async function fetchPermissionsFromDb(role: string): Promise<Permission[]> {
  try {
    const roleSetting = await prisma.roleSetting.findFirst({
      where: {
        id: role,
        isActive: true,
        isDeleted: false,
      },
      select: { permissions: true },
    });

    if (roleSetting?.permissions && Array.isArray(roleSetting.permissions)) {
      return roleSetting.permissions as Permission[];
    }
  } catch (error) {
    // DB không khả dụng → dùng fallback, log để biết
    logError('[RBAC] resolvePermissions fallback to default', error);
  }

  const normalized = normalizeRole(role);
  return DEFAULT_ROLE_PERMISSIONS[normalized] ?? [];
}

/**
 * Xoá cache (toàn bộ hoặc 1 role cụ thể) khi admin cập nhật role settings.
 */
export function invalidateRolePermissionsCache(role?: string): void {
  if (role) {
    cache.delete(role);
  } else {
    cache.clear();
  }
}

/**
 * Check 1 permission cho role (cached).
 */
export async function hasResolvedPermission(
  role: string | null | undefined,
  permission: Permission,
): Promise<boolean> {
  const perms = await resolvePermissions(role);
  return perms.includes(permission);
}
