'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

/**
 * Receipt Types & Payment Types Server Actions
 * Uses SettingsData model with type = 'receipt-type' | 'payment-type'
 */

type SettingsData = NonNullable<Awaited<ReturnType<typeof prisma.settingsData.findFirst>>>;

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type FinanceSettingType = 'receipt-type' | 'payment-type';

export interface FinanceSettingFilters {
  page?: number;
  limit?: number;
  search?: string;
  type: FinanceSettingType;
  isActive?: boolean;
}

export interface PaginatedFinanceSettings {
  data: SettingsData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getFinanceSettings(
  filters: FinanceSettingFilters
): Promise<ActionResult<PaginatedFinanceSettings>> {
  try {
    const { page = 1, limit = 50, search, type, isActive } = filters;

    const where: Record<string, unknown> = { type };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (isActive !== undefined) where.isActive = isActive;

    const [data, total] = await Promise.all([
      prisma.settingsData.findMany({
        where,
        orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.settingsData.count({ where }),
    ]);

    return {
      success: true,
      data: {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error('Failed to fetch finance settings:', error);
    return { success: false, error: 'Không thể tải danh sách loại thu/chi' };
  }
}

export async function getFinanceSettingById(
  systemId: string
): Promise<ActionResult<SettingsData>> {
  try {
    const setting = await prisma.settingsData.findUnique({
      where: { systemId },
    });
    if (!setting) {
      return { success: false, error: 'Không tìm thấy loại thu/chi' };
    }
    return { success: true, data: setting };
  } catch (error) {
    console.error('Failed to fetch finance setting:', error);
    return { success: false, error: 'Không thể tải thông tin loại thu/chi' };
  }
}

export async function createFinanceSetting(
  data: Record<string, unknown>
): Promise<ActionResult<SettingsData>> {
  try {
    const name = data.name as string;
    const type = data.type as FinanceSettingType;
    const id = (data.id as string) || name.toUpperCase().replace(/\s+/g, '');

    // Check unique id within type
    const existing = await prisma.settingsData.findFirst({
      where: { id, type },
    });
    if (existing) {
      return { success: false, error: 'Mã loại thu/chi đã tồn tại' };
    }

    // Handle default
    if (data.isDefault) {
      await prisma.settingsData.updateMany({
        where: { type, isDefault: true },
        data: { isDefault: false },
      });
    }

    const metadata: Record<string, unknown> = {
      ...(data.metadata as Record<string, unknown> || {}),
      color: data.color,
      isBusinessResult: data.isBusinessResult ?? false,
      isSystem: data.isSystem ?? false,
    };

    const setting = await prisma.settingsData.create({
      data: {
        systemId: await generateIdWithPrefix('FIN_SETT', prisma),
        id,
        name,
        type,
        description: data.description as string | undefined,
        isDefault: (data.isDefault as boolean) ?? false,
        isActive: (data.isActive as boolean) ?? true,
        metadata: metadata as Prisma.InputJsonValue,
        createdBy: data.createdBy as string | undefined,
      },
    });

    revalidatePath('/settings/finance');
    revalidatePath('/finance');
    return { success: true, data: setting };
  } catch (error) {
    console.error('Failed to create finance setting:', error);
    return { success: false, error: 'Không thể tạo loại thu/chi' };
  }
}

export async function updateFinanceSetting(
  systemId: string,
  data: Record<string, unknown>
): Promise<ActionResult<SettingsData>> {
  try {
    const existing = await prisma.settingsData.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy loại thu/chi' };
    }

    // Check if system setting
    const existingMetadata = (existing.metadata as Record<string, unknown>) || {};
    if (existingMetadata.isSystem) {
      return { success: false, error: 'Không thể chỉnh sửa cài đặt hệ thống' };
    }

    // Handle default
    if (data.isDefault && !existing.isDefault) {
      await prisma.settingsData.updateMany({
        where: { type: existing.type, isDefault: true, NOT: { systemId } },
        data: { isDefault: false },
      });
    }

    const metadata: Record<string, unknown> = {
      ...existingMetadata,
      ...(data.metadata as Record<string, unknown> || {}),
    };
    if (data.color !== undefined) metadata.color = data.color;
    if (data.isBusinessResult !== undefined) metadata.isBusinessResult = data.isBusinessResult;

    const setting = await prisma.settingsData.update({
      where: { systemId },
      data: {
        name: data.name as string | undefined,
        description: data.description as string | undefined,
        isDefault: data.isDefault as boolean | undefined,
        isActive: data.isActive as boolean | undefined,
        metadata: metadata as Prisma.InputJsonValue,
        updatedBy: data.updatedBy as string | undefined,
      },
    });

    revalidatePath('/settings/finance');
    revalidatePath('/finance');
    return { success: true, data: setting };
  } catch (error) {
    console.error('Failed to update finance setting:', error);
    return { success: false, error: 'Không thể cập nhật loại thu/chi' };
  }
}

export async function deleteFinanceSetting(
  systemId: string
): Promise<ActionResult<SettingsData>> {
  try {
    const existing = await prisma.settingsData.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy loại thu/chi' };
    }

    // Check if system setting
    const existingMetadata = (existing.metadata as Record<string, unknown>) || {};
    if (existingMetadata.isSystem) {
      return { success: false, error: 'Không thể xóa cài đặt hệ thống' };
    }

    // Check if in use
    let inUse = false;
    if (existing.type === 'receipt-type') {
      const count = await prisma.receipt.count({ where: { paymentReceiptTypeSystemId: existing.systemId } });
      inUse = count > 0;
    } else if (existing.type === 'payment-type') {
      const count = await prisma.payment.count({ where: { paymentReceiptTypeSystemId: existing.systemId } });
      inUse = count > 0;
    }

    if (inUse) {
      // Soft delete by setting isActive = false
      const setting = await prisma.settingsData.update({
        where: { systemId },
        data: { isActive: false },
      });
      revalidatePath('/settings/finance');
      return { success: true, data: setting };
    }

    const setting = await prisma.settingsData.delete({
      where: { systemId },
    });

    revalidatePath('/settings/finance');
    return { success: true, data: setting };
  } catch (error) {
    console.error('Failed to delete finance setting:', error);
    return { success: false, error: 'Không thể xóa loại thu/chi' };
  }
}

export async function setDefaultFinanceSetting(
  systemId: string
): Promise<ActionResult<SettingsData>> {
  try {
    const existing = await prisma.settingsData.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy loại thu/chi' };
    }

    await prisma.$transaction([
      prisma.settingsData.updateMany({
        where: { type: existing.type, isDefault: true },
        data: { isDefault: false },
      }),
      prisma.settingsData.update({
        where: { systemId },
        data: { isDefault: true },
      }),
    ]);

    const setting = await prisma.settingsData.findUnique({ where: { systemId } });
    if (!setting) {
      return { success: false, error: 'Không tìm thấy loại thu/chi' };
    }

    revalidatePath('/settings/finance');
    return { success: true, data: setting };
  } catch (error) {
    console.error('Failed to set default finance setting:', error);
    return { success: false, error: 'Không thể đặt mặc định' };
  }
}

export async function toggleFinanceSettingActive(
  systemId: string
): Promise<ActionResult<SettingsData>> {
  try {
    const existing = await prisma.settingsData.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy loại thu/chi' };
    }

    // Check if system setting
    const existingMetadata = (existing.metadata as Record<string, unknown>) || {};
    if (existingMetadata.isSystem) {
      return { success: false, error: 'Không thể thay đổi trạng thái cài đặt hệ thống' };
    }

    const setting = await prisma.settingsData.update({
      where: { systemId },
      data: { isActive: !existing.isActive },
    });

    revalidatePath('/settings/finance');
    return { success: true, data: setting };
  } catch (error) {
    console.error('Failed to toggle finance setting active:', error);
    return { success: false, error: 'Không thể thay đổi trạng thái' };
  }
}

export async function getActiveFinanceSettings(
  type: FinanceSettingType
): Promise<ActionResult<SettingsData[]>> {
  try {
    const settings = await prisma.settingsData.findMany({
      where: { type, isActive: true },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    });
    return { success: true, data: settings };
  } catch (error) {
    console.error('Failed to fetch active finance settings:', error);
    return { success: false, error: 'Không thể tải danh sách loại thu/chi' };
  }
}

// ============== Convenience functions ==============

export async function getReceiptTypes() {
  return getActiveFinanceSettings('receipt-type');
}

export async function getPaymentTypes() {
  return getActiveFinanceSettings('payment-type');
}

export async function getReceiptTypesList(filters: Omit<FinanceSettingFilters, 'type'> = {}) {
  return getFinanceSettings({ ...filters, type: 'receipt-type' });
}

export async function getPaymentTypesList(filters: Omit<FinanceSettingFilters, 'type'> = {}) {
  return getFinanceSettings({ ...filters, type: 'payment-type' });
}
