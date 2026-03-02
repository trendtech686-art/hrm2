/**
 * Price Adjustments Data Fetchers
 * Server-side data fetching with caching
 */

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache';

export interface PriceAdjustment {
  id: string;
  code: string;
  name: string;
  type: string;
  status: string;
  startDate: Date;
  endDate?: Date;
  branchId?: string;
  branch?: {
    id: string;
    name: string;
  };
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PriceAdjustmentsParams {
  search?: string;
  type?: string;
  status?: string;
  branchId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Request-level cache for price adjustments
export const getPriceAdjustments = cache(async (params: PriceAdjustmentsParams = {}) => {
  return fetchPriceAdjustmentsWithCache(params);
});

// Time-based cache for price adjustments list
const fetchPriceAdjustmentsWithCache = unstable_cache(
  async (params: PriceAdjustmentsParams) => {
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
      where.startDate = dateFilter;
    }

    const [items, total] = await Promise.all([
      prisma.priceAdjustment.findMany({
        where,
        include: {
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.priceAdjustment.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
  [CACHE_TAGS.PRICE_ADJUSTMENTS],
  { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.PRICE_ADJUSTMENTS] }
);

// Get single price adjustment by ID
export const getPriceAdjustmentById = cache(async (id: string) => {
  return fetchPriceAdjustmentByIdWithCache(id);
});

const fetchPriceAdjustmentByIdWithCache = unstable_cache(
  async (id: string) => {
    return prisma.priceAdjustment.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  },
  [CACHE_TAGS.PRICE_ADJUSTMENTS],
  { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.PRICE_ADJUSTMENTS] }
);
