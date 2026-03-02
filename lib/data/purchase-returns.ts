/**
 * Purchase Returns Data Fetchers
 * Server-side data fetching with caching
 */

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache';

export interface PurchaseReturn {
  id: string;
  code: string;
  purchaseOrderId?: string;
  purchaseOrder?: {
    id: string;
    code: string;
  };
  supplierId: string;
  supplier?: {
    id: string;
    name: string;
  };
  branchId: string;
  branch?: {
    id: string;
    name: string;
  };
  status: string;
  totalAmount: number;
  reason?: string;
  note?: string;
  returnDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseReturnsParams {
  search?: string;
  supplierId?: string;
  branchId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Request-level cache for purchase returns
export const getPurchaseReturns = cache(async (params: PurchaseReturnsParams = {}) => {
  return fetchPurchaseReturnsWithCache(params);
});

// Time-based cache for purchase returns list
import type { Prisma } from '@/generated/prisma/client';

const fetchPurchaseReturnsWithCache = unstable_cache(
  async (params: PurchaseReturnsParams) => {
    const { search, supplierId, branchId, status, startDate, endDate, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.PurchaseReturnWhereInput = {};

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { suppliers: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (supplierId) {
      where.supplierId = supplierId;
    }

    if (branchId) {
      where.branchId = branchId;
    }

    if (status) {
      where.status = status as Prisma.PurchaseReturnWhereInput['status'];
    }

    if (startDate || endDate) {
      where.returnDate = {};
      if (startDate) where.returnDate.gte = new Date(startDate);
      if (endDate) where.returnDate.lte = new Date(endDate);
    }

    const [items, total] = await Promise.all([
      prisma.purchaseReturn.findMany({
        where,
        include: {
          suppliers: { select: { id: true, name: true } },
          // branch: { select: { id: true, name: true } }, // Removed: relation doesn't exist
          // purchaseOrder: { select: { id: true, code: true } }, // Removed: relation doesn't exist
        },
        orderBy: { returnDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.purchaseReturn.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
  [CACHE_TAGS.PURCHASE_RETURNS],
  { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.PURCHASE_RETURNS] }
);

// Get single purchase return by ID
export const getPurchaseReturnById = cache(async (id: string) => {
  return fetchPurchaseReturnByIdWithCache(id);
});

const fetchPurchaseReturnByIdWithCache = unstable_cache(
  async (id: string) => {
    return prisma.purchaseReturn.findUnique({
      where: { id },
      include: {
        suppliers: true,
        // branch: true, // Removed: relation doesn't exist
        // purchaseOrder: true, // Removed: relation doesn't exist
        items: true,
        // createdBy: { select: { id: true, name: true } }, // Removed: relation doesn't exist
      },
    });
  },
  [CACHE_TAGS.PURCHASE_RETURNS],
  { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.PURCHASE_RETURNS] }
);

// --- Stats ---

export interface PurchaseReturnStatsData {
  total: number;
  totalValue: number;
  totalRefund: number;
  byStatus: Array<{ status: string; count: number }>;
  recent: Array<{
    systemId: string;
    id: string;
    status: string;
    totalReturnValue: number;
    refundAmount: number;
    supplierName: string;
    returnDate: string;
    createdAt: string;
  }>;
}

export const getPurchaseReturnStats = cache(async (): Promise<PurchaseReturnStatsData> => {
  return unstable_cache(
    async (): Promise<PurchaseReturnStatsData> => {
      const [totalAgg, byStatus, recent] = await Promise.all([
        prisma.purchaseReturn.aggregate({
          _count: true,
          _sum: { totalReturnValue: true, refundAmount: true },
        }),
        prisma.purchaseReturn.groupBy({
          by: ['status'],
          _count: true,
        }),
        prisma.purchaseReturn.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { suppliers: { select: { name: true } } },
        }),
      ]);

      return {
        total: totalAgg._count,
        totalValue: Number(totalAgg._sum.totalReturnValue ?? 0),
        totalRefund: Number(totalAgg._sum.refundAmount ?? 0),
        byStatus: byStatus.map(s => ({ status: s.status, count: s._count })),
        recent: recent.map(r => ({
          systemId: r.systemId,
          id: r.id,
          status: r.status,
          totalReturnValue: Number(r.totalReturnValue ?? 0),
          refundAmount: Number(r.refundAmount ?? 0),
          supplierName: r.suppliers?.name ?? '',
          returnDate: r.returnDate.toISOString(),
          createdAt: r.createdAt.toISOString(),
        })),
      };
    },
    ['purchase-return-stats'],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.PURCHASE_RETURNS] }
  )();
});
