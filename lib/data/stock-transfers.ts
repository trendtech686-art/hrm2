/**
 * Stock Transfers Data Fetcher (Server-side with caching)
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';
import type { PaginatedResult } from './orders';

// Helper to build cache key from filters
function buildCacheKey(prefix: string, filters: StockTransferFilters): string {
  const filterObj = filters as Record<string, unknown>;
  const sortedKeys = Object.keys(filterObj).sort();
  const parts = sortedKeys.map(k => `${k}:${JSON.stringify(filterObj[k])}`);
  return `${prefix}:${parts.join(',')}`;
}

export interface StockTransferFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  fromBranchId?: string;
  toBranchId?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface StockTransferListItem {
  systemId: string;
  id: string;
  fromBranchName: string;
  toBranchName: string;
  status: string;
  totalItems: number;
  transferDate: Date;
  receivedDate: Date | null;
  createdByName: string | null;
  note: string | null;
}

import type { Prisma } from '@/generated/prisma/client';

function buildStockTransferWhereClause(filters: StockTransferFilters): Prisma.StockTransferWhereInput {
  const where: Prisma.StockTransferWhereInput = {};

  if (filters.search) {
    where.OR = [
      { id: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.status) where.status = filters.status as Prisma.StockTransferWhereInput['status'];
  if (filters.fromBranchId) where.fromBranchId = filters.fromBranchId;
  if (filters.toBranchId) where.toBranchId = filters.toBranchId;

  if (filters.startDate || filters.endDate) {
    where.transferDate = {};
    if (filters.startDate) where.transferDate.gte = new Date(filters.startDate);
    if (filters.endDate) where.transferDate.lte = new Date(filters.endDate);
  }

  return where;
}

async function fetchStockTransfers(filters: StockTransferFilters): Promise<PaginatedResult<StockTransferListItem>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where = buildStockTransferWhereClause(filters);
  const orderBy: Record<string, string> = {};
  orderBy[filters.sortBy || 'transferDate'] = filters.sortOrder || 'desc';

  const [data, total] = await Promise.all([
    prisma.stockTransfer.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        systemId: true,
        id: true,
        status: true,
        transferDate: true,
        receivedDate: true,
        note: true,
        fromBranchName: true,
        toBranchName: true,
        createdByName: true,
        _count: { select: { items: true } },
      },
    }),
    prisma.stockTransfer.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(st => ({
      systemId: st.systemId,
      id: st.id,
      fromBranchName: st.fromBranchName || '',
      toBranchName: st.toBranchName || '',
      status: st.status,
      totalItems: st._count.items,
      transferDate: st.transferDate,
      receivedDate: st.receivedDate,
      createdByName: st.createdByName || null,
      note: st.note,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export const getStockTransfers = cache(async (filters: StockTransferFilters = {}) => {
  const cacheKey = buildCacheKey('stock-transfers', filters);
  
  return unstable_cache(
    () => fetchStockTransfers(filters),
    [cacheKey],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.STOCK_TRANSFERS] }
  )();
});

export const getStockTransferById = cache(async (id: string) => {
  return unstable_cache(
    async () => {
      return prisma.stockTransfer.findUnique({
        where: { systemId: id },
        include: {
          items: true,
        },
      });
    },
    [`stock-transfer-${id}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.STOCK_TRANSFERS] }
  )();
});

export const getPendingTransfers = cache(async (branchId: string) => {
  return unstable_cache(
    async () => {
      return prisma.stockTransfer.findMany({
        where: {
          OR: [
            { fromBranchId: branchId, status: 'PENDING' },
            { toBranchId: branchId, status: 'IN_TRANSIT' },
          ],
        },
        select: {
          systemId: true,
          id: true,
          fromBranchName: true,
          toBranchName: true,
          status: true,
          transferDate: true,
          _count: { select: { items: true } },
        },
        orderBy: { transferDate: 'desc' },
      });
    },
    [`pending-transfers-${branchId}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.STOCK_TRANSFERS] }
  )();
});

/**
 * Get stock transfer statistics
 */
export const getStockTransferStats = cache(async (branchId?: string) => {
  return unstable_cache(
    async () => {
      const where: { OR?: { fromBranchId?: string; toBranchId?: string }[] } = {};
      if (branchId) {
        where.OR = [{ fromBranchId: branchId }, { toBranchId: branchId }];
      }

      const [pending, inTransit, completed, cancelled, total] = await Promise.all([
        prisma.stockTransfer.count({ where: { ...where, status: 'PENDING' } }),
        prisma.stockTransfer.count({ where: { ...where, status: 'IN_TRANSIT' } }),
        prisma.stockTransfer.count({ where: { ...where, status: 'COMPLETED' } }),
        prisma.stockTransfer.count({ where: { ...where, status: 'CANCELLED' } }),
        prisma.stockTransfer.count({ where }),
      ]);

      return { pending, inTransit, completed, cancelled, total };
    },
    [`stock-transfer-stats-${branchId || 'all'}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.STOCK_TRANSFERS] }
  )();
});
