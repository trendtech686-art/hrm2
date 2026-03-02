'use server';

/**
 * Server Actions for Receipt Types (using SettingsData)
 * 
 * Receipt types are stored in SettingsData with type='receipt-type'
 */

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

const SETTINGS_TYPE = 'receipt-type';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface ReceiptType {
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

export interface ReceiptTypeFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
  isBusinessResult?: boolean;
}

export interface ReceiptTypeResponse {
  data: ReceiptType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ReceiptTypeCreateInput {
  id?: string;
  name: string;
  description?: string;
  isBusinessResult?: boolean;
  isActive?: boolean;
  isDefault?: boolean;
  color?: string;
}

export interface ReceiptTypeUpdateInput extends Partial<ReceiptTypeCreateInput> {}

function mapRecord(item: { metadata?: unknown } & Record<string, unknown>): ReceiptType {
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
 * Fetch receipt types with pagination and filters
 */
export async function getReceiptTypes(
  filters: ReceiptTypeFilters = {}
): Promise<ActionResult<ReceiptTypeResponse>> {
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
    console.error('Failed to fetch receipt types:', error);
    return { success: false, error: 'Không thể tải danh sách loại phiếu thu' };
  }
}

/**
 * Get single receipt type by systemId
 */
export async function getReceiptType(systemId: string): Promise<ActionResult<ReceiptType>> {
  try {
    const item = await prisma.settingsData.findFirst({
      where: { systemId, type: SETTINGS_TYPE, isDeleted: false },
    });

    if (!item) {
      return { success: false, error: 'Loại phiếu thu không tồn tại' };
    }

    return { success: true, data: mapRecord(item) };
  } catch (error) {
    console.error('Failed to fetch receipt type:', error);
    return { success: false, error: 'Không thể tải loại phiếu thu' };
  }
}

/**
 * Create new receipt type
 */
export async function createReceiptType(
  input: ReceiptTypeCreateInput
): Promise<ActionResult<ReceiptType>> {
  try {
    const systemId = await generateIdWithPrefix('RCPT', prisma);
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

    revalidatePath('/settings/receipt-types');
    return { success: true, data: mapRecord(created) };
  } catch (error) {
    console.error('Failed to create receipt type:', error);
    return { success: false, error: 'Không thể tạo loại phiếu thu' };
  }
}

/**
 * Update receipt type
 */
export async function updateReceiptType(
  systemId: string,
  input: ReceiptTypeUpdateInput
): Promise<ActionResult<ReceiptType>> {
  try {
    const existing = await prisma.settingsData.findFirst({
      where: { systemId, type: SETTINGS_TYPE },
    });

    if (!existing) {
      return { success: false, error: 'Loại phiếu thu không tồn tại' };
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

    revalidatePath('/settings/receipt-types');
    return { success: true, data: mapRecord(updated) };
  } catch (error) {
    console.error('Failed to update receipt type:', error);
    return { success: false, error: 'Không thể cập nhật loại phiếu thu' };
  }
}

/**
 * Delete receipt type
 */
export async function deleteReceiptType(systemId: string): Promise<ActionResult<void>> {
  try {
    // Check if receipt type is used by any receipts
    const receiptsCount = await prisma.receipt.count({
      where: { paymentReceiptTypeSystemId: systemId },
    });

    if (receiptsCount > 0) {
      return {
        success: false,
        error: `Không thể xóa loại phiếu thu đang được sử dụng bởi ${receiptsCount} phiếu`,
      };
    }

    await prisma.settingsData.delete({ where: { systemId } });

    revalidatePath('/settings/receipt-types');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to delete receipt type:', error);
    return { success: false, error: 'Không thể xóa loại phiếu thu' };
  }
}

/**
 * Toggle receipt type active status
 */
export async function toggleReceiptTypeActive(systemId: string): Promise<ActionResult<ReceiptType>> {
  try {
    const existing = await prisma.settingsData.findFirst({
      where: { systemId, type: SETTINGS_TYPE },
    });

    if (!existing) {
      return { success: false, error: 'Loại phiếu thu không tồn tại' };
    }

    const updated = await prisma.settingsData.update({
      where: { systemId },
      data: { isActive: !existing.isActive },
    });

    revalidatePath('/settings/receipt-types');
    return { success: true, data: mapRecord(updated) };
  } catch (error) {
    console.error('Failed to toggle receipt type:', error);
    return { success: false, error: 'Không thể thay đổi trạng thái loại phiếu thu' };
  }
}

/**
 * Set receipt type as default
 */
export async function setDefaultReceiptType(systemId: string): Promise<ActionResult<ReceiptType>> {
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

    revalidatePath('/settings/receipt-types');
    return { success: true, data: mapRecord(updated) };
  } catch (error) {
    console.error('Failed to set default receipt type:', error);
    return { success: false, error: 'Không thể đặt loại phiếu thu mặc định' };
  }
}
