/**
 * Inventory Checks Data Fetcher (Server-side with caching)
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';
import type { PaginatedResult } from './orders';

export interface InventoryCheckFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  branchId?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface InventoryCheckListItem {
  systemId: string;
  id: string;
  branchName: string | null;
  status: string;
  totalItems: number;
  discrepancyCount: number;
  checkDate: Date;
  balancedAt: Date | null;
  balancedBy: string | null;
  notes: string | null;
}

function buildInventoryCheckWhereClause(filters: InventoryCheckFilters) {
  const where: Record<string, unknown> = {};

  if (filters.search) {
    where.OR = [
      { id: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.status) where.status = filters.status;
  if (filters.branchId) where.branchId = filters.branchId;

  if (filters.startDate || filters.endDate) {
    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (filters.startDate) dateFilter.gte = new Date(filters.startDate);
    if (filters.endDate) dateFilter.lte = new Date(filters.endDate);
    where.checkDate = dateFilter;
  }

  return where;
}

async function fetchInventoryChecks(filters: InventoryCheckFilters): Promise<PaginatedResult<InventoryCheckListItem>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where = buildInventoryCheckWhereClause(filters);
  const orderBy: Record<string, 'asc' | 'desc'> = {};
  orderBy[filters.sortBy || 'checkDate'] = filters.sortOrder || 'desc';

  const [data, total] = await Promise.all([
    prisma.inventoryCheck.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        systemId: true,
        id: true,
        status: true,
        checkDate: true,
        balancedAt: true,
        balancedBy: true,
        notes: true,
        branchName: true,
        items: {
          select: { systemQty: true, actualQty: true },
        },
      },
    }),
    prisma.inventoryCheck.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(ic => ({
      systemId: ic.systemId,
      id: ic.id,
      branchName: ic.branchName || '',
      status: ic.status,
      totalItems: ic.items.length,
      discrepancyCount: ic.items.filter(i => i.systemQty !== i.actualQty).length,
      checkDate: ic.checkDate,
      balancedAt: ic.balancedAt,
      balancedBy: ic.balancedBy || null,
      notes: ic.notes,
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

export const getInventoryChecks = cache(async (filters: InventoryCheckFilters = {}) => {
  const cacheKey = `inventory-checks-${JSON.stringify(filters)}`;
  
  return unstable_cache(
    () => fetchInventoryChecks(filters),
    [cacheKey],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.INVENTORY] }
  )();
});

export const getInventoryCheckById = cache(async (id: string) => {
  return unstable_cache(
    async () => {
      return prisma.inventoryCheck.findUnique({
        where: { systemId: id },
        include: {
          items: true,
        },
      });
    },
    [`inventory-check-${id}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.INVENTORY] }
  )();
});

export const getLatestInventoryCheck = cache(async (branchId: string) => {
  return unstable_cache(
    async () => {
      return prisma.inventoryCheck.findFirst({
        where: { branchId, status: 'COMPLETED' },
        orderBy: { balancedAt: 'desc' },
        select: {
          systemId: true,
          id: true,
          checkDate: true,
          balancedAt: true,
          items: { select: { systemId: true } },
        },
      });
    },
    [`latest-inventory-check-${branchId}`],
    { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.INVENTORY] }
  )();
});

/**
 * Get inventory check statistics
 */
export const getInventoryCheckStats = cache(async (branchId?: string) => {
  return unstable_cache(
    async () => {
      const where: Record<string, unknown> = {};
      if (branchId) where.branchId = branchId;

      const [draft, inProgress, completed, cancelled, total] = await Promise.all([
        prisma.inventoryCheck.count({ where: { ...where, status: 'DRAFT' } }),
        prisma.inventoryCheck.count({ where: { ...where, status: 'IN_PROGRESS' } }),
        prisma.inventoryCheck.count({ where: { ...where, status: 'COMPLETED' } }),
        prisma.inventoryCheck.count({ where: { ...where, status: 'CANCELLED' } }),
        prisma.inventoryCheck.count({ where }),
      ]);

      return { draft, inProgress, completed, cancelled, total };
    },
    [`inventory-check-stats-${branchId || 'all'}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.INVENTORY] }
  )();
});
