'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

type PricingPolicy = NonNullable<Awaited<ReturnType<typeof prisma.pricingPolicy.findFirst>>>;

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface PricingPolicyFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: string; // 'Nhập hàng' | 'Bán hàng'
  isActive?: boolean;
}

export interface PaginatedPricingPolicies {
  data: PricingPolicy[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getPricingPolicies(
  filters: PricingPolicyFilters = {}
): Promise<ActionResult<PaginatedPricingPolicies>> {
  try {
    const { page = 1, limit = 20, search, type, isActive } = filters;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (type) where.type = type;
    if (isActive !== undefined) where.isActive = isActive;

    const [data, total] = await Promise.all([
      prisma.pricingPolicy.findMany({
        where,
        include: {
          _count: {
            select: { prices: true },
          },
        },
        orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.pricingPolicy.count({ where }),
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
    console.error('Failed to fetch pricing policies:', error);
    return { success: false, error: 'Không thể tải danh sách bảng giá' };
  }
}

export async function getPricingPolicyById(
  systemId: string
): Promise<ActionResult<PricingPolicy>> {
  try {
    const policy = await prisma.pricingPolicy.findUnique({
      where: { systemId },
      include: {
        prices: {
          take: 100,
          include: {
            product: {
              select: { id: true, systemId: true, name: true },
            },
          },
        },
      },
    });
    if (!policy) {
      return { success: false, error: 'Không tìm thấy bảng giá' };
    }
    return { success: true, data: policy };
  } catch (error) {
    console.error('Failed to fetch pricing policy:', error);
    return { success: false, error: 'Không thể tải thông tin bảng giá' };
  }
}

export async function createPricingPolicy(
  data: Record<string, unknown>
): Promise<ActionResult<PricingPolicy>> {
  try {
    const name = data.name as string;
    const type = data.type as string | undefined;

    // Check unique name within type
    const existing = await prisma.pricingPolicy.findFirst({
      where: { 
        name,
        ...(type ? { type } : {}),
      },
    });
    if (existing) {
      return { success: false, error: 'Tên bảng giá đã tồn tại' };
    }

    const systemId = await generateIdWithPrefix('BG', prisma);

    // Handle default (per type)
    if (data.isDefault && type) {
      await prisma.pricingPolicy.updateMany({
        where: { type, isDefault: true },
        data: { isDefault: false },
      });
    }

    const policy = await prisma.pricingPolicy.create({
      data: {
        systemId,
        id: systemId,
        name,
        description: data.description as string | undefined,
        type: type,
        isDefault: (data.isDefault as boolean) ?? false,
        isActive: (data.isActive as boolean) ?? true,
        createdBy: data.createdBy as string | undefined,
      },
    });

    revalidatePath('/settings/pricing-policies');
    return { success: true, data: policy };
  } catch (error) {
    console.error('Failed to create pricing policy:', error);
    return { success: false, error: 'Không thể tạo bảng giá' };
  }
}

export async function updatePricingPolicy(
  systemId: string,
  data: Record<string, unknown>
): Promise<ActionResult<PricingPolicy>> {
  try {
    const existing = await prisma.pricingPolicy.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy bảng giá' };
    }

    // Check unique name if changed
    if (data.name && data.name !== existing.name) {
      const duplicate = await prisma.pricingPolicy.findFirst({
        where: {
          name: data.name as string,
          ...(existing.type ? { type: existing.type } : {}),
          NOT: { systemId },
        },
      });
      if (duplicate) {
        return { success: false, error: 'Tên bảng giá đã tồn tại' };
      }
    }

    // Handle default
    if (data.isDefault && !existing.isDefault && existing.type) {
      await prisma.pricingPolicy.updateMany({
        where: { type: existing.type, isDefault: true, NOT: { systemId } },
        data: { isDefault: false },
      });
    }

    const policy = await prisma.pricingPolicy.update({
      where: { systemId },
      data: {
        name: data.name as string | undefined,
        description: data.description as string | undefined,
        isDefault: data.isDefault as boolean | undefined,
        isActive: data.isActive as boolean | undefined,
        updatedBy: data.updatedBy as string | undefined,
      },
    });

    revalidatePath('/settings/pricing-policies');
    return { success: true, data: policy };
  } catch (error) {
    console.error('Failed to update pricing policy:', error);
    return { success: false, error: 'Không thể cập nhật bảng giá' };
  }
}

export async function deletePricingPolicy(
  systemId: string
): Promise<ActionResult<PricingPolicy>> {
  try {
    const existing = await prisma.pricingPolicy.findUnique({ 
      where: { systemId },
      include: { _count: { select: { prices: true } } },
    });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy bảng giá' };
    }

    // Check if has prices
    if (existing._count.prices > 0) {
      // Soft delete by setting isActive = false
      const policy = await prisma.pricingPolicy.update({
        where: { systemId },
        data: { isActive: false },
      });
      revalidatePath('/settings/pricing-policies');
      return { success: true, data: policy };
    }

    const policy = await prisma.pricingPolicy.delete({
      where: { systemId },
    });

    revalidatePath('/settings/pricing-policies');
    return { success: true, data: policy };
  } catch (error) {
    console.error('Failed to delete pricing policy:', error);
    return { success: false, error: 'Không thể xóa bảng giá' };
  }
}

export async function setDefaultPricingPolicy(
  systemId: string
): Promise<ActionResult<PricingPolicy>> {
  try {
    const existing = await prisma.pricingPolicy.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy bảng giá' };
    }

    if (existing.type) {
      await prisma.$transaction([
        prisma.pricingPolicy.updateMany({
          where: { type: existing.type, isDefault: true },
          data: { isDefault: false },
        }),
        prisma.pricingPolicy.update({
          where: { systemId },
          data: { isDefault: true },
        }),
      ]);
    } else {
      await prisma.pricingPolicy.update({
        where: { systemId },
        data: { isDefault: true },
      });
    }

    const policy = await prisma.pricingPolicy.findUnique({ where: { systemId } });
    if (!policy) {
      return { success: false, error: 'Không tìm thấy bảng giá' };
    }

    revalidatePath('/settings/pricing-policies');
    return { success: true, data: policy };
  } catch (error) {
    console.error('Failed to set default pricing policy:', error);
    return { success: false, error: 'Không thể đặt mặc định' };
  }
}

export async function togglePricingPolicyActive(
  systemId: string
): Promise<ActionResult<PricingPolicy>> {
  try {
    const existing = await prisma.pricingPolicy.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy bảng giá' };
    }

    const policy = await prisma.pricingPolicy.update({
      where: { systemId },
      data: { isActive: !existing.isActive },
    });

    revalidatePath('/settings/pricing-policies');
    return { success: true, data: policy };
  } catch (error) {
    console.error('Failed to toggle pricing policy active:', error);
    return { success: false, error: 'Không thể thay đổi trạng thái' };
  }
}

export async function getActivePricingPolicies(
  type?: string
): Promise<ActionResult<PricingPolicy[]>> {
  try {
    const where: Record<string, unknown> = { isActive: true };
    if (type) where.type = type;

    const policies = await prisma.pricingPolicy.findMany({
      where,
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    });
    return { success: true, data: policies };
  } catch (error) {
    console.error('Failed to fetch active pricing policies:', error);
    return { success: false, error: 'Không thể tải danh sách bảng giá' };
  }
}

export async function getDefaultPricingPolicy(
  type: string
): Promise<ActionResult<PricingPolicy | null>> {
  try {
    const policy = await prisma.pricingPolicy.findFirst({
      where: { type, isDefault: true, isActive: true },
    });
    return { success: true, data: policy };
  } catch (error) {
    console.error('Failed to fetch default pricing policy:', error);
    return { success: false, error: 'Không thể tải bảng giá mặc định' };
  }
}

export async function duplicatePricingPolicy(
  systemId: string,
  newName: string
): Promise<ActionResult<PricingPolicy>> {
  try {
    const existing = await prisma.pricingPolicy.findUnique({
      where: { systemId },
      include: { prices: true },
    });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy bảng giá' };
    }

    const newSystemId = await generateIdWithPrefix('BG', prisma);

    const policy = await prisma.pricingPolicy.create({
      data: {
        systemId: newSystemId,
        id: newSystemId,
        name: newName,
        description: existing.description,
        type: existing.type,
        isDefault: false,
        isActive: true,
        prices: {
          create: existing.prices.map((price) => ({
            productId: price.productId,
            price: price.price,
          })),
        },
      },
    });

    revalidatePath('/settings/pricing-policies');
    return { success: true, data: policy };
  } catch (error) {
    console.error('Failed to duplicate pricing policy:', error);
    return { success: false, error: 'Không thể sao chép bảng giá' };
  }
}
