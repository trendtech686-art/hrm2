'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

type SalesChannel = NonNullable<Awaited<ReturnType<typeof prisma.salesChannel.findFirst>>>;

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface SalesChannelFilters {
  page?: number;
  limit?: number;
  search?: string;
  isApplied?: boolean;
}

export interface PaginatedSalesChannels {
  data: SalesChannel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getSalesChannels(
  filters: SalesChannelFilters = {}
): Promise<ActionResult<PaginatedSalesChannels>> {
  try {
    const { page = 1, limit = 20, search, isApplied } = filters;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { systemId: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (isApplied !== undefined) where.isApplied = isApplied;

    const [data, total] = await Promise.all([
      prisma.salesChannel.findMany({
        where,
        orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.salesChannel.count({ where }),
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
    console.error('Failed to fetch sales channels:', error);
    return { success: false, error: 'Không thể tải danh sách kênh bán hàng' };
  }
}

export async function getSalesChannelById(
  systemId: string
): Promise<ActionResult<SalesChannel>> {
  try {
    const salesChannel = await prisma.salesChannel.findUnique({
      where: { systemId },
    });
    if (!salesChannel) {
      return { success: false, error: 'Không tìm thấy kênh bán hàng' };
    }
    return { success: true, data: salesChannel };
  } catch (error) {
    console.error('Failed to fetch sales channel:', error);
    return { success: false, error: 'Không thể tải thông tin kênh bán hàng' };
  }
}

export async function createSalesChannel(
  data: Record<string, unknown>
): Promise<ActionResult<SalesChannel>> {
  try {
    const name = data.name as string;

    // Check unique name
    const existing = await prisma.salesChannel.findFirst({
      where: { name },
    });
    if (existing) {
      return { success: false, error: 'Tên kênh bán hàng đã tồn tại' };
    }

    const systemId = await generateIdWithPrefix('KBH', prisma);

    // Handle default
    if (data.isDefault) {
      await prisma.salesChannel.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const salesChannel = await prisma.salesChannel.create({
      data: {
        systemId,
        id: systemId,
        name,
        isApplied: (data.isApplied as boolean) ?? true,
        isDefault: (data.isDefault as boolean) ?? false,
      },
    });

    revalidatePath('/settings/sales-channels');
    return { success: true, data: salesChannel };
  } catch (error) {
    console.error('Failed to create sales channel:', error);
    return { success: false, error: 'Không thể tạo kênh bán hàng' };
  }
}

export async function updateSalesChannel(
  systemId: string,
  data: Record<string, unknown>
): Promise<ActionResult<SalesChannel>> {
  try {
    const existing = await prisma.salesChannel.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy kênh bán hàng' };
    }

    // Check unique name if changed
    if (data.name && data.name !== existing.name) {
      const duplicate = await prisma.salesChannel.findFirst({
        where: {
          name: data.name as string,
          NOT: { systemId },
        },
      });
      if (duplicate) {
        return { success: false, error: 'Tên kênh bán hàng đã tồn tại' };
      }
    }

    // Handle default
    if (data.isDefault && !existing.isDefault) {
      await prisma.salesChannel.updateMany({
        where: { isDefault: true, NOT: { systemId } },
        data: { isDefault: false },
      });
    }

    const salesChannel = await prisma.salesChannel.update({
      where: { systemId },
      data: {
        name: data.name as string | undefined,
        isApplied: data.isApplied as boolean | undefined,
        isDefault: data.isDefault as boolean | undefined,
      },
    });

    revalidatePath('/settings/sales-channels');
    return { success: true, data: salesChannel };
  } catch (error) {
    console.error('Failed to update sales channel:', error);
    return { success: false, error: 'Không thể cập nhật kênh bán hàng' };
  }
}

export async function deleteSalesChannel(
  systemId: string
): Promise<ActionResult<SalesChannel>> {
  try {
    const existing = await prisma.salesChannel.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy kênh bán hàng' };
    }

    // Cannot delete default sales channel
    if (existing.isDefault) {
      return { success: false, error: 'Không thể xóa kênh bán hàng mặc định' };
    }

    const salesChannel = await prisma.salesChannel.delete({
      where: { systemId },
    });

    revalidatePath('/settings/sales-channels');
    return { success: true, data: salesChannel };
  } catch (error) {
    console.error('Failed to delete sales channel:', error);
    return { success: false, error: 'Không thể xóa kênh bán hàng' };
  }
}

export async function setDefaultSalesChannel(
  systemId: string
): Promise<ActionResult<SalesChannel>> {
  try {
    await prisma.$transaction([
      prisma.salesChannel.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      }),
      prisma.salesChannel.update({
        where: { systemId },
        data: { isDefault: true },
      }),
    ]);

    const salesChannel = await prisma.salesChannel.findUnique({ where: { systemId } });
    if (!salesChannel) {
      return { success: false, error: 'Không tìm thấy kênh bán hàng' };
    }

    revalidatePath('/settings/sales-channels');
    return { success: true, data: salesChannel };
  } catch (error) {
    console.error('Failed to set default sales channel:', error);
    return { success: false, error: 'Không thể đặt mặc định' };
  }
}

export async function toggleSalesChannelApplied(
  systemId: string
): Promise<ActionResult<SalesChannel>> {
  try {
    const existing = await prisma.salesChannel.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy kênh bán hàng' };
    }

    const salesChannel = await prisma.salesChannel.update({
      where: { systemId },
      data: { isApplied: !existing.isApplied },
    });

    revalidatePath('/settings/sales-channels');
    return { success: true, data: salesChannel };
  } catch (error) {
    console.error('Failed to toggle sales channel applied:', error);
    return { success: false, error: 'Không thể thay đổi trạng thái' };
  }
}

export async function getAppliedSalesChannels(): Promise<ActionResult<SalesChannel[]>> {
  try {
    const salesChannels = await prisma.salesChannel.findMany({
      where: { isApplied: true },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    });
    return { success: true, data: salesChannels };
  } catch (error) {
    console.error('Failed to fetch applied sales channels:', error);
    return { success: false, error: 'Không thể tải danh sách kênh bán hàng' };
  }
}
