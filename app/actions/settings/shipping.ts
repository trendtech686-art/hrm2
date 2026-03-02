'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

type ShippingPartner = NonNullable<Awaited<ReturnType<typeof prisma.shippingPartner.findFirst>>>;

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface ShippingPartnerFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isConnected?: boolean;
}

export interface PaginatedShippingPartners {
  data: ShippingPartner[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getShippingPartners(
  filters: ShippingPartnerFilters = {}
): Promise<ActionResult<PaginatedShippingPartners>> {
  try {
    const { page = 1, limit = 20, search, isActive, isConnected } = filters;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (isActive !== undefined) where.isActive = isActive;
    if (isConnected !== undefined) where.isConnected = isConnected;

    const [data, total] = await Promise.all([
      prisma.shippingPartner.findMany({
        where,
        orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.shippingPartner.count({ where }),
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
    console.error('Failed to fetch shipping partners:', error);
    return { success: false, error: 'Không thể tải danh sách đối tác vận chuyển' };
  }
}

export async function getShippingPartnerById(
  systemId: string
): Promise<ActionResult<ShippingPartner>> {
  try {
    const partner = await prisma.shippingPartner.findUnique({
      where: { systemId },
    });
    if (!partner) {
      return { success: false, error: 'Không tìm thấy đối tác vận chuyển' };
    }
    return { success: true, data: partner };
  } catch (error) {
    console.error('Failed to fetch shipping partner:', error);
    return { success: false, error: 'Không thể tải thông tin đối tác vận chuyển' };
  }
}

export async function createShippingPartner(
  data: Record<string, unknown>
): Promise<ActionResult<ShippingPartner>> {
  try {
    const code = data.code as string;
    const name = data.name as string;

    // Check unique code
    const existing = await prisma.shippingPartner.findFirst({
      where: { code },
    });
    if (existing) {
      return { success: false, error: 'Mã đối tác vận chuyển đã tồn tại' };
    }

    const systemId = await generateIdWithPrefix('SHIP', prisma);

    const partner = await prisma.shippingPartner.create({
      data: {
        systemId,
        id: systemId,
        name,
        code,
        description: data.description as string | undefined,
        logo: data.logo as string | undefined,
        website: data.website as string | undefined,
        isActive: (data.isActive as boolean) ?? true,
        isConnected: (data.isConnected as boolean) ?? false,
        services: data.services as object | undefined,
        configuration: data.configuration as object | undefined,
        createdBy: data.createdBy as string | undefined,
      },
    });

    revalidatePath('/settings/shipping');
    return { success: true, data: partner };
  } catch (error) {
    console.error('Failed to create shipping partner:', error);
    return { success: false, error: 'Không thể tạo đối tác vận chuyển' };
  }
}

export async function updateShippingPartner(
  systemId: string,
  data: Record<string, unknown>
): Promise<ActionResult<ShippingPartner>> {
  try {
    const existing = await prisma.shippingPartner.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy đối tác vận chuyển' };
    }

    // Check unique code if changed
    if (data.code && data.code !== existing.code) {
      const duplicate = await prisma.shippingPartner.findFirst({
        where: {
          code: data.code as string,
          NOT: { systemId },
        },
      });
      if (duplicate) {
        return { success: false, error: 'Mã đối tác vận chuyển đã tồn tại' };
      }
    }

    const partner = await prisma.shippingPartner.update({
      where: { systemId },
      data: {
        name: data.name as string | undefined,
        code: data.code as string | undefined,
        description: data.description as string | undefined,
        logo: data.logo as string | undefined,
        website: data.website as string | undefined,
        isActive: data.isActive as boolean | undefined,
        isConnected: data.isConnected as boolean | undefined,
        services: data.services as object | undefined,
        configuration: data.configuration as object | undefined,
        updatedBy: data.updatedBy as string | undefined,
      },
    });

    revalidatePath('/settings/shipping');
    return { success: true, data: partner };
  } catch (error) {
    console.error('Failed to update shipping partner:', error);
    return { success: false, error: 'Không thể cập nhật đối tác vận chuyển' };
  }
}

export async function updateShippingPartnerCredentials(
  systemId: string,
  credentials: Record<string, unknown>
): Promise<ActionResult<ShippingPartner>> {
  try {
    const existing = await prisma.shippingPartner.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy đối tác vận chuyển' };
    }

    // In real implementation, credentials should be encrypted
    const partner = await prisma.shippingPartner.update({
      where: { systemId },
      data: {
        credentials: credentials as object,
      },
    });

    revalidatePath('/settings/shipping');
    return { success: true, data: partner };
  } catch (error) {
    console.error('Failed to update shipping partner credentials:', error);
    return { success: false, error: 'Không thể cập nhật thông tin đăng nhập' };
  }
}

export async function deleteShippingPartner(
  systemId: string
): Promise<ActionResult<ShippingPartner>> {
  try {
    const existing = await prisma.shippingPartner.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy đối tác vận chuyển' };
    }

    // Check if in use (in orders)
    const ordersCount = await prisma.order.count({
      where: { shippingCarrier: systemId },
    });
    if (ordersCount > 0) {
      // Soft delete by setting isActive = false
      const partner = await prisma.shippingPartner.update({
        where: { systemId },
        data: { isActive: false },
      });
      revalidatePath('/settings/shipping');
      return { success: true, data: partner };
    }

    const partner = await prisma.shippingPartner.delete({
      where: { systemId },
    });

    revalidatePath('/settings/shipping');
    return { success: true, data: partner };
  } catch (error) {
    console.error('Failed to delete shipping partner:', error);
    return { success: false, error: 'Không thể xóa đối tác vận chuyển' };
  }
}

export async function toggleShippingPartnerActive(
  systemId: string
): Promise<ActionResult<ShippingPartner>> {
  try {
    const existing = await prisma.shippingPartner.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy đối tác vận chuyển' };
    }

    const partner = await prisma.shippingPartner.update({
      where: { systemId },
      data: { isActive: !existing.isActive },
    });

    revalidatePath('/settings/shipping');
    return { success: true, data: partner };
  } catch (error) {
    console.error('Failed to toggle shipping partner active:', error);
    return { success: false, error: 'Không thể thay đổi trạng thái' };
  }
}

export async function connectShippingPartner(
  systemId: string
): Promise<ActionResult<ShippingPartner>> {
  try {
    const existing = await prisma.shippingPartner.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy đối tác vận chuyển' };
    }

    if (!existing.credentials) {
      return { success: false, error: 'Vui lòng cập nhật thông tin đăng nhập trước' };
    }

    // TODO: Add actual API connection logic here
    // For now, just mark as connected
    const partner = await prisma.shippingPartner.update({
      where: { systemId },
      data: { isConnected: true },
    });

    revalidatePath('/settings/shipping');
    return { success: true, data: partner };
  } catch (error) {
    console.error('Failed to connect shipping partner:', error);
    return { success: false, error: 'Không thể kết nối đối tác vận chuyển' };
  }
}

export async function disconnectShippingPartner(
  systemId: string
): Promise<ActionResult<ShippingPartner>> {
  try {
    const partner = await prisma.shippingPartner.update({
      where: { systemId },
      data: { isConnected: false },
    });

    revalidatePath('/settings/shipping');
    return { success: true, data: partner };
  } catch (error) {
    console.error('Failed to disconnect shipping partner:', error);
    return { success: false, error: 'Không thể ngắt kết nối đối tác vận chuyển' };
  }
}

export async function getActiveShippingPartners(): Promise<ActionResult<ShippingPartner[]>> {
  try {
    const partners = await prisma.shippingPartner.findMany({
      where: { isActive: true },
      orderBy: [{ isConnected: 'desc' }, { name: 'asc' }],
    });
    return { success: true, data: partners };
  } catch (error) {
    console.error('Failed to fetch active shipping partners:', error);
    return { success: false, error: 'Không thể tải danh sách đối tác vận chuyển' };
  }
}

export async function getConnectedShippingPartners(): Promise<ActionResult<ShippingPartner[]>> {
  try {
    const partners = await prisma.shippingPartner.findMany({
      where: { isActive: true, isConnected: true },
      orderBy: { name: 'asc' },
    });
    return { success: true, data: partners };
  } catch (error) {
    console.error('Failed to fetch connected shipping partners:', error);
    return { success: false, error: 'Không thể tải danh sách đối tác vận chuyển' };
  }
}
