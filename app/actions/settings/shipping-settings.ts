'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface ShippingSettings {
  // Weight settings
  weightSource: 'product' | 'custom';
  customWeight: number;
  weightUnit: 'gram' | 'kilogram';
  
  // Dimensions
  length: number;
  width: number;
  height: number;
  
  // Delivery requirements
  deliveryRequirement: string;
  shippingNote: string;
  
  // Automation settings
  autoSyncStatus: boolean;
  autoCancelOrder: boolean;
  autoSyncCod: boolean;
  
  // Warning thresholds
  latePickupWarningDays: number;
  lateDeliveryWarningDays: number;
}

const SETTINGS_TYPE = 'shipping-settings';

const DEFAULT_SETTINGS: ShippingSettings = {
  weightSource: 'product',
  customWeight: 500,
  weightUnit: 'gram',
  
  length: 20,
  width: 15,
  height: 10,
  
  deliveryRequirement: '',
  shippingNote: '',
  
  autoSyncStatus: true,
  autoCancelOrder: false,
  autoSyncCod: true,
  
  latePickupWarningDays: 2,
  lateDeliveryWarningDays: 3,
};

/**
 * Get shipping settings
 */
export async function getShippingSettings(): Promise<ActionResult<ShippingSettings>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: SETTINGS_TYPE },
    });

    if (!settings) {
      return { success: true, data: DEFAULT_SETTINGS };
    }

    return {
      success: true,
      data: { ...DEFAULT_SETTINGS, ...(settings.metadata as Record<string, unknown>) } as ShippingSettings,
    };
  } catch (error) {
    console.error('Failed to get shipping settings:', error);
    return { success: false, error: 'Không thể tải cài đặt vận chuyển' };
  }
}

/**
 * Save/Update shipping settings
 */
export async function saveShippingSettings(
  data: Partial<ShippingSettings>
): Promise<ActionResult<ShippingSettings>> {
  try {
    const result = await getShippingSettings();
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
      const tempId = await generateIdWithPrefix('SHIPPING_SETTINGS', prisma);
      await prisma.settingsData.create({
        data: {
          systemId: tempId,
          id: tempId,
          type: SETTINGS_TYPE,
          name: 'Shipping Settings',
          metadata: updated as unknown as Prisma.InputJsonValue,
        },
      });
    }

    revalidatePath('/settings/shipping');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Failed to save shipping settings:', error);
    return { success: false, error: 'Không thể lưu cài đặt vận chuyển' };
  }
}

/**
 * Reset shipping settings to defaults
 */
export async function resetShippingSettings(): Promise<ActionResult<ShippingSettings>> {
  try {
    const existing = await prisma.settingsData.findFirst({
      where: { type: SETTINGS_TYPE },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: DEFAULT_SETTINGS as unknown as Prisma.InputJsonValue },
      });
    }

    revalidatePath('/settings/shipping');
    return { success: true, data: DEFAULT_SETTINGS };
  } catch (error) {
    console.error('Failed to reset shipping settings:', error);
    return { success: false, error: 'Không thể đặt lại cài đặt vận chuyển' };
  }
}

// =============== Shipping Partners ===============

export interface ShippingPartnerConfig {
  systemId: string;
  code: string;
  name: string;
  logo?: string;
  isActive: boolean;
  apiKey?: string;
  apiSecret?: string;
  shopId?: string;
  accessToken?: string;
  webhookUrl?: string;
  testMode: boolean;
  credentials?: Record<string, string>;
  services?: ShippingService[];
}

export interface ShippingService {
  code: string;
  name: string;
  isActive: boolean;
  fee?: number;
}

const PARTNERS_KEY = 'shipping-partners';

/**
 * Get all shipping partners
 */
export async function getShippingPartners(): Promise<ActionResult<ShippingPartnerConfig[]>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: PARTNERS_KEY },
    });

    if (!settings || !settings.metadata) {
      return { success: true, data: [] };
    }

    const partners = (settings.metadata as Record<string, unknown>)?.items as ShippingPartnerConfig[] || [];
    return { success: true, data: partners };
  } catch (error) {
    console.error('Failed to get shipping partners:', error);
    return { success: false, error: 'Không thể tải đối tác vận chuyển' };
  }
}

/**
 * Get a shipping partner by code
 */
export async function getShippingPartnerByCode(
  code: string
): Promise<ActionResult<ShippingPartnerConfig | null>> {
  try {
    const result = await getShippingPartners();
    if (!result.success) return { success: false, error: result.error };

    const partner = result.data.find((p) => p.code === code);
    return { success: true, data: partner || null };
  } catch (error) {
    console.error('Failed to get shipping partner:', error);
    return { success: false, error: 'Không thể tải đối tác vận chuyển' };
  }
}

/**
 * Save/Update a shipping partner
 */
export async function saveShippingPartner(
  data: ShippingPartnerConfig
): Promise<ActionResult<ShippingPartnerConfig>> {
  try {
    const result = await getShippingPartners();
    if (!result.success) return { success: false, error: result.error };

    const index = result.data.findIndex((p) => p.code === data.code);
    let updated: ShippingPartnerConfig[];

    if (index === -1) {
      // Create new
      const newPartner = {
        ...data,
        systemId: data.systemId || await generateIdWithPrefix('SHIP', prisma),
      };
      updated = [...result.data, newPartner];
    } else {
      // Update existing
      updated = [...result.data];
      updated[index] = { ...updated[index], ...data };
    }

    const existing = await prisma.settingsData.findFirst({
      where: { type: PARTNERS_KEY },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: { items: updated } as unknown as Prisma.InputJsonValue },
      });
    } else {
      const tempId = await generateIdWithPrefix('SHIPPING_PARTNERS', prisma);
      await prisma.settingsData.create({
        data: {
          systemId: tempId,
          id: tempId,
          type: PARTNERS_KEY,
          name: 'Shipping Partners',
          metadata: { items: updated } as unknown as Prisma.InputJsonValue,
        },
      });
    }

    revalidatePath('/settings/shipping');
    return { success: true, data: data };
  } catch (error) {
    console.error('Failed to save shipping partner:', error);
    return { success: false, error: 'Không thể lưu đối tác vận chuyển' };
  }
}

/**
 * Delete a shipping partner
 */
export async function deleteShippingPartner(code: string): Promise<ActionResult<void>> {
  try {
    const result = await getShippingPartners();
    if (!result.success) return { success: false, error: result.error };

    const updated = result.data.filter((p) => p.code !== code);

    const existing = await prisma.settingsData.findFirst({
      where: { type: PARTNERS_KEY },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: { items: updated } as unknown as Prisma.InputJsonValue },
      });
    }

    revalidatePath('/settings/shipping');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to delete shipping partner:', error);
    return { success: false, error: 'Không thể xóa đối tác vận chuyển' };
  }
}

/**
 * Toggle shipping partner active status
 */
export async function toggleShippingPartnerActive(
  code: string
): Promise<ActionResult<ShippingPartnerConfig>> {
  try {
    const result = await getShippingPartners();
    if (!result.success) return { success: false, error: result.error };

    const index = result.data.findIndex((p) => p.code === code);
    if (index === -1) {
      return { success: false, error: 'Không tìm thấy đối tác vận chuyển' };
    }

    const updated = [...result.data];
    updated[index] = { ...updated[index], isActive: !updated[index].isActive };

    const existing = await prisma.settingsData.findFirst({
      where: { type: PARTNERS_KEY },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: { items: updated } as unknown as Prisma.InputJsonValue },
      });
    }

    revalidatePath('/settings/shipping');
    return { success: true, data: updated[index] };
  } catch (error) {
    console.error('Failed to toggle shipping partner:', error);
    return { success: false, error: 'Không thể cập nhật đối tác vận chuyển' };
  }
}

/**
 * Get active shipping partners
 */
export async function getActiveShippingPartners(): Promise<ActionResult<ShippingPartnerConfig[]>> {
  try {
    const result = await getShippingPartners();
    if (!result.success) return { success: false, error: result.error };

    const active = result.data.filter((p) => p.isActive);
    return { success: true, data: active };
  } catch (error) {
    console.error('Failed to get active shipping partners:', error);
    return { success: false, error: 'Không thể tải đối tác vận chuyển' };
  }
}

// =============== Fee Configurations ===============

export interface ShippingFeeConfig {
  systemId: string;
  name: string;
  type: 'flat' | 'weight' | 'price' | 'zone';
  isActive: boolean;
  flatFee?: number;
  weightRanges?: WeightRange[];
  priceRanges?: PriceRange[];
  zones?: ZoneFee[];
  freeShippingThreshold?: number;
}

export interface WeightRange {
  minWeight: number;
  maxWeight: number;
  fee: number;
}

export interface PriceRange {
  minPrice: number;
  maxPrice: number;
  fee: number;
}

export interface ZoneFee {
  zone: string;
  provinces: string[];
  fee: number;
}

const FEE_CONFIG_KEY = 'shipping-fee-config';

/**
 * Get shipping fee configurations
 */
export async function getShippingFeeConfigs(): Promise<ActionResult<ShippingFeeConfig[]>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: FEE_CONFIG_KEY },
    });

    if (!settings || !settings.metadata) {
      return { success: true, data: [] };
    }

    const configs = (settings.metadata as Record<string, unknown>)?.items as ShippingFeeConfig[] || [];
    return { success: true, data: configs };
  } catch (error) {
    console.error('Failed to get shipping fee configs:', error);
    return { success: false, error: 'Không thể tải cấu hình phí vận chuyển' };
  }
}

/**
 * Save shipping fee configuration
 */
export async function saveShippingFeeConfig(
  data: ShippingFeeConfig
): Promise<ActionResult<ShippingFeeConfig>> {
  try {
    const result = await getShippingFeeConfigs();
    if (!result.success) return { success: false, error: result.error };

    const index = result.data.findIndex((c) => c.systemId === data.systemId);
    let updated: ShippingFeeConfig[];

    if (index === -1) {
      // Create new
      const newConfig = {
        ...data,
        systemId: data.systemId || await generateIdWithPrefix('FEE', prisma),
      };
      updated = [...result.data, newConfig];
    } else {
      // Update existing
      updated = [...result.data];
      updated[index] = { ...updated[index], ...data };
    }

    const existing = await prisma.settingsData.findFirst({
      where: { type: FEE_CONFIG_KEY },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: { items: updated } as unknown as Prisma.InputJsonValue },
      });
    } else {
      const tempId = await generateIdWithPrefix('SHIPPING_FEE_CONFIG', prisma);
      await prisma.settingsData.create({
        data: {
          systemId: tempId,
          id: tempId,
          type: FEE_CONFIG_KEY,
          name: 'Shipping Fee Configurations',
          metadata: { items: updated } as unknown as Prisma.InputJsonValue,
        },
      });
    }

    revalidatePath('/settings/shipping');
    return { success: true, data: data };
  } catch (error) {
    console.error('Failed to save shipping fee config:', error);
    return { success: false, error: 'Không thể lưu cấu hình phí vận chuyển' };
  }
}

/**
 * Delete shipping fee configuration
 */
export async function deleteShippingFeeConfig(systemId: string): Promise<ActionResult<void>> {
  try {
    const result = await getShippingFeeConfigs();
    if (!result.success) return { success: false, error: result.error };

    const updated = result.data.filter((c) => c.systemId !== systemId);

    const existing = await prisma.settingsData.findFirst({
      where: { type: FEE_CONFIG_KEY },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: { items: updated } as unknown as Prisma.InputJsonValue },
      });
    }

    revalidatePath('/settings/shipping');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to delete shipping fee config:', error);
    return { success: false, error: 'Không thể xóa cấu hình phí vận chuyển' };
  }
}
