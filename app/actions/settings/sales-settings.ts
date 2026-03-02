'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface SalesManagementSettings {
  // Order settings
  orderPrefix: string;
  orderAutoConfirm: boolean;
  orderRequireCustomer: boolean;
  orderRequireEmployee: boolean;
  allowNegativeStock: boolean;
  autoReserveStock: boolean;
  
  // Pricing settings
  defaultPriceType: 'retail' | 'wholesale' | 'vip';
  allowPriceEdit: boolean;
  maxDiscountPercent: number;
  requireDiscountApproval: boolean;
  
  // Payment settings
  allowPartialPayment: boolean;
  allowCreditSales: boolean;
  defaultPaymentMethod: string;
  
  // Delivery settings
  defaultDeliveryMethod: string;
  requireShippingAddress: boolean;
  autoCreatePackaging: boolean;
  
  // Invoice settings
  autoGenerateInvoice: boolean;
  invoicePrefix: string;
  
  // Return settings
  allowReturns: boolean;
  maxReturnDays: number;
  requireReturnReason: boolean;
  
  // Notifications
  notifyOnNewOrder: boolean;
  notifyOnOrderComplete: boolean;
  notifyOnReturn: boolean;
}

const SETTINGS_TYPE = 'sales-management';

const DEFAULT_SETTINGS: SalesManagementSettings = {
  orderPrefix: 'DH',
  orderAutoConfirm: false,
  orderRequireCustomer: false,
  orderRequireEmployee: true,
  allowNegativeStock: false,
  autoReserveStock: true,
  
  defaultPriceType: 'retail',
  allowPriceEdit: true,
  maxDiscountPercent: 50,
  requireDiscountApproval: false,
  
  allowPartialPayment: true,
  allowCreditSales: true,
  defaultPaymentMethod: '',
  
  defaultDeliveryMethod: '',
  requireShippingAddress: false,
  autoCreatePackaging: true,
  
  autoGenerateInvoice: false,
  invoicePrefix: 'HD',
  
  allowReturns: true,
  maxReturnDays: 30,
  requireReturnReason: true,
  
  notifyOnNewOrder: true,
  notifyOnOrderComplete: true,
  notifyOnReturn: true,
};

/**
 * Get sales management settings
 */
export async function getSalesSettings(): Promise<ActionResult<SalesManagementSettings>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: SETTINGS_TYPE },
    });

    if (!settings) {
      return { success: true, data: DEFAULT_SETTINGS };
    }

    return {
      success: true,
      data: { ...DEFAULT_SETTINGS, ...(settings.metadata as Record<string, unknown>) } as SalesManagementSettings,
    };
  } catch (error) {
    console.error('Failed to get sales settings:', error);
    return { success: false, error: 'Không thể tải cài đặt bán hàng' };
  }
}

/**
 * Update sales management settings
 */
export async function updateSalesSettings(
  data: Partial<SalesManagementSettings>
): Promise<ActionResult<SalesManagementSettings>> {
  try {
    const result = await getSalesSettings();
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
      const tempId = await generateIdWithPrefix('SALES_SETTINGS', prisma);
      await prisma.settingsData.create({
        data: {
          systemId: tempId,
          id: SETTINGS_TYPE,
          type: SETTINGS_TYPE,
          name: 'Sales Management Settings',
          metadata: updated as unknown as Prisma.InputJsonValue,
        },
      });
    }

    revalidatePath('/settings/sales');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Failed to update sales settings:', error);
    return { success: false, error: 'Không thể cập nhật cài đặt bán hàng' };
  }
}

/**
 * Reset sales settings to defaults
 */
export async function resetSalesSettings(): Promise<ActionResult<SalesManagementSettings>> {
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

    revalidatePath('/settings/sales');
    return { success: true, data: DEFAULT_SETTINGS };
  } catch (error) {
    console.error('Failed to reset sales settings:', error);
    return { success: false, error: 'Không thể đặt lại cài đặt bán hàng' };
  }
}

/**
 * Get order prefix for generating order IDs
 */
export async function getOrderPrefix(): Promise<ActionResult<string>> {
  try {
    const result = await getSalesSettings();
    if (!result.success) return { success: false, error: result.error };
    return { success: true, data: result.data.orderPrefix || 'DH' };
  } catch (error) {
    console.error('Failed to get order prefix:', error);
    return { success: false, error: 'Không thể tải prefix đơn hàng' };
  }
}

/**
 * Check if negative stock is allowed
 */
export async function isNegativeStockAllowed(): Promise<ActionResult<boolean>> {
  try {
    const result = await getSalesSettings();
    if (!result.success) return { success: false, error: result.error };
    return { success: true, data: result.data.allowNegativeStock };
  } catch (error) {
    console.error('Failed to check negative stock setting:', error);
    return { success: false, error: 'Không thể kiểm tra cài đặt tồn kho âm' };
  }
}
