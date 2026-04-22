/**
 * Settings Data Fetcher (Server-side with HEAVY caching)
 * 
 * Settings rarely change, so we cache aggressively
 * Use request memoization + time-based cache
 * 
 * Schema:
 * - Branch: systemId, id, name, address, phone, isDefault
 * - Category: systemId, id, name, slug, parentId, thumbnail, imageUrl, sortOrder, level
 * - Brand: systemId, id, name, logo, logoUrl, thumbnail
 * - Employee: systemId, id, fullName, branchId, employmentStatus
 * - Customer: systemId, id, name, phone, email, address, status
 * - SettingsData: EAV rows (type + metadata) — không dùng cho shipping; shipping ở bảng `setting`
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';

/**
 * Get all branches - CACHED (10 min)
 * Branches rarely change
 */
export const getBranches = unstable_cache(
  async () => {
    return prisma.branch.findMany({
      where: { isDeleted: false },
      orderBy: { name: 'asc' },
      select: {
        systemId: true,
        id: true,
        name: true,
        address: true,
        phone: true,
        isDefault: true,
      },
    });
  },
  ['branches'],
  { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.BRANCHES] }
);

/**
 * Get all categories - CACHED (10 min)
 */
export const getCategories = unstable_cache(
  async () => {
    return prisma.category.findMany({
      where: { isActive: true, isDeleted: false },
      orderBy: [{ parentId: 'asc' }, { sortOrder: 'asc' }],
      select: {
        systemId: true,
        id: true,
        name: true,
        slug: true,
        parentId: true,
        thumbnail: true,
        imageUrl: true,
        sortOrder: true,
        level: true,
      },
    });
  },
  ['categories'],
  { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.SETTINGS] }
);

/**
 * Get all brands - CACHED (10 min)
 */
export const getBrands = unstable_cache(
  async () => {
    return prisma.brand.findMany({
      where: { isActive: true, isDeleted: false },
      orderBy: { name: 'asc' },
      select: {
        systemId: true,
        id: true,
        name: true,
        logo: true,
        logoUrl: true,
        thumbnail: true,
      },
    });
  },
  ['brands'],
  { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.SETTINGS] }
);

/**
 * Get settings by type - Request memoized + CACHED (10 min)
 */
export const getSettingsByType = cache(async (type: string) => {
  const cached = await unstable_cache(
    async () => {
      return prisma.settingsData.findFirst({
        where: { type },
      });
    },
    [`settings-${type}`],
    { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.SETTINGS] }
  )();
  
  return cached;
});

/**
 * Legacy map: `settings_data` rows (active). Nếu cùng `type` có nhiều bản ghi, giá trị sau ghi đè — không dùng cho type dạng danh sách (receipt-type, …).
 */
export const getAllSettings = unstable_cache(
  async () => {
    const settings = await prisma.settingsData.findMany({
      where: { isActive: true },
    });
    
    return settings.reduce((acc, setting) => {
      acc[setting.type] = setting.metadata;
      return acc;
    }, {} as Record<string, unknown>);
  },
  ['all-settings'],
  { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.SETTINGS] }
);

/**
 * Get employees for select - CACHED (5 min)
 */
export const getEmployeesForSelect = unstable_cache(
  async (branchId?: string) => {
    return prisma.employee.findMany({
      where: {
        isDeleted: false,
        employmentStatus: 'ACTIVE',
        ...(branchId && { branchId }),
      },
      orderBy: { fullName: 'asc' },
      select: {
        systemId: true,
        id: true,
        fullName: true,
        role: true,
        branchId: true,
      },
    });
  },
  ['employees-for-select'],
  { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.USERS] }
);

/**
 * Get customers for select - CACHED (2 min)
 */
export const getCustomersForSelect = unstable_cache(
  async (search?: string, limit = 50) => {
    return prisma.customer.findMany({
      where: {
        status: 'ACTIVE',
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: { name: 'asc' },
      take: limit,
      select: {
        systemId: true,
        id: true,
        name: true,
        phone: true,
        address: true,
      },
    });
  },
  ['customers-for-select'],
  { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.CUSTOMERS] }
);

/**
 * Hình thức thanh toán — single source: bảng `payment_methods` (see also `getPaymentFormOptions`).
 * Previously read legacy blob `settings_data.type = 'payment_types'`; do not reintroduce.
 */
export const getPaymentMethods = unstable_cache(
  async () => {
    return prisma.paymentMethod.findMany({
      where: { isActive: true },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
      select: {
        systemId: true,
        id: true,
        name: true,
        isDefault: true,
        code: true,
        type: true,
      },
    });
  },
  ['payment-methods', 'v2', 'prisma'],
  { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.SETTINGS] }
);

/**
 * Thuế mặc định — nguồn chuẩn: bảng `taxes` (không còn blob `settings_data.type = tax_settings`).
 */
export const getTaxSettings = unstable_cache(
  async () => {
    const row =
      (await prisma.tax.findFirst({
        where: { isDeleted: false, isActive: true, isDefaultSale: true },
      })) ||
      (await prisma.tax.findFirst({
        where: { isDeleted: false, isActive: true },
        orderBy: { name: 'asc' },
      }));
    if (!row) return null;
    const taxRate = Number(row.rate);
    return {
      taxRate,
      includesTax: true,
      taxId: row.id,
    };
  },
  ['tax-settings', 'v2', 'taxes-table'],
  { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.SETTINGS] }
);

/**
 * Cài đặt vận chuyển — cùng nguồn với GET /api/settings/shipping (key `shipping-settings`, group `operations`).
 * Không đọc legacy `settings_data.type = shipping_settings`.
 */
export const getShippingSettings = unstable_cache(
  async () => {
    const setting = await prisma.setting.findUnique({
      where: { key_group: { key: 'shipping-settings', group: 'operations' } },
    });
    const v = setting?.value;
    return v != null && typeof v === 'object' ? (v as Record<string, unknown>) : null;
  },
  ['shipping-settings', 'v2', 'prisma-setting'],
  { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.SETTINGS] }
);

/**
 * Thông tin doanh nghiệp — cùng nguồn với GET /api/settings/store-info (key store-info / group store).
 * Trả về shape cũ { name, address, ... } để tương thích; map từ JSON store-info.
 */
export const getCompanyInfo = unstable_cache(
  async () => {
    const setting = await prisma.setting.findUnique({
      where: { key_group: { key: 'store-info', group: 'store' } },
    });
    if (!setting?.value) return null;
    const v = setting.value as Record<string, unknown>;
    return {
      name: (v.companyName as string) || (v.brandName as string) || '',
      address: (v.headquartersAddress as string) || '',
      phone: (v.hotline as string) || '',
      email: (v.email as string) || '',
      taxId: (v.taxCode as string) || '',
      logo: (v.logo as string) || '',
    };
  },
  ['company-info', 'v2', 'store-setting'],
  { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.SETTINGS] }
);

/**
 * Preload all common settings
 * Call this in layout.tsx for faster page loads
 */
export async function preloadSettings() {
  await Promise.all([
    getBranches(),
    getCategories(),
    getBrands(),
    getPaymentMethods(),
  ]);
}
