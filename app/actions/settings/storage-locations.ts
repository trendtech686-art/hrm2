'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

type StockLocation = NonNullable<Awaited<ReturnType<typeof prisma.stockLocation.findFirst>>>;

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface StorageLocationFilters {
  page?: number;
  limit?: number;
  search?: string;
  branchId?: string;
  isActive?: boolean;
}

export interface PaginatedStorageLocations {
  data: StockLocation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getStorageLocations(
  filters: StorageLocationFilters = {}
): Promise<ActionResult<PaginatedStorageLocations>> {
  try {
    const { page = 1, limit = 50, search, branchId, isActive } = filters;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (branchId) where.branchId = branchId;
    if (isActive !== undefined) where.isActive = isActive;

    const [data, total] = await Promise.all([
      prisma.stockLocation.findMany({
        where,
        orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.stockLocation.count({ where }),
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
    console.error('Failed to fetch storage locations:', error);
    return { success: false, error: 'Không thể tải danh sách vị trí kho' };
  }
}

export async function getStorageLocationById(
  systemId: string
): Promise<ActionResult<StockLocation>> {
  try {
    const location = await prisma.stockLocation.findUnique({
      where: { systemId },
    });
    if (!location) {
      return { success: false, error: 'Không tìm thấy vị trí kho' };
    }
    return { success: true, data: location };
  } catch (error) {
    console.error('Failed to fetch storage location:', error);
    return { success: false, error: 'Không thể tải thông tin vị trí kho' };
  }
}

export async function createStorageLocation(
  data: Record<string, unknown>
): Promise<ActionResult<StockLocation>> {
  try {
    const name = data.name as string;
    const branchId = data.branchId as string;

    // Check unique name within branch
    const existing = await prisma.stockLocation.findFirst({
      where: { name, branchId },
    });
    if (existing) {
      return { success: false, error: 'Tên vị trí kho đã tồn tại trong chi nhánh này' };
    }

    const systemId = await generateIdWithPrefix('VTK', prisma);

    // Handle default (per branch)
    if (data.isDefault) {
      await prisma.stockLocation.updateMany({
        where: { branchId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const location = await prisma.stockLocation.create({
      data: {
        systemId,
        id: systemId,
        name,
        branchId,
        branchSystemId: data.branchSystemId as string | undefined,
        code: data.code as string | undefined,
        description: data.description as string | undefined,
        address: data.address as string | undefined,
        isDefault: (data.isDefault as boolean) ?? false,
        isActive: (data.isActive as boolean) ?? true,
        createdBy: data.createdBy as string | undefined,
      },
    });

    revalidatePath('/settings/storage-locations');
    revalidatePath('/inventory');
    return { success: true, data: location };
  } catch (error) {
    console.error('Failed to create storage location:', error);
    return { success: false, error: 'Không thể tạo vị trí kho' };
  }
}

export async function updateStorageLocation(
  systemId: string,
  data: Record<string, unknown>
): Promise<ActionResult<StockLocation>> {
  try {
    const existing = await prisma.stockLocation.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy vị trí kho' };
    }

    // Check unique name if changed
    if (data.name && data.name !== existing.name) {
      const duplicate = await prisma.stockLocation.findFirst({
        where: {
          name: data.name as string,
          branchId: existing.branchId,
          NOT: { systemId },
        },
      });
      if (duplicate) {
        return { success: false, error: 'Tên vị trí kho đã tồn tại trong chi nhánh này' };
      }
    }

    // Handle default
    if (data.isDefault && !existing.isDefault) {
      await prisma.stockLocation.updateMany({
        where: { branchId: existing.branchId, isDefault: true, NOT: { systemId } },
        data: { isDefault: false },
      });
    }

    const location = await prisma.stockLocation.update({
      where: { systemId },
      data: {
        name: data.name as string | undefined,
        code: data.code as string | undefined,
        description: data.description as string | undefined,
        address: data.address as string | undefined,
        isDefault: data.isDefault as boolean | undefined,
        isActive: data.isActive as boolean | undefined,
        updatedBy: data.updatedBy as string | undefined,
      },
    });

    revalidatePath('/settings/storage-locations');
    revalidatePath('/inventory');
    return { success: true, data: location };
  } catch (error) {
    console.error('Failed to update storage location:', error);
    return { success: false, error: 'Không thể cập nhật vị trí kho' };
  }
}

export async function deleteStorageLocation(
  systemId: string
): Promise<ActionResult<StockLocation>> {
  try {
    const existing = await prisma.stockLocation.findUnique({
      where: { systemId },
      include: { _count: { select: { inventoryRecords: true } } },
    });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy vị trí kho' };
    }

    // Check if has inventory
    if (existing._count.inventoryRecords > 0) {
      // Soft delete by setting isActive = false
      const location = await prisma.stockLocation.update({
        where: { systemId },
        data: { isActive: false },
      });
      revalidatePath('/settings/storage-locations');
      return { success: true, data: location };
    }

    const location = await prisma.stockLocation.delete({
      where: { systemId },
    });

    revalidatePath('/settings/storage-locations');
    return { success: true, data: location };
  } catch (error) {
    console.error('Failed to delete storage location:', error);
    return { success: false, error: 'Không thể xóa vị trí kho' };
  }
}

export async function setDefaultStorageLocation(
  systemId: string
): Promise<ActionResult<StockLocation>> {
  try {
    const existing = await prisma.stockLocation.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy vị trí kho' };
    }

    await prisma.$transaction([
      prisma.stockLocation.updateMany({
        where: { branchId: existing.branchId, isDefault: true },
        data: { isDefault: false },
      }),
      prisma.stockLocation.update({
        where: { systemId },
        data: { isDefault: true },
      }),
    ]);

    const location = await prisma.stockLocation.findUnique({ where: { systemId } });
    if (!location) {
      return { success: false, error: 'Không tìm thấy vị trí kho' };
    }

    revalidatePath('/settings/storage-locations');
    return { success: true, data: location };
  } catch (error) {
    console.error('Failed to set default storage location:', error);
    return { success: false, error: 'Không thể đặt mặc định' };
  }
}

export async function toggleStorageLocationActive(
  systemId: string
): Promise<ActionResult<StockLocation>> {
  try {
    const existing = await prisma.stockLocation.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy vị trí kho' };
    }

    const location = await prisma.stockLocation.update({
      where: { systemId },
      data: { isActive: !existing.isActive },
    });

    revalidatePath('/settings/storage-locations');
    return { success: true, data: location };
  } catch (error) {
    console.error('Failed to toggle storage location active:', error);
    return { success: false, error: 'Không thể thay đổi trạng thái' };
  }
}

export async function getActiveStorageLocations(
  branchId?: string
): Promise<ActionResult<StockLocation[]>> {
  try {
    const where: Record<string, unknown> = { isActive: true };
    if (branchId) where.branchId = branchId;

    const locations = await prisma.stockLocation.findMany({
      where,
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    });
    return { success: true, data: locations };
  } catch (error) {
    console.error('Failed to fetch active storage locations:', error);
    return { success: false, error: 'Không thể tải danh sách vị trí kho' };
  }
}

export async function getStorageLocationsByBranch(
  branchId: string
): Promise<ActionResult<StockLocation[]>> {
  try {
    const locations = await prisma.stockLocation.findMany({
      where: { branchId, isActive: true },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    });
    return { success: true, data: locations };
  } catch (error) {
    console.error('Failed to fetch storage locations by branch:', error);
    return { success: false, error: 'Không thể tải danh sách vị trí kho' };
  }
}
