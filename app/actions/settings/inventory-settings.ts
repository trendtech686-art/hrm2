'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// =============== Product Types ===============

export interface ProductType {
  systemId: string;
  name: string;
  code?: string;
  description?: string;
  isActive: boolean;
}

const PRODUCT_TYPES_KEY = 'inventory-product-types';

/**
 * Get all product types
 */
export async function getProductTypes(): Promise<ActionResult<ProductType[]>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: PRODUCT_TYPES_KEY },
    });

    if (!settings || !settings.metadata) {
      return { success: true, data: [] };
    }

    const types = (settings.metadata as Record<string, unknown>)?.items as ProductType[] || [];
    return { success: true, data: types };
  } catch (error) {
    console.error('Failed to get product types:', error);
    return { success: false, error: 'Không thể tải loại sản phẩm' };
  }
}

/**
 * Create a new product type
 */
export async function createProductType(
  data: Omit<ProductType, 'systemId'>
): Promise<ActionResult<ProductType>> {
  try {
    const result = await getProductTypes();
    if (!result.success) return { success: false, error: result.error };

    const newType: ProductType = {
      systemId: await generateIdWithPrefix('PTYPE', prisma),
      ...data,
    };

    const updated = [...result.data, newType];

    const existing = await prisma.settingsData.findFirst({
      where: { type: PRODUCT_TYPES_KEY },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: { items: updated } as unknown as Prisma.InputJsonValue },
      });
    } else {
      const settingsId = await generateIdWithPrefix('INV_PTYPES', prisma);
      await prisma.settingsData.create({
        data: {
          systemId: settingsId,
          id: settingsId,
          type: PRODUCT_TYPES_KEY,
          name: 'Product Types',
          metadata: { items: updated } as unknown as Prisma.InputJsonValue,
        },
      });
    }

    revalidatePath('/settings/inventory');
    return { success: true, data: newType };
  } catch (error) {
    console.error('Failed to create product type:', error);
    return { success: false, error: 'Không thể tạo loại sản phẩm' };
  }
}

/**
 * Update a product type
 */
export async function updateProductType(
  systemId: string,
  data: Partial<ProductType>
): Promise<ActionResult<ProductType>> {
  try {
    const result = await getProductTypes();
    if (!result.success) return { success: false, error: result.error };

    const index = result.data.findIndex((t) => t.systemId === systemId);
    if (index === -1) {
      return { success: false, error: 'Không tìm thấy loại sản phẩm' };
    }

    const updated = [...result.data];
    updated[index] = { ...updated[index], ...data };

    const existing = await prisma.settingsData.findFirst({
      where: { type: PRODUCT_TYPES_KEY },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: { items: updated } as unknown as Prisma.InputJsonValue },
      });
    }

    revalidatePath('/settings/inventory');
    return { success: true, data: updated[index] };
  } catch (error) {
    console.error('Failed to update product type:', error);
    return { success: false, error: 'Không thể cập nhật loại sản phẩm' };
  }
}

/**
 * Delete a product type
 */
export async function deleteProductType(systemId: string): Promise<ActionResult<void>> {
  try {
    const result = await getProductTypes();
    if (!result.success) return { success: false, error: result.error };

    const updated = result.data.filter((t) => t.systemId !== systemId);

    const existing = await prisma.settingsData.findFirst({
      where: { type: PRODUCT_TYPES_KEY },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: { items: updated } as unknown as Prisma.InputJsonValue },
      });
    }

    revalidatePath('/settings/inventory');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to delete product type:', error);
    return { success: false, error: 'Không thể xóa loại sản phẩm' };
  }
}

// =============== Importers ===============

export interface Importer {
  systemId: string;
  name: string;
  code?: string;
  country?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  taxCode?: string;
  bankAccount?: string;
  bankName?: string;
  notes?: string;
  isActive: boolean;
}

const IMPORTERS_KEY = 'inventory-importers';

/**
 * Get all importers
 */
export async function getImporters(): Promise<ActionResult<Importer[]>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: IMPORTERS_KEY },
    });

    if (!settings || !settings.metadata) {
      return { success: true, data: [] };
    }

    const importers = (settings.metadata as Record<string, unknown>)?.items as Importer[] || [];
    return { success: true, data: importers };
  } catch (error) {
    console.error('Failed to get importers:', error);
    return { success: false, error: 'Không thể tải nhà nhập khẩu' };
  }
}

/**
 * Create a new importer
 */
export async function createImporter(
  data: Omit<Importer, 'systemId'>
): Promise<ActionResult<Importer>> {
  try {
    const result = await getImporters();
    if (!result.success) return { success: false, error: result.error };

    const newImporter: Importer = {
      systemId: await generateIdWithPrefix('IMP', prisma),
      ...data,
    };

    const updated = [...result.data, newImporter];

    const existing = await prisma.settingsData.findFirst({
      where: { type: IMPORTERS_KEY },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: { items: updated } as unknown as Prisma.InputJsonValue },
      });
    } else {
      const settingsId = await generateIdWithPrefix('INV_IMPORTERS', prisma);
      await prisma.settingsData.create({
        data: {
          systemId: settingsId,
          id: settingsId,
          type: IMPORTERS_KEY,
          name: 'Importers',
          metadata: { items: updated } as unknown as Prisma.InputJsonValue,
        },
      });
    }

    revalidatePath('/settings/inventory');
    return { success: true, data: newImporter };
  } catch (error) {
    console.error('Failed to create importer:', error);
    return { success: false, error: 'Không thể tạo nhà nhập khẩu' };
  }
}

/**
 * Update an importer
 */
export async function updateImporter(
  systemId: string,
  data: Partial<Importer>
): Promise<ActionResult<Importer>> {
  try {
    const result = await getImporters();
    if (!result.success) return { success: false, error: result.error };

    const index = result.data.findIndex((i) => i.systemId === systemId);
    if (index === -1) {
      return { success: false, error: 'Không tìm thấy nhà nhập khẩu' };
    }

    const updated = [...result.data];
    updated[index] = { ...updated[index], ...data };

    const existing = await prisma.settingsData.findFirst({
      where: { type: IMPORTERS_KEY },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: { items: updated } as unknown as Prisma.InputJsonValue },
      });
    }

    revalidatePath('/settings/inventory');
    return { success: true, data: updated[index] };
  } catch (error) {
    console.error('Failed to update importer:', error);
    return { success: false, error: 'Không thể cập nhật nhà nhập khẩu' };
  }
}

/**
 * Delete an importer
 */
export async function deleteImporter(systemId: string): Promise<ActionResult<void>> {
  try {
    const result = await getImporters();
    if (!result.success) return { success: false, error: result.error };

    const updated = result.data.filter((i) => i.systemId !== systemId);

    const existing = await prisma.settingsData.findFirst({
      where: { type: IMPORTERS_KEY },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: { items: updated } as unknown as Prisma.InputJsonValue },
      });
    }

    revalidatePath('/settings/inventory');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to delete importer:', error);
    return { success: false, error: 'Không thể xóa nhà nhập khẩu' };
  }
}

/**
 * Get importer by ID
 */
export async function getImporterById(systemId: string): Promise<ActionResult<Importer | null>> {
  try {
    const result = await getImporters();
    if (!result.success) return { success: false, error: result.error };

    const importer = result.data.find((i) => i.systemId === systemId);
    return { success: true, data: importer || null };
  } catch (error) {
    console.error('Failed to get importer:', error);
    return { success: false, error: 'Không thể tải nhà nhập khẩu' };
  }
}

// =============== General Inventory Settings ===============

export interface InventoryGeneralSettings {
  // Stock management
  trackInventory: boolean;
  lowStockThreshold: number;
  outOfStockAction: 'hide' | 'show' | 'backorder';
  
  // SKU settings
  autoGenerateSKU: boolean;
  skuPrefix: string;
  skuLength: number;
  
  // Barcode settings
  barcodeFormat: 'ean13' | 'upc' | 'code128' | 'code39';
  autoGenerateBarcode: boolean;
  
  // Unit management
  defaultUnit: string;
  enableMultipleUnits: boolean;
  
  // Batch/Lot tracking
  enableBatchTracking: boolean;
  requireExpiryDate: boolean;
  expiryWarningDays: number;
  
  // Serial number tracking
  enableSerialTracking: boolean;
  
  // Cost method
  costMethod: 'fifo' | 'lifo' | 'average' | 'specific';
}

const INVENTORY_GENERAL_KEY = 'inventory-general-settings';

const DEFAULT_INVENTORY_SETTINGS: InventoryGeneralSettings = {
  trackInventory: true,
  lowStockThreshold: 10,
  outOfStockAction: 'show',
  
  autoGenerateSKU: true,
  skuPrefix: 'SKU',
  skuLength: 8,
  
  barcodeFormat: 'ean13',
  autoGenerateBarcode: false,
  
  defaultUnit: 'cái',
  enableMultipleUnits: true,
  
  enableBatchTracking: false,
  requireExpiryDate: false,
  expiryWarningDays: 30,
  
  enableSerialTracking: false,
  
  costMethod: 'average',
};

/**
 * Get general inventory settings
 */
export async function getInventoryGeneralSettings(): Promise<ActionResult<InventoryGeneralSettings>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: INVENTORY_GENERAL_KEY },
    });

    if (!settings) {
      return { success: true, data: DEFAULT_INVENTORY_SETTINGS };
    }

    return {
      success: true,
      data: { ...DEFAULT_INVENTORY_SETTINGS, ...(settings.metadata as Record<string, unknown>) } as InventoryGeneralSettings,
    };
  } catch (error) {
    console.error('Failed to get inventory settings:', error);
    return { success: false, error: 'Không thể tải cài đặt kho hàng' };
  }
}

/**
 * Update general inventory settings
 */
export async function updateInventoryGeneralSettings(
  data: Partial<InventoryGeneralSettings>
): Promise<ActionResult<InventoryGeneralSettings>> {
  try {
    const result = await getInventoryGeneralSettings();
    if (!result.success) return { success: false, error: result.error };

    const updated = { ...result.data, ...data };

    const existing = await prisma.settingsData.findFirst({
      where: { type: INVENTORY_GENERAL_KEY },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: updated as unknown as Prisma.InputJsonValue },
      });
    } else {
      const settingsId = await generateIdWithPrefix('INV_GENERAL', prisma);
      await prisma.settingsData.create({
        data: {
          systemId: settingsId,
          id: settingsId,
          type: INVENTORY_GENERAL_KEY,
          name: 'Inventory General Settings',
          metadata: updated as unknown as Prisma.InputJsonValue,
        },
      });
    }

    revalidatePath('/settings/inventory');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Failed to update inventory settings:', error);
    return { success: false, error: 'Không thể cập nhật cài đặt kho hàng' };
  }
}

/**
 * Reset inventory settings to defaults
 */
export async function resetInventoryGeneralSettings(): Promise<ActionResult<InventoryGeneralSettings>> {
  try {
    const existing = await prisma.settingsData.findFirst({
      where: { type: INVENTORY_GENERAL_KEY },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: DEFAULT_INVENTORY_SETTINGS as unknown as Prisma.InputJsonValue },
      });
    }

    revalidatePath('/settings/inventory');
    return { success: true, data: DEFAULT_INVENTORY_SETTINGS };
  } catch (error) {
    console.error('Failed to reset inventory settings:', error);
    return { success: false, error: 'Không thể đặt lại cài đặt kho hàng' };
  }
}
