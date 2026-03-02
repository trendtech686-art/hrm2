'use server';

/**
 * Server Actions for Payment Types (using SettingsData)
 * 
 * Payment types are stored in SettingsData with type='payment-type'
 */

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

const SETTINGS_TYPE = 'payment-type';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface PaymentType {
  systemId: string;
  id: string;
  name: string;
  description?: string | null;
  isBusinessResult?: boolean;
  isActive: boolean;
  isDefault: boolean;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentTypeFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
  isBusinessResult?: boolean;
}

export interface PaymentTypeResponse {
  data: PaymentType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaymentTypeCreateInput {
  id?: string;
  name: string;
  description?: string;
  isBusinessResult?: boolean;
  isActive?: boolean;
  isDefault?: boolean;
  color?: string;
}

export interface PaymentTypeUpdateInput extends Partial<PaymentTypeCreateInput> {}

function mapRecord(item: { metadata?: unknown } & Record<string, unknown>): PaymentType {
  const meta = (item.metadata as Record<string, unknown>) || {};
  return {
    systemId: item.systemId as string,
    id: item.id as string,
    name: item.name as string,
    description: item.description as string | null,
    isBusinessResult: meta.isBusinessResult as boolean | undefined,
    isActive: item.isActive as boolean,
    isDefault: item.isDefault as boolean,
    color: meta.color as string | undefined,
    createdAt: item.createdAt as Date,
    updatedAt: item.updatedAt as Date,
  };
}

/**
 * Fetch payment types with pagination and filters
 */
export async function getPaymentTypes(
  filters: PaymentTypeFilters = {}
): Promise<ActionResult<PaymentTypeResponse>> {
  try {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    const where = {
      type: SETTINGS_TYPE,
      isDeleted: false,
    } as { type: string; isDeleted: boolean; isActive?: boolean };
    if (filters.isActive !== undefined) where.isActive = filters.isActive;

    const [data, total] = await Promise.all([
      prisma.settingsData.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      prisma.settingsData.count({ where }),
    ]);

    // Filter by isBusinessResult if needed (stored in metadata)
    let filtered = data;
    if (filters.isBusinessResult !== undefined) {
      filtered = data.filter(item => {
        const meta = (item.metadata as Record<string, unknown>) || {};
        return meta.isBusinessResult === filters.isBusinessResult;
      });
    }

    return {
      success: true,
      data: {
        data: filtered.map(mapRecord),
        pagination: {
          page,
          limit,
          total: filters.isBusinessResult !== undefined ? filtered.length : total,
          totalPages: Math.ceil((filters.isBusinessResult !== undefined ? filtered.length : total) / limit),
        },
      },
    };
  } catch (error) {
    console.error('Failed to fetch payment types:', error);
    return { success: false, error: 'Không thể tải danh sách loại phiếu chi' };
  }
}

/**
 * Get single payment type by systemId
 */
export async function getPaymentType(systemId: string): Promise<ActionResult<PaymentType>> {
  try {
    const item = await prisma.settingsData.findFirst({
      where: { systemId, type: SETTINGS_TYPE, isDeleted: false },
    });

    if (!item) {
      return { success: false, error: 'Loại phiếu chi không tồn tại' };
    }

    return { success: true, data: mapRecord(item) };
  } catch (error) {
    console.error('Failed to fetch payment type:', error);
    return { success: false, error: 'Không thể tải loại phiếu chi' };
  }
}

/**
 * Create new payment type
 */
export async function createPaymentType(
  input: PaymentTypeCreateInput
): Promise<ActionResult<PaymentType>> {
  try {
    const systemId = await generateIdWithPrefix('PT', prisma);
    const id = input.id || systemId;

    // If setting as default, unset all other defaults
    if (input.isDefault) {
      await prisma.settingsData.updateMany({
        where: { type: SETTINGS_TYPE, isDeleted: false, isDefault: true },
        data: { isDefault: false },
      });
    }

    const metadata: Record<string, unknown> = {};
    if (input.isBusinessResult !== undefined) metadata.isBusinessResult = input.isBusinessResult;
    if (input.color) metadata.color = input.color;

    const created = await prisma.settingsData.create({
      data: {
        systemId,
        id,
        type: SETTINGS_TYPE,
        name: input.name,
        description: input.description,
        isActive: input.isActive ?? true,
        isDefault: input.isDefault ?? false,
        metadata: metadata as Prisma.InputJsonValue,
      },
    });

    revalidatePath('/settings/payment-types');
    return { success: true, data: mapRecord(created) };
  } catch (error) {
    console.error('Failed to create payment type:', error);
    return { success: false, error: 'Không thể tạo loại phiếu chi' };
  }
}

/**
 * Update payment type
 */
export async function updatePaymentType(
  systemId: string,
  input: PaymentTypeUpdateInput
): Promise<ActionResult<PaymentType>> {
  try {
    const existing = await prisma.settingsData.findFirst({
      where: { systemId, type: SETTINGS_TYPE },
    });

    if (!existing) {
      return { success: false, error: 'Loại phiếu chi không tồn tại' };
    }

    // If setting as default, unset all other defaults
    if (input.isDefault) {
      await prisma.settingsData.updateMany({
        where: { type: SETTINGS_TYPE, isDeleted: false, isDefault: true, systemId: { not: systemId } },
        data: { isDefault: false },
      });
    }

    const existingMeta = (existing.metadata as Record<string, unknown>) || {};
    const metadata: Record<string, unknown> = { ...existingMeta };
    if (input.isBusinessResult !== undefined) metadata.isBusinessResult = input.isBusinessResult;
    if (input.color !== undefined) metadata.color = input.color;

    const updated = await prisma.settingsData.update({
      where: { systemId },
      data: {
        id: input.id ?? existing.id,
        name: input.name ?? existing.name,
        description: input.description ?? existing.description,
        isActive: input.isActive ?? existing.isActive,
        isDefault: input.isDefault ?? existing.isDefault,
        metadata: metadata as Prisma.InputJsonValue,
      },
    });

    revalidatePath('/settings/payment-types');
    return { success: true, data: mapRecord(updated) };
  } catch (error) {
    console.error('Failed to update payment type:', error);
    return { success: false, error: 'Không thể cập nhật loại phiếu chi' };
  }
}

/**
 * Delete payment type
 */
export async function deletePaymentType(systemId: string): Promise<ActionResult<void>> {
  try {
    // Check if payment type is used by any payments
    const paymentsCount = await prisma.payment.count({
      where: { paymentReceiptTypeSystemId: systemId },
    });

    if (paymentsCount > 0) {
      return {
        success: false,
        error: `Không thể xóa loại phiếu chi đang được sử dụng bởi ${paymentsCount} phiếu`,
      };
    }

    await prisma.settingsData.delete({ where: { systemId } });

    revalidatePath('/settings/payment-types');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to delete payment type:', error);
    return { success: false, error: 'Không thể xóa loại phiếu chi' };
  }
}

/**
 * Toggle payment type active status
 */
export async function togglePaymentTypeActive(systemId: string): Promise<ActionResult<PaymentType>> {
  try {
    const existing = await prisma.settingsData.findFirst({
      where: { systemId, type: SETTINGS_TYPE },
    });

    if (!existing) {
      return { success: false, error: 'Loại phiếu chi không tồn tại' };
    }

    const updated = await prisma.settingsData.update({
      where: { systemId },
      data: { isActive: !existing.isActive },
    });

    revalidatePath('/settings/payment-types');
    return { success: true, data: mapRecord(updated) };
  } catch (error) {
    console.error('Failed to toggle payment type:', error);
    return { success: false, error: 'Không thể thay đổi trạng thái loại phiếu chi' };
  }
}

/**
 * Set payment type as default
 */
export async function setDefaultPaymentType(systemId: string): Promise<ActionResult<PaymentType>> {
  try {
    // Unset all other defaults
    await prisma.settingsData.updateMany({
      where: { type: SETTINGS_TYPE, isDeleted: false, isDefault: true },
      data: { isDefault: false },
    });

    const updated = await prisma.settingsData.update({
      where: { systemId },
      data: { isDefault: true },
    });

    revalidatePath('/settings/payment-types');
    return { success: true, data: mapRecord(updated) };
  } catch (error) {
    console.error('Failed to set default payment type:', error);
    return { success: false, error: 'Không thể đặt loại phiếu chi mặc định' };
  }
}
