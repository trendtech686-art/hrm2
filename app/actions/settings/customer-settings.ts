'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

/**
 * Customer Settings Server Actions
 * Manages customer-related settings like customer groups, levels, sources, etc.
 * Uses CustomerSetting model with different types
 */

type CustomerSetting = NonNullable<Awaited<ReturnType<typeof prisma.customerSetting.findFirst>>>;

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type CustomerSettingType = 
  | 'customer-group'      // Nhóm khách hàng
  | 'customer-level'      // Cấp độ khách hàng
  | 'customer-source'     // Nguồn khách hàng
  | 'customer-tag';       // Tag khách hàng

export interface CustomerSettingFilters {
  page?: number;
  limit?: number;
  search?: string;
  type: CustomerSettingType;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface PaginatedCustomerSettings {
  data: CustomerSetting[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getCustomerSettings(
  filters: CustomerSettingFilters
): Promise<ActionResult<PaginatedCustomerSettings>> {
  try {
    const { page = 1, limit = 50, search, type, isActive, isDeleted = false } = filters;

    const where: Record<string, unknown> = { type, isDeleted };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (isActive !== undefined) where.isActive = isActive;

    const [data, total] = await Promise.all([
      prisma.customerSetting.findMany({
        where,
        orderBy: [{ orderIndex: 'asc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.customerSetting.count({ where }),
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
    console.error('Failed to fetch customer settings:', error);
    return { success: false, error: 'Không thể tải danh sách cài đặt khách hàng' };
  }
}

export async function getCustomerSettingById(
  systemId: string
): Promise<ActionResult<CustomerSetting>> {
  try {
    const setting = await prisma.customerSetting.findUnique({
      where: { systemId },
    });
    if (!setting) {
      return { success: false, error: 'Không tìm thấy cài đặt' };
    }
    return { success: true, data: setting };
  } catch (error) {
    console.error('Failed to fetch customer setting:', error);
    return { success: false, error: 'Không thể tải thông tin cài đặt' };
  }
}

export async function createCustomerSetting(
  data: Record<string, unknown>
): Promise<ActionResult<CustomerSetting>> {
  try {
    const name = data.name as string;
    const type = data.type as CustomerSettingType;
    const id = (data.id as string) || name.toUpperCase().replace(/\s+/g, '-');

    // Check unique id within type
    const existing = await prisma.customerSetting.findFirst({
      where: { id, type },
    });
    if (existing) {
      return { success: false, error: 'Mã cài đặt đã tồn tại' };
    }

    // Handle default
    if (data.isDefault) {
      await prisma.customerSetting.updateMany({
        where: { type, isDefault: true, isDeleted: false },
        data: { isDefault: false },
      });
    }

    const setting = await prisma.customerSetting.create({
      data: {
        systemId: await generateIdWithPrefix('CUST_SETT', prisma),
        id,
        name,
        type,
        description: data.description as string | undefined,
        color: data.color as string | undefined,
        isDefault: (data.isDefault as boolean) ?? false,
        isActive: (data.isActive as boolean) ?? true,
        orderIndex: data.orderIndex as number | undefined,
        metadata: (data.metadata as object) ?? {},
        createdBy: data.createdBy as string | undefined,
      },
    });

    revalidatePath('/settings/customers');
    return { success: true, data: setting };
  } catch (error) {
    console.error('Failed to create customer setting:', error);
    return { success: false, error: 'Không thể tạo cài đặt' };
  }
}

export async function updateCustomerSetting(
  systemId: string,
  data: Record<string, unknown>
): Promise<ActionResult<CustomerSetting>> {
  try {
    const existing = await prisma.customerSetting.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy cài đặt' };
    }

    // Handle default
    if (data.isDefault && !existing.isDefault) {
      await prisma.customerSetting.updateMany({
        where: { type: existing.type, isDefault: true, isDeleted: false, NOT: { systemId } },
        data: { isDefault: false },
      });
    }

    const setting = await prisma.customerSetting.update({
      where: { systemId },
      data: {
        name: data.name as string | undefined,
        description: data.description as string | undefined,
        color: data.color as string | undefined,
        isDefault: data.isDefault as boolean | undefined,
        isActive: data.isActive as boolean | undefined,
        orderIndex: data.orderIndex as number | undefined,
        metadata: data.metadata as object | undefined,
        updatedBy: data.updatedBy as string | undefined,
      },
    });

    revalidatePath('/settings/customers');
    return { success: true, data: setting };
  } catch (error) {
    console.error('Failed to update customer setting:', error);
    return { success: false, error: 'Không thể cập nhật cài đặt' };
  }
}

export async function deleteCustomerSetting(
  systemId: string
): Promise<ActionResult<CustomerSetting>> {
  try {
    const existing = await prisma.customerSetting.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy cài đặt' };
    }

    // Check if in use by customers (by id, not systemId)
    const customersCount = await prisma.customer.count({
      where: {
        OR: [
          { customerGroup: existing.id },
          { type: existing.id },
          { source: existing.id },
        ],
      },
    });

    if (customersCount > 0) {
      // Soft delete
      const setting = await prisma.customerSetting.update({
        where: { systemId },
        data: { isDeleted: true, deletedAt: new Date() },
      });
      revalidatePath('/settings/customers');
      return { success: true, data: setting };
    }

    const setting = await prisma.customerSetting.update({
      where: { systemId },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    revalidatePath('/settings/customers');
    return { success: true, data: setting };
  } catch (error) {
    console.error('Failed to delete customer setting:', error);
    return { success: false, error: 'Không thể xóa cài đặt' };
  }
}

export async function restoreCustomerSetting(
  systemId: string
): Promise<ActionResult<CustomerSetting>> {
  try {
    const setting = await prisma.customerSetting.update({
      where: { systemId },
      data: { isDeleted: false, deletedAt: null },
    });

    revalidatePath('/settings/customers');
    return { success: true, data: setting };
  } catch (error) {
    console.error('Failed to restore customer setting:', error);
    return { success: false, error: 'Không thể khôi phục cài đặt' };
  }
}

export async function setDefaultCustomerSetting(
  systemId: string
): Promise<ActionResult<CustomerSetting>> {
  try {
    const existing = await prisma.customerSetting.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy cài đặt' };
    }

    await prisma.$transaction([
      prisma.customerSetting.updateMany({
        where: { type: existing.type, isDefault: true, isDeleted: false },
        data: { isDefault: false },
      }),
      prisma.customerSetting.update({
        where: { systemId },
        data: { isDefault: true },
      }),
    ]);

    const setting = await prisma.customerSetting.findUnique({ where: { systemId } });
    if (!setting) {
      return { success: false, error: 'Không tìm thấy cài đặt' };
    }

    revalidatePath('/settings/customers');
    return { success: true, data: setting };
  } catch (error) {
    console.error('Failed to set default customer setting:', error);
    return { success: false, error: 'Không thể đặt mặc định' };
  }
}

export async function toggleCustomerSettingActive(
  systemId: string
): Promise<ActionResult<CustomerSetting>> {
  try {
    const existing = await prisma.customerSetting.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy cài đặt' };
    }

    const setting = await prisma.customerSetting.update({
      where: { systemId },
      data: { isActive: !existing.isActive },
    });

    revalidatePath('/settings/customers');
    return { success: true, data: setting };
  } catch (error) {
    console.error('Failed to toggle customer setting active:', error);
    return { success: false, error: 'Không thể thay đổi trạng thái' };
  }
}

export async function getActiveCustomerSettings(
  type: CustomerSettingType
): Promise<ActionResult<CustomerSetting[]>> {
  try {
    const settings = await prisma.customerSetting.findMany({
      where: { type, isActive: true, isDeleted: false },
      orderBy: [{ isDefault: 'desc' }, { orderIndex: 'asc' }, { name: 'asc' }],
    });
    return { success: true, data: settings };
  } catch (error) {
    console.error('Failed to fetch active customer settings:', error);
    return { success: false, error: 'Không thể tải danh sách cài đặt' };
  }
}

export async function updateCustomerSettingsSortOrder(
  items: { systemId: string; orderIndex: number }[]
): Promise<ActionResult<{ count: number }>> {
  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.customerSetting.update({
          where: { systemId: item.systemId },
          data: { orderIndex: item.orderIndex },
        })
      )
    );

    revalidatePath('/settings/customers');
    return { success: true, data: { count: items.length } };
  } catch (error) {
    console.error('Failed to update sort order:', error);
    return { success: false, error: 'Không thể cập nhật thứ tự' };
  }
}

// ============== Convenience functions ==============

export async function getCustomerGroups() {
  return getActiveCustomerSettings('customer-group');
}

export async function getCustomerLevels() {
  return getActiveCustomerSettings('customer-level');
}

export async function getCustomerSources() {
  return getActiveCustomerSettings('customer-source');
}

export async function getCustomerTags() {
  return getActiveCustomerSettings('customer-tag');
}
