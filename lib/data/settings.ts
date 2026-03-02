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
 * - SettingsData: systemId, id, name, type, description, isActive, isDefault, metadata
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
 * Get all settings - CACHED (10 min)
 * Use for preloading settings on app init
 */
export const getAllSettings = unstable_cache(
  async () => {
    const settings = await prisma.settingsData.findMany({
      where: { isActive: true },
    });
    
    // Convert to map for easy access
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
        email: true,
        address: true,
      },
    });
  },
  ['customers-for-select'],
  { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.CUSTOMERS] }
);

/**
 * Get payment methods - CACHED (10 min)
 */
export const getPaymentMethods = unstable_cache(
  async () => {
    const setting = await prisma.settingsData.findFirst({
      where: { type: 'payment_types' },
    });
    
    if (!setting?.metadata) {
      return [
        { id: 'cash', name: 'Tiền mặt', isDefault: true },
        { id: 'transfer', name: 'Chuyển khoản', isDefault: false },
      ];
    }
    
    const metadata = setting.metadata as { items?: unknown[] };
    return metadata.items || [];
  },
  ['payment-methods'],
  { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.SETTINGS] }
);

/**
 * Get tax settings - CACHED (10 min)
 */
export const getTaxSettings = unstable_cache(
  async () => {
    const setting = await prisma.settingsData.findFirst({
      where: { type: 'tax_settings' },
    });
    
    return setting?.metadata as {
      taxRate: number;
      includesTax: boolean;
      taxId: string;
    } | null;
  },
  ['tax-settings'],
  { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.SETTINGS] }
);

/**
 * Get shipping settings - CACHED (10 min)
 */
export const getShippingSettings = unstable_cache(
  async () => {
    const setting = await prisma.settingsData.findFirst({
      where: { type: 'shipping_settings' },
    });
    
    return setting?.metadata || null;
  },
  ['shipping-settings'],
  { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.SETTINGS] }
);

/**
 * Get company info - CACHED (10 min)
 */
export const getCompanyInfo = unstable_cache(
  async () => {
    const setting = await prisma.settingsData.findFirst({
      where: { type: 'company_info' },
    });
    
    return setting?.metadata as {
      name: string;
      address: string;
      phone: string;
      email: string;
      taxId: string;
      logo: string;
    } | null;
  },
  ['company-info'],
  { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.SETTINGS] }
);

/**
 * Preload all common settings
 * Call this in layout.tsx for faster page loads
 */
export async function preloadSettings() {
  // Fire all requests in parallel
  await Promise.all([
    getBranches(),
    getCategories(),
    getBrands(),
    getAllSettings(),
    getPaymentMethods(),
  ]);
}
