'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface PkgxSettings {
  apiUrl: string;
  apiKey: string;
  shopId: string;
  enabled: boolean;
  autoSync: boolean;
  syncInterval: number;
  lastSyncAt?: string;
}

export interface PkgxCategory {
  id: number;
  name: string;
  parentId?: number;
  sortOrder: number;
  isShow: number;
  catDesc?: string;
  longDesc?: string;
  keywords?: string;
  metaTitle?: string;
  metaDesc?: string;
  catAlias?: string;
}

export interface PkgxBrand {
  id: number;
  name: string;
  logo?: string;
  description?: string;
  siteUrl?: string;
  sortOrder: number;
  isShow: number;
}

export interface PkgxCategoryMapping {
  systemId: string;
  hrmCategoryId: string;
  hrmCategoryName: string;
  pkgxCategoryId: number;
  pkgxCategoryName: string;
  createdAt: string;
}

export interface PkgxBrandMapping {
  systemId: string;
  hrmBrandId: string;
  hrmBrandName: string;
  pkgxBrandId: number;
  pkgxBrandName: string;
  createdAt: string;
}

export interface PkgxSyncLog {
  systemId: string;
  syncType: 'categories' | 'brands' | 'products';
  action: string;
  status: 'success' | 'failed';
  itemsTotal: number;
  itemsSuccess: number;
  itemsFailed: number;
  errors?: string[];
  createdAt: string;
}

const SETTINGS_TYPE = 'pkgx-settings';
const CATEGORIES_TYPE = 'pkgx-categories';
const BRANDS_TYPE = 'pkgx-brands';
const CAT_MAPPINGS_TYPE = 'pkgx-category-mappings';
const BRAND_MAPPINGS_TYPE = 'pkgx-brand-mappings';
const SYNC_LOGS_TYPE = 'pkgx-sync-logs';

// ==================== SETTINGS ====================

export async function getPkgxSettings(): Promise<ActionResult<PkgxSettings>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: SETTINGS_TYPE },
    });

    const defaults: PkgxSettings = {
      apiUrl: '',
      apiKey: '',
      shopId: '',
      enabled: false,
      autoSync: false,
      syncInterval: 60,
    };

    if (!settings) {
      return { success: true, data: defaults };
    }

    return {
      success: true,
      data: { ...defaults, ...(settings.metadata as Record<string, unknown>) } as PkgxSettings,
    };
  } catch (error) {
    console.error('Failed to get PKGX settings:', error);
    return { success: false, error: 'Không thể tải cài đặt PKGX' };
  }
}

export async function updatePkgxSettings(
  data: Partial<PkgxSettings>
): Promise<ActionResult<PkgxSettings>> {
  try {
    const result = await getPkgxSettings();
    if (!result.success) return { success: false, error: result.error };

    const updated = { ...result.data, ...data };

    const existing = await prisma.settingsData.findFirst({
      where: { type: SETTINGS_TYPE },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: updated as unknown as Prisma.InputJsonValue },
      });
    } else {
      const tempId = await generateIdWithPrefix('PKGX', prisma);
      await prisma.settingsData.create({
        data: {
          systemId: tempId,
          id: tempId,
          type: SETTINGS_TYPE,
          name: 'PKGX Settings',
          metadata: updated as unknown as Prisma.InputJsonValue,
        },
      });
    }

    revalidatePath('/settings/pkgx');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Failed to update PKGX settings:', error);
    return { success: false, error: 'Không thể cập nhật cài đặt PKGX' };
  }
}

// ==================== CATEGORIES ====================

export async function getPkgxCategories(): Promise<ActionResult<PkgxCategory[]>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: CATEGORIES_TYPE },
    });

    if (!settings) {
      return { success: true, data: [] };
    }

    return {
      success: true,
      data: (settings.metadata as Record<string, unknown>)?.categories as PkgxCategory[] || [],
    };
  } catch (error) {
    console.error('Failed to get PKGX categories:', error);
    return { success: false, error: 'Không thể tải danh mục PKGX' };
  }
}

export async function savePkgxCategories(
  categories: PkgxCategory[]
): Promise<ActionResult<{ synced: number }>> {
  try {
    const existing = await prisma.settingsData.findFirst({
      where: { type: CATEGORIES_TYPE },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: { categories } as unknown as Prisma.InputJsonValue },
      });
    } else {
      const tempId = await generateIdWithPrefix('PKGX_CATS', prisma);
      await prisma.settingsData.create({
        data: {
          systemId: tempId,
          id: tempId,
          type: CATEGORIES_TYPE,
          name: 'PKGX Categories',
          metadata: { categories } as unknown as Prisma.InputJsonValue,
        },
      });
    }

    revalidatePath('/settings/pkgx');
    return { success: true, data: { synced: categories.length } };
  } catch (error) {
    console.error('Failed to save PKGX categories:', error);
    return { success: false, error: 'Không thể lưu danh mục PKGX' };
  }
}

// ==================== BRANDS ====================

export async function getPkgxBrands(): Promise<ActionResult<PkgxBrand[]>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: BRANDS_TYPE },
    });

    if (!settings) {
      return { success: true, data: [] };
    }

    return {
      success: true,
      data: (settings.metadata as Record<string, unknown>)?.brands as PkgxBrand[] || [],
    };
  } catch (error) {
    console.error('Failed to get PKGX brands:', error);
    return { success: false, error: 'Không thể tải thương hiệu PKGX' };
  }
}

export async function savePkgxBrands(
  brands: PkgxBrand[]
): Promise<ActionResult<{ synced: number }>> {
  try {
    const existing = await prisma.settingsData.findFirst({
      where: { type: BRANDS_TYPE },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: { brands } as unknown as Prisma.InputJsonValue },
      });
    } else {
      const tempId = await generateIdWithPrefix('PKGX_BRANDS', prisma);
      await prisma.settingsData.create({
        data: {
          systemId: tempId,
          id: tempId,
          type: BRANDS_TYPE,
          name: 'PKGX Brands',
          metadata: { brands } as unknown as Prisma.InputJsonValue,
        },
      });
    }

    revalidatePath('/settings/pkgx');
    return { success: true, data: { synced: brands.length } };
  } catch (error) {
    console.error('Failed to save PKGX brands:', error);
    return { success: false, error: 'Không thể lưu thương hiệu PKGX' };
  }
}

// ==================== CATEGORY MAPPINGS ====================

export async function getCategoryMappings(): Promise<ActionResult<PkgxCategoryMapping[]>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: CAT_MAPPINGS_TYPE },
    });

    if (!settings) {
      return { success: true, data: [] };
    }

    return {
      success: true,
      data: (settings.metadata as Record<string, unknown>)?.mappings as PkgxCategoryMapping[] || [],
    };
  } catch (error) {
    console.error('Failed to get category mappings:', error);
    return { success: false, error: 'Không thể tải ánh xạ danh mục' };
  }
}

export async function saveCategoryMapping(
  data: Omit<PkgxCategoryMapping, 'systemId' | 'createdAt'>
): Promise<ActionResult<PkgxCategoryMapping>> {
  try {
    const result = await getCategoryMappings();
    if (!result.success) return { success: false, error: result.error };

    const mappings = result.data;
    
    // Check if mapping already exists for this HRM category
    const existingIndex = mappings.findIndex(
      (m) => m.hrmCategoryId === data.hrmCategoryId
    );

    const now = new Date().toISOString();
    const mapping: PkgxCategoryMapping = {
      ...data,
      systemId: existingIndex >= 0 
        ? mappings[existingIndex].systemId 
        : await generateIdWithPrefix('PCM', prisma),
      createdAt: existingIndex >= 0 
        ? mappings[existingIndex].createdAt 
        : now,
    };

    if (existingIndex >= 0) {
      mappings[existingIndex] = mapping;
    } else {
      mappings.push(mapping);
    }

    const existing = await prisma.settingsData.findFirst({
      where: { type: CAT_MAPPINGS_TYPE },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: { mappings } as unknown as Prisma.InputJsonValue },
      });
    } else {
      const tempId = await generateIdWithPrefix('PKGX_CAT_MAP', prisma);
      await prisma.settingsData.create({
        data: {
          systemId: tempId,
          id: tempId,
          type: CAT_MAPPINGS_TYPE,
          name: 'PKGX Category Mappings',
          metadata: { mappings } as unknown as Prisma.InputJsonValue,
        },
      });
    }

    revalidatePath('/settings/pkgx');
    return { success: true, data: mapping };
  } catch (error) {
    console.error('Failed to save category mapping:', error);
    return { success: false, error: 'Không thể lưu ánh xạ danh mục' };
  }
}

export async function deleteCategoryMapping(systemId: string): Promise<ActionResult<void>> {
  try {
    const result = await getCategoryMappings();
    if (!result.success) return { success: false, error: result.error };

    const mappings = result.data.filter((m) => m.systemId !== systemId);

    const existing = await prisma.settingsData.findFirst({
      where: { type: CAT_MAPPINGS_TYPE },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: { mappings } as unknown as Prisma.InputJsonValue },
      });
    }

    revalidatePath('/settings/pkgx');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to delete category mapping:', error);
    return { success: false, error: 'Không thể xóa ánh xạ danh mục' };
  }
}

// ==================== BRAND MAPPINGS ====================

export async function getBrandMappings(): Promise<ActionResult<PkgxBrandMapping[]>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: BRAND_MAPPINGS_TYPE },
    });

    if (!settings) {
      return { success: true, data: [] };
    }

    return {
      success: true,
      data: (settings.metadata as Record<string, unknown>)?.mappings as PkgxBrandMapping[] || [],
    };
  } catch (error) {
    console.error('Failed to get brand mappings:', error);
    return { success: false, error: 'Không thể tải ánh xạ thương hiệu' };
  }
}

export async function saveBrandMapping(
  data: Omit<PkgxBrandMapping, 'systemId' | 'createdAt'>
): Promise<ActionResult<PkgxBrandMapping>> {
  try {
    const result = await getBrandMappings();
    if (!result.success) return { success: false, error: result.error };

    const mappings = result.data;
    
    const existingIndex = mappings.findIndex(
      (m) => m.hrmBrandId === data.hrmBrandId
    );

    const now = new Date().toISOString();
    const mapping: PkgxBrandMapping = {
      ...data,
      systemId: existingIndex >= 0 
        ? mappings[existingIndex].systemId 
        : await generateIdWithPrefix('PBM', prisma),
      createdAt: existingIndex >= 0 
        ? mappings[existingIndex].createdAt 
        : now,
    };

    if (existingIndex >= 0) {
      mappings[existingIndex] = mapping;
    } else {
      mappings.push(mapping);
    }

    const existing = await prisma.settingsData.findFirst({
      where: { type: BRAND_MAPPINGS_TYPE },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: { mappings } as unknown as Prisma.InputJsonValue },
      });
    } else {
      const tempId = await generateIdWithPrefix('PKGX_BRAND_MAP', prisma);
      await prisma.settingsData.create({
        data: {
          systemId: tempId,
          id: tempId,
          type: BRAND_MAPPINGS_TYPE,
          name: 'PKGX Brand Mappings',
          metadata: { mappings } as unknown as Prisma.InputJsonValue,
        },
      });
    }

    revalidatePath('/settings/pkgx');
    return { success: true, data: mapping };
  } catch (error) {
    console.error('Failed to save brand mapping:', error);
    return { success: false, error: 'Không thể lưu ánh xạ thương hiệu' };
  }
}

export async function deleteBrandMapping(systemId: string): Promise<ActionResult<void>> {
  try {
    const result = await getBrandMappings();
    if (!result.success) return { success: false, error: result.error };

    const mappings = result.data.filter((m) => m.systemId !== systemId);

    const existing = await prisma.settingsData.findFirst({
      where: { type: BRAND_MAPPINGS_TYPE },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: { mappings } as unknown as Prisma.InputJsonValue },
      });
    }

    revalidatePath('/settings/pkgx');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to delete brand mapping:', error);
    return { success: false, error: 'Không thể xóa ánh xạ thương hiệu' };
  }
}

// ==================== SYNC LOGS ====================

export async function getSyncLogs(
  limit: number = 50
): Promise<ActionResult<PkgxSyncLog[]>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: SYNC_LOGS_TYPE },
    });

    if (!settings) {
      return { success: true, data: [] };
    }

    const logs = (settings.metadata as Record<string, unknown>)?.logs as PkgxSyncLog[] || [];
    return { success: true, data: logs.slice(0, limit) };
  } catch (error) {
    console.error('Failed to get sync logs:', error);
    return { success: false, error: 'Không thể tải nhật ký đồng bộ' };
  }
}

export async function createSyncLog(
  data: Omit<PkgxSyncLog, 'systemId' | 'createdAt'>
): Promise<ActionResult<PkgxSyncLog>> {
  try {
    const result = await getSyncLogs(1000);
    if (!result.success) return { success: false, error: result.error };

    const now = new Date().toISOString();
    const log: PkgxSyncLog = {
      ...data,
      systemId: await generateIdWithPrefix('PSLOG', prisma),
      createdAt: now,
    };

    // Keep only last 1000 logs
    const logs = [log, ...result.data].slice(0, 1000);

    const existing = await prisma.settingsData.findFirst({
      where: { type: SYNC_LOGS_TYPE },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: { logs } as unknown as Prisma.InputJsonValue },
      });
    } else {
      const tempId = await generateIdWithPrefix('PKGX_SYNC_LOGS', prisma);
      await prisma.settingsData.create({
        data: {
          systemId: tempId,
          id: tempId,
          type: SYNC_LOGS_TYPE,
          name: 'PKGX Sync Logs',
          metadata: { logs } as unknown as Prisma.InputJsonValue,
        },
      });
    }

    return { success: true, data: log };
  } catch (error) {
    console.error('Failed to create sync log:', error);
    return { success: false, error: 'Không thể ghi nhật ký đồng bộ' };
  }
}
