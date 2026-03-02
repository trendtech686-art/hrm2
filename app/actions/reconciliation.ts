'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { auth } from '@/auth';
import type { ActionResult } from '@/types/action-result';

type Packaging = NonNullable<Awaited<ReturnType<typeof prisma.packaging.findFirst>>>;

export interface ReconciliationFilters {
  page?: number;
  limit?: number;
  branchId?: string;
  carrier?: string;
  reconciliationStatus?: string;
  deliveryStatus?: string;
  startDate?: Date;
  endDate?: Date;
  trackingCode?: string;
}

export interface ReconciliationItem {
  systemId: string;
  id: string;
  orderId: string;
  branchId: string;
  trackingCode: string | null;
  carrier: string | null;
  codAmount: number | null;
  shippingFeeToPartner: number | null;
  reconciliationStatus: string | null;
  deliveryStatus: string | null;
  deliveredDate: Date | null;
  createdAt: Date;
}

export interface ReconciliationSummary {
  totalPending: number;
  totalReconciled: number;
  totalCodAmount: number;
  totalShippingFee: number;
}

export interface PaginatedReconciliation {
  data: ReconciliationItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: ReconciliationSummary;
}

/**
 * Get packagings for COD reconciliation
 */
export async function getReconciliationItems(
  filters: ReconciliationFilters = {}
): Promise<ActionResult<PaginatedReconciliation>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const {
      page = 1,
      limit = 50,
      branchId,
      carrier,
      reconciliationStatus,
      deliveryStatus,
      startDate,
      endDate,
      trackingCode,
    } = filters;

    const where: Record<string, unknown> = {
      trackingCode: { not: null },
    };
    
    if (branchId) where.branchId = branchId;
    if (carrier) where.carrier = carrier;
    if (reconciliationStatus) where.reconciliationStatus = reconciliationStatus;
    if (deliveryStatus) where.deliveryStatus = deliveryStatus;
    if (trackingCode) where.trackingCode = { contains: trackingCode };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) (where.createdAt as Record<string, unknown>).gte = startDate;
      if (endDate) (where.createdAt as Record<string, unknown>).lte = endDate;
    }

    const [items, total, pendingCount, reconciledCount, totals] = await Promise.all([
      prisma.packaging.findMany({
        where,
        select: {
          systemId: true,
          id: true,
          orderId: true,
          branchId: true,
          trackingCode: true,
          carrier: true,
          codAmount: true,
          shippingFeeToPartner: true,
          reconciliationStatus: true,
          deliveryStatus: true,
          deliveredDate: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.packaging.count({ where }),
      prisma.packaging.count({
        where: { ...where, reconciliationStatus: 'Chưa đối soát' },
      }),
      prisma.packaging.count({
        where: { ...where, reconciliationStatus: 'Đã đối soát' },
      }),
      prisma.packaging.aggregate({
        where,
        _sum: {
          codAmount: true,
          shippingFeeToPartner: true,
        },
      }),
    ]);

    const data = items.map((item) => ({
      ...item,
      codAmount: item.codAmount ? Number(item.codAmount) : null,
      shippingFeeToPartner: item.shippingFeeToPartner
        ? Number(item.shippingFeeToPartner)
        : null,
    }));

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
        summary: {
          totalPending: pendingCount,
          totalReconciled: reconciledCount,
          totalCodAmount: totals._sum.codAmount ? Number(totals._sum.codAmount) : 0,
          totalShippingFee: totals._sum.shippingFeeToPartner
            ? Number(totals._sum.shippingFeeToPartner)
            : 0,
        },
      },
    };
  } catch (error) {
    console.error('Failed to fetch reconciliation items:', error);
    return { success: false, error: 'Không thể tải dữ liệu đối soát' };
  }
}

/**
 * Mark a packaging as reconciled
 */
export async function markAsReconciled(
  systemId: string,
  data?: { notes?: string; reconciledBy?: string }
): Promise<ActionResult<Packaging>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const packaging = await prisma.packaging.findUnique({
      where: { systemId },
    });

    if (!packaging) {
      return { success: false, error: 'Không tìm thấy đối soát' };
    }

    if (packaging.reconciliationStatus === 'Đã đối soát') {
      return { success: false, error: 'Đơn hàng đã được đối soát' };
    }

    const updated = await prisma.packaging.update({
      where: { systemId },
      data: {
        reconciliationStatus: 'Đã đối soát',
        notes: data?.notes
          ? packaging.notes
            ? `${packaging.notes}\n[Đối soát] ${data.notes}`
            : `[Đối soát] ${data.notes}`
          : packaging.notes,
      },
    });

    revalidatePath('/reconciliation');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Failed to mark as reconciled:', error);
    return { success: false, error: 'Không thể cập nhật trạng thái đối soát' };
  }
}

/**
 * Bulk mark packagings as reconciled
 */
export async function bulkMarkAsReconciled(
  systemIds: string[],
  _reconciledBy?: string
): Promise<ActionResult<{ count: number }>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const result = await prisma.packaging.updateMany({
      where: {
        systemId: { in: systemIds },
        reconciliationStatus: { not: 'Đã đối soát' },
      },
      data: {
        reconciliationStatus: 'Đã đối soát',
      },
    });

    revalidatePath('/reconciliation');
    return { success: true, data: { count: result.count } };
  } catch (error) {
    console.error('Failed to bulk mark as reconciled:', error);
    return { success: false, error: 'Không thể cập nhật hàng loạt' };
  }
}

/**
 * Reset reconciliation status
 */
export async function resetReconciliationStatus(
  systemId: string
): Promise<ActionResult<Packaging>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const updated = await prisma.packaging.update({
      where: { systemId },
      data: {
        reconciliationStatus: 'Chưa đối soát',
      },
    });

    revalidatePath('/reconciliation');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Failed to reset reconciliation status:', error);
    return { success: false, error: 'Không thể đặt lại trạng thái' };
  }
}

/**
 * Update COD amount
 */
export async function updateCodAmount(
  systemId: string,
  codAmount: number
): Promise<ActionResult<Packaging>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const updated = await prisma.packaging.update({
      where: { systemId },
      data: { codAmount },
    });

    revalidatePath('/reconciliation');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Failed to update COD amount:', error);
    return { success: false, error: 'Không thể cập nhật tiền COD' };
  }
}

/**
 * Update shipping fee
 */
export async function updateShippingFee(
  systemId: string,
  shippingFeeToPartner: number
): Promise<ActionResult<Packaging>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const updated = await prisma.packaging.update({
      where: { systemId },
      data: { shippingFeeToPartner },
    });

    revalidatePath('/reconciliation');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Failed to update shipping fee:', error);
    return { success: false, error: 'Không thể cập nhật phí vận chuyển' };
  }
}

/**
 * Get reconciliation summary by carrier
 */
export async function getReconciliationByCarrier(
  filters: { startDate?: Date; endDate?: Date; branchId?: string } = {}
): Promise<ActionResult<Array<{
  carrier: string;
  totalOrders: number;
  pendingCount: number;
  reconciledCount: number;
  totalCod: number;
  totalFee: number;
}>>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const where: Record<string, unknown> = {
      trackingCode: { not: null },
      carrier: { not: null },
    };

    if (filters.branchId) where.branchId = filters.branchId;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) (where.createdAt as Record<string, unknown>).gte = filters.startDate;
      if (filters.endDate) (where.createdAt as Record<string, unknown>).lte = filters.endDate;
    }

    const grouped = await prisma.packaging.groupBy({
      by: ['carrier'],
      where,
      _count: true,
      _sum: {
        codAmount: true,
        shippingFeeToPartner: true,
      },
    });

    // Get pending/reconciled counts per carrier
    const carriers = grouped.map((g) => g.carrier).filter(Boolean) as string[];
    const statusCounts = await Promise.all(
      carriers.map(async (carrier) => {
        const [pending, reconciled] = await Promise.all([
          prisma.packaging.count({
            where: { ...where, carrier, reconciliationStatus: 'Chưa đối soát' },
          }),
          prisma.packaging.count({
            where: { ...where, carrier, reconciliationStatus: 'Đã đối soát' },
          }),
        ]);
        return { carrier, pending, reconciled };
      })
    );

    const statusMap = new Map(
      statusCounts.map((s) => [s.carrier, { pending: s.pending, reconciled: s.reconciled }])
    );

    const result = grouped
      .filter((g) => g.carrier)
      .map((g) => ({
        carrier: g.carrier!,
        totalOrders: g._count,
        pendingCount: statusMap.get(g.carrier!)?.pending || 0,
        reconciledCount: statusMap.get(g.carrier!)?.reconciled || 0,
        totalCod: g._sum.codAmount ? Number(g._sum.codAmount) : 0,
        totalFee: g._sum.shippingFeeToPartner ? Number(g._sum.shippingFeeToPartner) : 0,
      }));

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to get reconciliation by carrier:', error);
    return { success: false, error: 'Không thể tải thống kê theo hãng vận chuyển' };
  }
}

/**
 * Get available carriers
 */
export async function getCarriers(): Promise<ActionResult<string[]>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const carriers = await prisma.packaging.findMany({
      where: { carrier: { not: null } },
      select: { carrier: true },
      distinct: ['carrier'],
    });

    return { success: true, data: carriers.map((c) => c.carrier!).filter(Boolean) };
  } catch (error) {
    console.error('Failed to get carriers:', error);
    return { success: false, error: 'Không thể tải danh sách hãng vận chuyển' };
  }
}
