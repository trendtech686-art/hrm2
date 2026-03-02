/**
 * Cost Adjustments Data Fetchers
 * Server-side data fetching with caching
 */

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache';

export interface CostAdjustment {
  id: string;
  code: string;
  name: string;
  type: string;
  status: string;
  adjustmentDate: Date;
  branchId?: string;
  branch?: {
    id: string;
    name: string;
  };
  note?: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CostAdjustmentsParams {
  search?: string;
  type?: string;
  status?: string;
  branchId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Request-level cache for cost adjustments
export const getCostAdjustments = cache(async (params: CostAdjustmentsParams = {}) => {
  return fetchCostAdjustmentsWithCache(params);
});

// Time-based cache for cost adjustments list
const fetchCostAdjustmentsWithCache = unstable_cache(
  async (params: CostAdjustmentsParams) => {
    const { search, type, status, branchId, startDate, endDate, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (branchId) {
      where.branchId = branchId;
    }

    if (startDate || endDate) {
      const dateFilter: { gte?: Date; lte?: Date } = {};
      if (startDate) dateFilter.gte = new Date(startDate);
      if (endDate) dateFilter.lte = new Date(endDate);
      where.adjustmentDate = dateFilter;
    }

    const [items, total] = await Promise.all([
      prisma.costAdjustment.findMany({
        where,
        orderBy: { adjustmentDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.costAdjustment.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
  [CACHE_TAGS.COST_ADJUSTMENTS],
  { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.COST_ADJUSTMENTS] }
);

// Get single cost adjustment by ID
export const getCostAdjustmentById = cache(async (id: string) => {
  return fetchCostAdjustmentByIdWithCache(id);
});

const fetchCostAdjustmentByIdWithCache = unstable_cache(
  async (id: string) => {
    return prisma.costAdjustment.findUnique({
      where: { id },
      include: {
        items: true,
        // createdBy: { select: { id: true, name: true } }, // Removed: relation doesn't exist
      },
    });
  },
  [CACHE_TAGS.COST_ADJUSTMENTS],
  { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.COST_ADJUSTMENTS] }
);
