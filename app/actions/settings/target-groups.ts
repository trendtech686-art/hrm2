'use server';

import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

/**
 * Target Groups Server Actions
 * Uses SettingsData model with type = 'target-group'
 */

type SettingsData = NonNullable<Awaited<ReturnType<typeof prisma.settingsData.findFirst>>>;

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface TargetGroupFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface PaginatedTargetGroups {
  data: SettingsData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const SETTINGS_TYPE = 'target-group';

export async function getTargetGroups(
  filters: TargetGroupFilters = {}
): Promise<ActionResult<PaginatedTargetGroups>> {
  try {
    const { page = 1, limit = 20, search, isActive } = filters;

    const where: Record<string, unknown> = { type: SETTINGS_TYPE };
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
    console.error('Failed to fetch target groups:', error);
    return { success: false, error: 'Không thể tải danh sách nhóm đối tượng' };
  }
}

export async function getTargetGroupById(
  systemId: string
): Promise<ActionResult<SettingsData>> {
  try {
    const targetGroup = await prisma.settingsData.findUnique({
      where: { systemId },
    });
    if (!targetGroup || targetGroup.type !== SETTINGS_TYPE) {
      return { success: false, error: 'Không tìm thấy nhóm đối tượng' };
    }
    return { success: true, data: targetGroup };
  } catch (error) {
    console.error('Failed to fetch target group:', error);
    return { success: false, error: 'Không thể tải thông tin nhóm đối tượng' };
  }
}

export async function createTargetGroup(
  data: Record<string, unknown>
): Promise<ActionResult<SettingsData>> {
  try {
    const id = data.id as string | undefined;
    const name = data.name as string;

    // Check unique id or name
    const existing = await prisma.settingsData.findFirst({
      where: {
        type: SETTINGS_TYPE,
        OR: [
          ...(id ? [{ id }] : []),
          { name },
        ],
      },
    });
    if (existing) {
      return { success: false, error: 'Mã hoặc tên nhóm đối tượng đã tồn tại' };
    }

    // Handle default
    if (data.isDefault) {
      await prisma.settingsData.updateMany({
        where: { type: SETTINGS_TYPE, isDefault: true },
        data: { isDefault: false },
      });
    }

    const targetGroup = await prisma.settingsData.create({
      data: {
        systemId: await generateIdWithPrefix('TG', prisma),
        id: id || name.toUpperCase().replace(/\s+/g, ''),
        name,
        type: SETTINGS_TYPE,
        description: data.description as string | undefined,
        isActive: (data.isActive as boolean) ?? true,
        isDefault: (data.isDefault as boolean) ?? false,
        metadata: ((data.metadata as Record<string, unknown>) ?? {}) as Prisma.InputJsonValue,
      },
    });

    revalidatePath('/settings/target-groups');
    return { success: true, data: targetGroup };
  } catch (error) {
    console.error('Failed to create target group:', error);
    return { success: false, error: 'Không thể tạo nhóm đối tượng' };
  }
}

export async function updateTargetGroup(
  systemId: string,
  data: Record<string, unknown>
): Promise<ActionResult<SettingsData>> {
  try {
    const existing = await prisma.settingsData.findUnique({ where: { systemId } });
    if (!existing || existing.type !== SETTINGS_TYPE) {
      return { success: false, error: 'Không tìm thấy nhóm đối tượng' };
    }

    // Check unique name if changed
    if (data.name && data.name !== existing.name) {
      const duplicate = await prisma.settingsData.findFirst({
        where: {
          type: SETTINGS_TYPE,
          name: data.name as string,
          NOT: { systemId },
        },
      });
      if (duplicate) {
        return { success: false, error: 'Tên nhóm đối tượng đã tồn tại' };
      }
    }

    // Handle default
    if (data.isDefault && !existing.isDefault) {
      await prisma.settingsData.updateMany({
        where: { type: SETTINGS_TYPE, isDefault: true, NOT: { systemId } },
        data: { isDefault: false },
      });
    }

    const targetGroup = await prisma.settingsData.update({
      where: { systemId },
      data: {
        name: data.name as string | undefined,
        description: data.description as string | undefined,
        isActive: data.isActive as boolean | undefined,
        isDefault: data.isDefault as boolean | undefined,
        metadata: data.metadata as Prisma.InputJsonValue | undefined,
      },
    });

    revalidatePath('/settings/target-groups');
    return { success: true, data: targetGroup };
  } catch (error) {
    console.error('Failed to update target group:', error);
    return { success: false, error: 'Không thể cập nhật nhóm đối tượng' };
  }
}

export async function deleteTargetGroup(
  systemId: string
): Promise<ActionResult<SettingsData>> {
  try {
    const existing = await prisma.settingsData.findUnique({ where: { systemId } });
    if (!existing || existing.type !== SETTINGS_TYPE) {
      return { success: false, error: 'Không tìm thấy nhóm đối tượng' };
    }

    // Check if in use (in receipts or payments)
    const [receiptsCount, paymentsCount] = await Promise.all([
      prisma.receipt.count({ where: { payerTypeSystemId: systemId } }),
      prisma.payment.count({ where: { recipientTypeSystemId: systemId } }),
    ]);

    if (receiptsCount > 0 || paymentsCount > 0) {
      // Soft delete by setting isActive = false
      const targetGroup = await prisma.settingsData.update({
        where: { systemId },
        data: { isActive: false },
      });
      revalidatePath('/settings/target-groups');
      return { 
        success: true, 
        data: targetGroup,
      };
    }

    const targetGroup = await prisma.settingsData.delete({
      where: { systemId },
    });

    revalidatePath('/settings/target-groups');
    return { success: true, data: targetGroup };
  } catch (error) {
    console.error('Failed to delete target group:', error);
    return { success: false, error: 'Không thể xóa nhóm đối tượng' };
  }
}

export async function setDefaultTargetGroup(
  systemId: string
): Promise<ActionResult<SettingsData>> {
  try {
    await prisma.$transaction([
      prisma.settingsData.updateMany({
        where: { type: SETTINGS_TYPE, isDefault: true },
        data: { isDefault: false },
      }),
      prisma.settingsData.update({
        where: { systemId },
        data: { isDefault: true },
      }),
    ]);

    const targetGroup = await prisma.settingsData.findUnique({ where: { systemId } });
    if (!targetGroup) {
      return { success: false, error: 'Không tìm thấy nhóm đối tượng' };
    }

    revalidatePath('/settings/target-groups');
    return { success: true, data: targetGroup };
  } catch (error) {
    console.error('Failed to set default target group:', error);
    return { success: false, error: 'Không thể đặt mặc định' };
  }
}

export async function toggleTargetGroupActive(
  systemId: string
): Promise<ActionResult<SettingsData>> {
  try {
    const existing = await prisma.settingsData.findUnique({ where: { systemId } });
    if (!existing || existing.type !== SETTINGS_TYPE) {
      return { success: false, error: 'Không tìm thấy nhóm đối tượng' };
    }

    const targetGroup = await prisma.settingsData.update({
      where: { systemId },
      data: { isActive: !existing.isActive },
    });

    revalidatePath('/settings/target-groups');
    return { success: true, data: targetGroup };
  } catch (error) {
    console.error('Failed to toggle target group active:', error);
    return { success: false, error: 'Không thể thay đổi trạng thái' };
  }
}

export async function getActiveTargetGroups(): Promise<ActionResult<SettingsData[]>> {
  try {
    const targetGroups = await prisma.settingsData.findMany({
      where: { type: SETTINGS_TYPE, isActive: true },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    });
    return { success: true, data: targetGroups };
  } catch (error) {
    console.error('Failed to fetch active target groups:', error);
    return { success: false, error: 'Không thể tải danh sách nhóm đối tượng' };
  }
}
