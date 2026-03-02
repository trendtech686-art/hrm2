'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';
import type { Prisma } from '@prisma/client';

type RoleSetting = NonNullable<Awaited<ReturnType<typeof prisma.roleSetting.findFirst>>>;

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface RoleFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface PaginatedRoles {
  data: RoleSetting[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getRoles(
  filters: RoleFilters = {}
): Promise<ActionResult<PaginatedRoles>> {
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
      prisma.roleSetting.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.roleSetting.count({ where }),
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
    console.error('Failed to fetch roles:', error);
    return { success: false, error: 'Không thể tải danh sách vai trò' };
  }
}

export async function getRoleById(
  systemId: string
): Promise<ActionResult<RoleSetting>> {
  try {
    const role = await prisma.roleSetting.findUnique({
      where: { systemId },
    });
    if (!role) {
      return { success: false, error: 'Không tìm thấy vai trò' };
    }
    return { success: true, data: role };
  } catch (error) {
    console.error('Failed to fetch role:', error);
    return { success: false, error: 'Không thể tải thông tin vai trò' };
  }
}

export async function createRole(
  data: Record<string, unknown>
): Promise<ActionResult<RoleSetting>> {
  try {
    const name = data.name as string;

    // Check unique name
    const existing = await prisma.roleSetting.findFirst({
      where: { name, isDeleted: false },
    });
    if (existing) {
      return { success: false, error: 'Tên vai trò đã tồn tại' };
    }

    const systemId = await generateIdWithPrefix('ROLE', prisma);

    const role = await prisma.roleSetting.create({
      data: {
        systemId,
        id: systemId,
        name,
        description: data.description as string | undefined,
        permissions: (data.permissions as string[]) ?? [],
        isSystem: false, // New roles are not system roles
        isActive: (data.isActive as boolean) ?? true,
        sortOrder: (data.sortOrder as number) ?? 0,
        createdBy: data.createdBy as string | undefined,
      },
    });

    revalidatePath('/settings/roles');
    return { success: true, data: role };
  } catch (error) {
    console.error('Failed to create role:', error);
    return { success: false, error: 'Không thể tạo vai trò' };
  }
}

export async function updateRole(
  systemId: string,
  data: Record<string, unknown>
): Promise<ActionResult<RoleSetting>> {
  try {
    const existing = await prisma.roleSetting.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy vai trò' };
    }

    // System roles can only update permissions
    if (existing.isSystem && (data.name || data.description !== undefined)) {
      // Allow updating permissions only for system roles
      data = { permissions: data.permissions };
    }

    // Check unique name if changed
    if (data.name && data.name !== existing.name) {
      const duplicate = await prisma.roleSetting.findFirst({
        where: {
          name: data.name as string,
          isDeleted: false,
          NOT: { systemId },
        },
      });
      if (duplicate) {
        return { success: false, error: 'Tên vai trò đã tồn tại' };
      }
    }

    const role = await prisma.roleSetting.update({
      where: { systemId },
      data: {
        name: data.name as string | undefined,
        description: data.description as string | undefined,
        permissions: data.permissions as string[] | undefined,
        isActive: data.isActive as boolean | undefined,
        sortOrder: data.sortOrder as number | undefined,
        updatedBy: data.updatedBy as string | undefined,
      },
    });

    revalidatePath('/settings/roles');
    return { success: true, data: role };
  } catch (error) {
    console.error('Failed to update role:', error);
    return { success: false, error: 'Không thể cập nhật vai trò' };
  }
}

export async function deleteRole(
  systemId: string
): Promise<ActionResult<RoleSetting>> {
  try {
    const existing = await prisma.roleSetting.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy vai trò' };
    }

    if (existing.isSystem) {
      return { success: false, error: 'Không thể xóa vai trò hệ thống' };
    }

    // Check if in use by employees (by role name)
    const employeesCount = await prisma.employee.count({
      where: { role: existing.name },
    });
    if (employeesCount > 0) {
      return { success: false, error: `Không thể xóa vai trò đang được sử dụng bởi ${employeesCount} nhân viên` };
    }

    const role = await prisma.roleSetting.update({
      where: { systemId },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    revalidatePath('/settings/roles');
    return { success: true, data: role };
  } catch (error) {
    console.error('Failed to delete role:', error);
    return { success: false, error: 'Không thể xóa vai trò' };
  }
}

export async function restoreRole(
  systemId: string
): Promise<ActionResult<RoleSetting>> {
  try {
    const role = await prisma.roleSetting.update({
      where: { systemId },
      data: { isDeleted: false, deletedAt: null },
    });

    revalidatePath('/settings/roles');
    return { success: true, data: role };
  } catch (error) {
    console.error('Failed to restore role:', error);
    return { success: false, error: 'Không thể khôi phục vai trò' };
  }
}

export async function toggleRoleActive(
  systemId: string
): Promise<ActionResult<RoleSetting>> {
  try {
    const existing = await prisma.roleSetting.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy vai trò' };
    }

    if (existing.isSystem) {
      return { success: false, error: 'Không thể thay đổi trạng thái vai trò hệ thống' };
    }

    const role = await prisma.roleSetting.update({
      where: { systemId },
      data: { isActive: !existing.isActive },
    });

    revalidatePath('/settings/roles');
    return { success: true, data: role };
  } catch (error) {
    console.error('Failed to toggle role active:', error);
    return { success: false, error: 'Không thể thay đổi trạng thái' };
  }
}

export async function getActiveRoles(): Promise<ActionResult<RoleSetting[]>> {
  try {
    const roles = await prisma.roleSetting.findMany({
      where: { isActive: true, isDeleted: false },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return { success: true, data: roles };
  } catch (error) {
    console.error('Failed to fetch active roles:', error);
    return { success: false, error: 'Không thể tải danh sách vai trò' };
  }
}

export async function updateRolePermissions(
  systemId: string,
  permissions: string[]
): Promise<ActionResult<RoleSetting>> {
  try {
    const existing = await prisma.roleSetting.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy vai trò' };
    }

    const role = await prisma.roleSetting.update({
      where: { systemId },
      data: { permissions },
    });

    revalidatePath('/settings/roles');
    return { success: true, data: role };
  } catch (error) {
    console.error('Failed to update role permissions:', error);
    return { success: false, error: 'Không thể cập nhật quyền' };
  }
}

export async function updateRoleSortOrder(
  items: { systemId: string; sortOrder: number }[]
): Promise<ActionResult<{ count: number }>> {
  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.roleSetting.update({
          where: { systemId: item.systemId },
          data: { sortOrder: item.sortOrder },
        })
      )
    );

    revalidatePath('/settings/roles');
    return { success: true, data: { count: items.length } };
  } catch (error) {
    console.error('Failed to update sort order:', error);
    return { success: false, error: 'Không thể cập nhật thứ tự' };
  }
}

export async function duplicateRole(
  systemId: string,
  newName: string
): Promise<ActionResult<RoleSetting>> {
  try {
    const existing = await prisma.roleSetting.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy vai trò' };
    }

    // Check unique name
    const duplicate = await prisma.roleSetting.findFirst({
      where: { name: newName, isDeleted: false },
    });
    if (duplicate) {
      return { success: false, error: 'Tên vai trò đã tồn tại' };
    }

    const newSystemId = await generateIdWithPrefix('ROLE', prisma);

    const role = await prisma.roleSetting.create({
      data: {
        systemId: newSystemId,
        id: newSystemId,
        name: newName,
        description: existing.description,
        permissions: existing.permissions as Prisma.InputJsonValue,
        isSystem: false,
        isActive: true,
        sortOrder: existing.sortOrder,
      },
    });

    revalidatePath('/settings/roles');
    return { success: true, data: role };
  } catch (error) {
    console.error('Failed to duplicate role:', error);
    return { success: false, error: 'Không thể sao chép vai trò' };
  }
}
