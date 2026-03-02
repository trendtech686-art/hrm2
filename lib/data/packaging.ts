/**
 * Packaging Data Fetchers
 * Server-side data fetching with caching
 */

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache';

export interface PackagingData {
  systemId: string;
  id: string;
  orderId: string;
  branchId: string;
  employeeId: string | null;
  packDate: Date;
  status: string;
  totalItems: number;
  packedItems: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PackagingParams {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// Request-level cache for packaging
export const getPackagingUnits = cache(async (params: PackagingParams = {}) => {
  return fetchPackagingUnitsWithCache(params);
});

// Time-based cache for packaging list
const fetchPackagingUnitsWithCache = unstable_cache(
  async (params: PackagingParams) => {
    const { search, isActive, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { orderId: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      // Map isActive to status filter
      where.status = isActive ? { not: 'CANCELLED' } : 'CANCELLED';
    }

    const [items, total] = await Promise.all([
      prisma.packaging.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.packaging.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
  [CACHE_TAGS.PACKAGING],
  { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.PACKAGING] }
);

// Get all packaging units (for select options)
export const getAllPackagingUnits = cache(async () => {
  return fetchAllPackagingUnitsWithCache();
});

const fetchAllPackagingUnitsWithCache = unstable_cache(
  async () => {
    return prisma.packaging.findMany({
      where: { status: { not: 'CANCELLED' } },
      orderBy: { createdAt: 'desc' },
      select: { systemId: true, id: true, orderId: true, status: true },
    });
  },
  [CACHE_TAGS.PACKAGING],
  { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.PACKAGING] }
);
