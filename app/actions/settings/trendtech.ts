'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface TrendtechSettings {
  apiUrl: string;
  apiKey: string;
  shopId: string;
  enabled: boolean;
  autoSync: boolean;
  syncInterval: number;
  lastSyncAt?: string;
}

export interface TrendtechCategory {
  id: string;
  name: string;
  parentId?: string;
  sortOrder: number;
}

export interface TrendtechBrand {
  id: string;
  name: string;
  logo?: string;
}

export interface TrendtechCategoryMapping {
  systemId: string;
  localCategoryId: string;
  trendtechCategoryId: string;
  createdAt: string;
}

export interface TrendtechBrandMapping {
  systemId: string;
  localBrandId: string;
  trendtechBrandId: string;
  createdAt: string;
}

export interface TrendtechSyncResult {
  success: boolean;
  syncedCount: number;
  failedCount: number;
  errors?: string[];
}

const SETTINGS_TYPE = 'trendtech';
const CATEGORIES_TYPE = 'trendtech-categories';
const BRANDS_TYPE = 'trendtech-brands';
const CAT_MAPPINGS_TYPE = 'trendtech-category-mappings';
const BRAND_MAPPINGS_TYPE = 'trendtech-brand-mappings';

// ==================== SETTINGS ====================

export async function getTrendtechSettings(): Promise<ActionResult<TrendtechSettings>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: SETTINGS_TYPE },
    });

    const defaults: TrendtechSettings = {
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
      data: { ...defaults, ...(settings.metadata as Record<string, unknown>) } as TrendtechSettings,
    };
  } catch (error) {
    console.error('Failed to get Trendtech settings:', error);
    return { success: false, error: 'Không thể tải cài đặt Trendtech' };
  }
}

export async function updateTrendtechSettings(
  data: Partial<TrendtechSettings>
): Promise<ActionResult<TrendtechSettings>> {
  try {
    const result = await getTrendtechSettings();
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
      const tempId = await generateIdWithPrefix('TRENDTECH', prisma);
      await prisma.settingsData.create({
        data: {
          systemId: tempId,
          id: tempId,
          type: SETTINGS_TYPE,
          name: 'Trendtech Settings',
          metadata: updated as unknown as Prisma.InputJsonValue,
        },
      });
    }

    revalidatePath('/settings/trendtech');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Failed to update Trendtech settings:', error);
    return { success: false, error: 'Không thể cập nhật cài đặt Trendtech' };
  }
}

// ==================== CATEGORIES ====================

export async function getTrendtechCategories(): Promise<ActionResult<TrendtechCategory[]>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: CATEGORIES_TYPE },
    });

    if (!settings) {
      return { success: true, data: [] };
    }

    return {
      success: true,
      data: (settings.metadata as Record<string, unknown>)?.categories as TrendtechCategory[] || [],
    };
  } catch (error) {
    console.error('Failed to get Trendtech categories:', error);
    return { success: false, error: 'Không thể tải danh mục Trendtech' };
  }
}

export async function syncTrendtechCategories(): Promise<ActionResult<{ count: number }>> {
  try {
    // This would call the Trendtech API - for now just return success
    // In real implementation, fetch from Trendtech API and save
    revalidatePath('/settings/trendtech');
    return { success: true, data: { count: 0 } };
  } catch (error) {
    console.error('Failed to sync Trendtech categories:', error);
    return { success: false, error: 'Không thể đồng bộ danh mục Trendtech' };
  }
}

// ==================== BRANDS ====================

export async function getTrendtechBrands(): Promise<ActionResult<TrendtechBrand[]>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: BRANDS_TYPE },
    });

    if (!settings) {
      return { success: true, data: [] };
    }

    return {
      success: true,
      data: (settings.metadata as Record<string, unknown>)?.brands as TrendtechBrand[] || [],
    };
  } catch (error) {
    console.error('Failed to get Trendtech brands:', error);
    return { success: false, error: 'Không thể tải thương hiệu Trendtech' };
  }
}

export async function syncTrendtechBrands(): Promise<ActionResult<{ count: number }>> {
  try {
    // This would call the Trendtech API - for now just return success
    revalidatePath('/settings/trendtech');
    return { success: true, data: { count: 0 } };
  } catch (error) {
    console.error('Failed to sync Trendtech brands:', error);
    return { success: false, error: 'Không thể đồng bộ thương hiệu Trendtech' };
  }
}

// ==================== CATEGORY MAPPINGS ====================

export async function getCategoryMappings(): Promise<ActionResult<TrendtechCategoryMapping[]>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: CAT_MAPPINGS_TYPE },
    });

    if (!settings) {
      return { success: true, data: [] };
    }

    return {
      success: true,
      data: (settings.metadata as Record<string, unknown>)?.mappings as TrendtechCategoryMapping[] || [],
    };
  } catch (error) {
    console.error('Failed to get category mappings:', error);
    return { success: false, error: 'Không thể tải ánh xạ danh mục' };
  }
}

export async function saveCategoryMapping(
  data: Omit<TrendtechCategoryMapping, 'systemId' | 'createdAt'>
): Promise<ActionResult<TrendtechCategoryMapping>> {
  try {
    const result = await getCategoryMappings();
    if (!result.success) return { success: false, error: result.error };

    const mappings = result.data;
    
    // Check if mapping already exists
    const existingIndex = mappings.findIndex(
      (m) => m.localCategoryId === data.localCategoryId
    );

    const now = new Date().toISOString();
    const mapping: TrendtechCategoryMapping = {
      ...data,
      systemId: existingIndex >= 0 
        ? mappings[existingIndex].systemId 
        : await generateIdWithPrefix('TCM', prisma),
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
      const tempId = await generateIdWithPrefix('TRENDTECH_CAT_MAP', prisma);
      await prisma.settingsData.create({
        data: {
          systemId: tempId,
          id: tempId,
          type: CAT_MAPPINGS_TYPE,
          name: 'Trendtech Category Mappings',
          metadata: { mappings } as unknown as Prisma.InputJsonValue,
        },
      });
    }

    revalidatePath('/settings/trendtech');
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

    revalidatePath('/settings/trendtech');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to delete category mapping:', error);
    return { success: false, error: 'Không thể xóa ánh xạ danh mục' };
  }
}

// ==================== BRAND MAPPINGS ====================

export async function getBrandMappings(): Promise<ActionResult<TrendtechBrandMapping[]>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: BRAND_MAPPINGS_TYPE },
    });

    if (!settings) {
      return { success: true, data: [] };
    }

    return {
      success: true,
      data: (settings.metadata as Record<string, unknown>)?.mappings as TrendtechBrandMapping[] || [],
    };
  } catch (error) {
    console.error('Failed to get brand mappings:', error);
    return { success: false, error: 'Không thể tải ánh xạ thương hiệu' };
  }
}

export async function saveBrandMapping(
  data: Omit<TrendtechBrandMapping, 'systemId' | 'createdAt'>
): Promise<ActionResult<TrendtechBrandMapping>> {
  try {
    const result = await getBrandMappings();
    if (!result.success) return { success: false, error: result.error };

    const mappings = result.data;
    
    const existingIndex = mappings.findIndex(
      (m) => m.localBrandId === data.localBrandId
    );

    const now = new Date().toISOString();
    const mapping: TrendtechBrandMapping = {
      ...data,
      systemId: existingIndex >= 0 
        ? mappings[existingIndex].systemId 
        : await generateIdWithPrefix('TBM', prisma),
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
      const tempId = await generateIdWithPrefix('TRENDTECH_BRAND_MAP', prisma);
      await prisma.settingsData.create({
        data: {
          systemId: tempId,
          id: tempId,
          type: BRAND_MAPPINGS_TYPE,
          name: 'Trendtech Brand Mappings',
          metadata: { mappings } as unknown as Prisma.InputJsonValue,
        },
      });
    }

    revalidatePath('/settings/trendtech');
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

    revalidatePath('/settings/trendtech');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to delete brand mapping:', error);
    return { success: false, error: 'Không thể xóa ánh xạ thương hiệu' };
  }
}

// ==================== SYNC ====================

export async function syncProductToTrendtech(
  _productSystemId: string
): Promise<ActionResult<TrendtechSyncResult>> {
  try {
    // This would call the Trendtech API to sync a product
    // For now just return success
    return {
      success: true,
      data: { success: true, syncedCount: 1, failedCount: 0 },
    };
  } catch (error) {
    console.error('Failed to sync product to Trendtech:', error);
    return { success: false, error: 'Không thể đồng bộ sản phẩm' };
  }
}

export async function bulkSyncToTrendtech(
  productSystemIds: string[]
): Promise<ActionResult<{ success: number; failed: number }>> {
  try {
    // This would call the Trendtech API to sync multiple products
    // For now just return success
    return {
      success: true,
      data: { success: productSystemIds.length, failed: 0 },
    };
  } catch (error) {
    console.error('Failed to bulk sync to Trendtech:', error);
    return { success: false, error: 'Không thể đồng bộ hàng loạt' };
  }
}
