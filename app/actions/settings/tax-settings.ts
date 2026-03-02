'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface TaxSettings {
  priceIncludesTax: boolean;
  defaultSaleTaxId: string | null;
  defaultPurchaseTaxId: string | null;
}

const SETTINGS_TYPE = 'tax-settings';

const DEFAULT_SETTINGS: TaxSettings = {
  priceIncludesTax: false,
  defaultSaleTaxId: null,
  defaultPurchaseTaxId: null,
};

/**
 * Get tax settings
 */
export async function getTaxSettings(): Promise<ActionResult<TaxSettings>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: SETTINGS_TYPE },
    });

    if (!settings) {
      return { success: true, data: DEFAULT_SETTINGS };
    }

    return {
      success: true,
      data: { ...DEFAULT_SETTINGS, ...(settings.metadata as Record<string, unknown>) } as TaxSettings,
    };
  } catch (error) {
    console.error('Failed to get tax settings:', error);
    return { success: false, error: 'Không thể tải cài đặt thuế' };
  }
}

/**
 * Update tax settings
 */
export async function updateTaxSettings(
  data: Partial<TaxSettings>
): Promise<ActionResult<TaxSettings>> {
  try {
    const result = await getTaxSettings();
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
      const tempId = await generateIdWithPrefix('TAX_SETTINGS', prisma);
      await prisma.settingsData.create({
        data: {
          systemId: tempId,
          id: tempId,
          type: SETTINGS_TYPE,
          name: 'Tax Settings',
          metadata: updated as unknown as Prisma.InputJsonValue,
        },
      });
    }

    revalidatePath('/settings/taxes');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Failed to update tax settings:', error);
    return { success: false, error: 'Không thể cập nhật cài đặt thuế' };
  }
}

/**
 * Reset tax settings to defaults
 */
export async function resetTaxSettings(): Promise<ActionResult<TaxSettings>> {
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

    revalidatePath('/settings/taxes');
    return { success: true, data: DEFAULT_SETTINGS };
  } catch (error) {
    console.error('Failed to reset tax settings:', error);
    return { success: false, error: 'Không thể đặt lại cài đặt thuế' };
  }
}

/**
 * Check if prices include tax
 */
export async function isPriceIncludesTax(): Promise<ActionResult<boolean>> {
  try {
    const result = await getTaxSettings();
    if (!result.success) return { success: false, error: result.error };
    return { success: true, data: result.data.priceIncludesTax };
  } catch (error) {
    console.error('Failed to check price includes tax:', error);
    return { success: false, error: 'Không thể kiểm tra cài đặt thuế' };
  }
}

/**
 * Get default sale tax
 */
export async function getDefaultSaleTax(): Promise<ActionResult<{ systemId: string; name: string; rate: number } | null>> {
  try {
    const result = await getTaxSettings();
    if (!result.success) return { success: false, error: result.error };

    if (!result.data.defaultSaleTaxId) {
      return { success: true, data: null };
    }

    const tax = await prisma.tax.findUnique({
      where: { systemId: result.data.defaultSaleTaxId },
      select: { systemId: true, name: true, rate: true },
    });

    if (!tax) {
      return { success: true, data: null };
    }

    return {
      success: true,
      data: {
        systemId: tax.systemId,
        name: tax.name,
        rate: tax.rate.toNumber(),
      },
    };
  } catch (error) {
    console.error('Failed to get default sale tax:', error);
    return { success: false, error: 'Không thể tải thuế bán hàng mặc định' };
  }
}

/**
 * Get default purchase tax
 */
export async function getDefaultPurchaseTax(): Promise<ActionResult<{ systemId: string; name: string; rate: number } | null>> {
  try {
    const result = await getTaxSettings();
    if (!result.success) return { success: false, error: result.error };

    if (!result.data.defaultPurchaseTaxId) {
      return { success: true, data: null };
    }

    const tax = await prisma.tax.findUnique({
      where: { systemId: result.data.defaultPurchaseTaxId },
      select: { systemId: true, name: true, rate: true },
    });

    if (!tax) {
      return { success: true, data: null };
    }

    return {
      success: true,
      data: {
        systemId: tax.systemId,
        name: tax.name,
        rate: tax.rate.toNumber(),
      },
    };
  } catch (error) {
    console.error('Failed to get default purchase tax:', error);
    return { success: false, error: 'Không thể tải thuế mua hàng mặc định' };
  }
}
