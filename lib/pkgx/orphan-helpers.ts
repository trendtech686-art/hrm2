/**
 * PKGX mapping orphan detection helpers (SERVER-ONLY).
 *
 * Mapping orphan = bản ghi trong `PkgxBrandMapping` / `PkgxCategoryMapping`
 * trỏ tới một Brand/Category HRM đã bị soft-delete hoặc bị xoá khỏi DB.
 *
 * Các helper dưới đây enrich response GET với cờ `hrmEntityMissing: true`
 * để client hiển thị badge cảnh báo và cho phép user chủ động "Dọn".
 *
 * Lưu ý: không xoá orphan ở đây — user sẽ trigger DELETE mapping từ UI.
 */

import { prisma } from '@/lib/prisma';

/**
 * Mở rộng 1 mapping với thông tin "entity HRM còn tồn tại hay không".
 * Nếu Brand/Category không còn trong DB hoặc đã isDeleted=true ⇒ `hrmEntityMissing: true`.
 */
export type WithOrphanFlag<T> = T & {
  hrmEntityMissing: boolean;
};

/**
 * Enrich danh sách brand mapping với cờ `hrmEntityMissing`.
 */
export async function enrichBrandMappingsWithOrphanFlag<
  T extends { hrmBrandId: string },
>(mappings: T[]): Promise<WithOrphanFlag<T>[]> {
  if (mappings.length === 0) return [];

  const hrmIds = Array.from(new Set(mappings.map((m) => m.hrmBrandId)));
  const liveBrands = await prisma.brand.findMany({
    where: { systemId: { in: hrmIds }, isDeleted: false },
    select: { systemId: true },
  });
  const liveSet = new Set(liveBrands.map((b) => b.systemId));

  return mappings.map((m) => ({
    ...m,
    hrmEntityMissing: !liveSet.has(m.hrmBrandId),
  }));
}

/**
 * Enrich danh sách category mapping với cờ `hrmEntityMissing`.
 */
export async function enrichCategoryMappingsWithOrphanFlag<
  T extends { hrmCategoryId: string },
>(mappings: T[]): Promise<WithOrphanFlag<T>[]> {
  if (mappings.length === 0) return [];

  const hrmIds = Array.from(new Set(mappings.map((m) => m.hrmCategoryId)));
  const liveCategories = await prisma.category.findMany({
    where: { systemId: { in: hrmIds }, isDeleted: false },
    select: { systemId: true },
  });
  const liveSet = new Set(liveCategories.map((c) => c.systemId));

  return mappings.map((m) => ({
    ...m,
    hrmEntityMissing: !liveSet.has(m.hrmCategoryId),
  }));
}

// =============================================================
// Self-heal helpers for bulk-import (auto-replace orphan mappings)
// =============================================================

/**
 * Kiểm tra PkgxBrandMapping với pkgxBrandId có tồn tại và trỏ vào Brand HRM đã xoá không.
 * Nếu orphan ⇒ xoá mapping đó (caller có thể create mapping mới an toàn).
 *
 * @returns `'orphan_deleted'` nếu đã xoá mapping zombie,
 *          `'live'` nếu mapping còn trỏ vào Brand HRM sống,
 *          `'none'` nếu không có mapping nào với pkgxBrandId đó.
 */
export async function healOrphanBrandMapping(
  pkgxBrandId: number,
): Promise<'orphan_deleted' | 'live' | 'none'> {
  const existing = await prisma.pkgxBrandMapping.findUnique({
    where: { pkgxBrandId },
    select: { systemId: true, hrmBrandId: true },
  });
  if (!existing) return 'none';

  const brand = await prisma.brand.findUnique({
    where: { systemId: existing.hrmBrandId },
    select: { isDeleted: true },
  });
  const isOrphan = !brand || brand.isDeleted === true;

  if (isOrphan) {
    await prisma.pkgxBrandMapping.delete({
      where: { systemId: existing.systemId },
    });
    return 'orphan_deleted';
  }
  return 'live';
}

/**
 * Như `healOrphanBrandMapping` nhưng cho PkgxCategoryMapping.
 */
export async function healOrphanCategoryMapping(
  pkgxCategoryId: number,
): Promise<'orphan_deleted' | 'live' | 'none'> {
  const existing = await prisma.pkgxCategoryMapping.findUnique({
    where: { pkgxCategoryId },
    select: { systemId: true, hrmCategoryId: true },
  });
  if (!existing) return 'none';

  const category = await prisma.category.findUnique({
    where: { systemId: existing.hrmCategoryId },
    select: { isDeleted: true },
  });
  const isOrphan = !category || category.isDeleted === true;

  if (isOrphan) {
    await prisma.pkgxCategoryMapping.delete({
      where: { systemId: existing.systemId },
    });
    return 'orphan_deleted';
  }
  return 'live';
}
