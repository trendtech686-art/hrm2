/**
 * Stock Locations Data Fetchers
 * Server-side data fetching with caching
 */

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache';

export interface StockLocation {
  id: string;
  name: string;
  code: string;
  type: string;
  address?: string;
  branchId: string;
  branch?: {
    id: string;
    name: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockLocationsParams {
  search?: string;
  branchId?: string;
  type?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// Request-level cache for stock locations
export const getStockLocations = cache(async (params: StockLocationsParams = {}) => {
  return fetchStockLocationsWithCache(params);
});

// Time-based cache for stock locations list
import type { Prisma } from '@/generated/prisma/client';

const fetchStockLocationsWithCache = unstable_cache(
  async (params: StockLocationsParams) => {
    const { search, branchId, type: _type, isActive, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.StockLocationWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (branchId) {
      where.branchId = branchId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [items, total] = await Promise.all([
      prisma.stockLocation.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      prisma.stockLocation.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
  [CACHE_TAGS.STOCK_LOCATIONS],
  { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.STOCK_LOCATIONS] }
);

// Get single stock location by ID
export const getStockLocationById = cache(async (id: string) => {
  return fetchStockLocationByIdWithCache(id);
});

const fetchStockLocationByIdWithCache = unstable_cache(
  async (id: string) => {
    return prisma.stockLocation.findUnique({
      where: { id },
    });
  },
  [CACHE_TAGS.STOCK_LOCATIONS],
  { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.STOCK_LOCATIONS] }
);
