'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

type ComplaintTypeSetting = NonNullable<Awaited<ReturnType<typeof prisma.complaintTypeSetting.findFirst>>>;

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface ComplaintTypeFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface PaginatedComplaintTypes {
  data: ComplaintTypeSetting[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getComplaintTypes(
  filters: ComplaintTypeFilters = {}
): Promise<ActionResult<PaginatedComplaintTypes>> {
  try {
    const { page = 1, limit = 20, search, isActive, isDeleted = false } = filters;

    const where: Record<string, unknown> = { isDeleted };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (isActive !== undefined) where.isActive = isActive;

    const [data, total] = await Promise.all([
      prisma.complaintTypeSetting.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.complaintTypeSetting.count({ where }),
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
    console.error('Failed to fetch complaint types:', error);
    return { success: false, error: 'Không thể tải danh sách loại khiếu nại' };
  }
}

export async function getComplaintTypeById(
  systemId: string
): Promise<ActionResult<ComplaintTypeSetting>> {
  try {
    const complaintType = await prisma.complaintTypeSetting.findUnique({
      where: { systemId },
    });
    if (!complaintType) {
      return { success: false, error: 'Không tìm thấy loại khiếu nại' };
    }
    return { success: true, data: complaintType };
  } catch (error) {
    console.error('Failed to fetch complaint type:', error);
    return { success: false, error: 'Không thể tải thông tin loại khiếu nại' };
  }
}

export async function createComplaintType(
  data: Record<string, unknown>
): Promise<ActionResult<ComplaintTypeSetting>> {
  try {
    // Check unique name
    const existing = await prisma.complaintTypeSetting.findFirst({
      where: { 
        name: data.name as string, 
        isDeleted: false,
      },
    });
    if (existing) {
      return { success: false, error: 'Tên loại khiếu nại đã tồn tại' };
    }

    const systemId = await generateIdWithPrefix('LKN', prisma);

    // Handle default
    if (data.isDefault) {
      await prisma.complaintTypeSetting.updateMany({
        where: { isDefault: true, isDeleted: false },
        data: { isDefault: false },
      });
    }

    const complaintType = await prisma.complaintTypeSetting.create({
      data: {
        ...data,
        systemId,
        isActive: data.isActive ?? true,
        isDefault: data.isDefault ?? false,
        sortOrder: data.sortOrder ?? 0,
      } as Parameters<typeof prisma.complaintTypeSetting.create>[0]['data'],
    });

    revalidatePath('/settings/complaint-types');
    return { success: true, data: complaintType };
  } catch (error) {
    console.error('Failed to create complaint type:', error);
    return { success: false, error: 'Không thể tạo loại khiếu nại' };
  }
}

export async function updateComplaintType(
  systemId: string,
  data: Record<string, unknown>
): Promise<ActionResult<ComplaintTypeSetting>> {
  try {
    const existing = await prisma.complaintTypeSetting.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy loại khiếu nại' };
    }

    // Check unique name if changed
    if (data.name && data.name !== existing.name) {
      const duplicate = await prisma.complaintTypeSetting.findFirst({
        where: { 
          name: data.name as string, 
          isDeleted: false,
          NOT: { systemId },
        },
      });
      if (duplicate) {
        return { success: false, error: 'Tên loại khiếu nại đã tồn tại' };
      }
    }

    // Handle default
    if (data.isDefault && !existing.isDefault) {
      await prisma.complaintTypeSetting.updateMany({
        where: { isDefault: true, isDeleted: false, NOT: { systemId } },
        data: { isDefault: false },
      });
    }

    const complaintType = await prisma.complaintTypeSetting.update({
      where: { systemId },
      data: data as Parameters<typeof prisma.complaintTypeSetting.update>[0]['data'],
    });

    revalidatePath('/settings/complaint-types');
    return { success: true, data: complaintType };
  } catch (error) {
    console.error('Failed to update complaint type:', error);
    return { success: false, error: 'Không thể cập nhật loại khiếu nại' };
  }
}

export async function deleteComplaintType(
  systemId: string
): Promise<ActionResult<ComplaintTypeSetting>> {
  try {
    const existing = await prisma.complaintTypeSetting.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy loại khiếu nại' };
    }

    // Check if in use
    const complaintsCount = await prisma.complaint.count({
      where: { type: systemId },
    });
    if (complaintsCount > 0) {
      // Soft delete instead
      const complaintType = await prisma.complaintTypeSetting.update({
        where: { systemId },
        data: { isDeleted: true, deletedAt: new Date() },
      });
      revalidatePath('/settings/complaint-types');
      return { success: true, data: complaintType };
    }

    const complaintType = await prisma.complaintTypeSetting.update({
      where: { systemId },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    revalidatePath('/settings/complaint-types');
    return { success: true, data: complaintType };
  } catch (error) {
    console.error('Failed to delete complaint type:', error);
    return { success: false, error: 'Không thể xóa loại khiếu nại' };
  }
}

export async function restoreComplaintType(
  systemId: string
): Promise<ActionResult<ComplaintTypeSetting>> {
  try {
    const complaintType = await prisma.complaintTypeSetting.update({
      where: { systemId },
      data: { isDeleted: false, deletedAt: null },
    });

    revalidatePath('/settings/complaint-types');
    return { success: true, data: complaintType };
  } catch (error) {
    console.error('Failed to restore complaint type:', error);
    return { success: false, error: 'Không thể khôi phục loại khiếu nại' };
  }
}

export async function setDefaultComplaintType(
  systemId: string
): Promise<ActionResult<ComplaintTypeSetting>> {
  try {
    await prisma.$transaction([
      prisma.complaintTypeSetting.updateMany({
        where: { isDefault: true, isDeleted: false },
        data: { isDefault: false },
      }),
      prisma.complaintTypeSetting.update({
        where: { systemId },
        data: { isDefault: true },
      }),
    ]);

    const complaintType = await prisma.complaintTypeSetting.findUnique({ where: { systemId } });
    if (!complaintType) {
      return { success: false, error: 'Không tìm thấy loại khiếu nại' };
    }

    revalidatePath('/settings/complaint-types');
    return { success: true, data: complaintType };
  } catch (error) {
    console.error('Failed to set default complaint type:', error);
    return { success: false, error: 'Không thể đặt mặc định' };
  }
}

export async function toggleComplaintTypeActive(
  systemId: string
): Promise<ActionResult<ComplaintTypeSetting>> {
  try {
    const existing = await prisma.complaintTypeSetting.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy loại khiếu nại' };
    }

    const complaintType = await prisma.complaintTypeSetting.update({
      where: { systemId },
      data: { isActive: !existing.isActive },
    });

    revalidatePath('/settings/complaint-types');
    return { success: true, data: complaintType };
  } catch (error) {
    console.error('Failed to toggle complaint type active:', error);
    return { success: false, error: 'Không thể thay đổi trạng thái' };
  }
}

export async function getActiveComplaintTypes(): Promise<ActionResult<ComplaintTypeSetting[]>> {
  try {
    const complaintTypes = await prisma.complaintTypeSetting.findMany({
      where: { isActive: true, isDeleted: false },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return { success: true, data: complaintTypes };
  } catch (error) {
    console.error('Failed to fetch active complaint types:', error);
    return { success: false, error: 'Không thể tải danh sách loại khiếu nại' };
  }
}

export async function updateComplaintTypeSortOrder(
  items: { systemId: string; sortOrder: number }[]
): Promise<ActionResult<{ count: number }>> {
  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.complaintTypeSetting.update({
          where: { systemId: item.systemId },
          data: { sortOrder: item.sortOrder },
        })
      )
    );

    revalidatePath('/settings/complaint-types');
    return { success: true, data: { count: items.length } };
  } catch (error) {
    console.error('Failed to update sort order:', error);
    return { success: false, error: 'Không thể cập nhật thứ tự' };
  }
}
