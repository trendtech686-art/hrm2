/**
 * Penalties Data Fetchers
 * Server-side data fetching with caching
 */

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache';

export interface Penalty {
  id: string;
  systemId: string;
  employeeId?: string | null;
  employeeName?: string | null;
  penaltyTypeId?: string | null;
  penaltyTypeName?: string | null;
  amount: number;
  reason?: string | null;
  date: Date;
  status: string;
  category?: string | null;
  isApplied: boolean;
  deductedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PenaltiesParams {
  search?: string;
  status?: string;
  category?: string;
  employeeId?: string;
  isApplied?: boolean;
  page?: number;
  limit?: number;
}

// Request-level cache for penalties
export const getPenalties = cache(async (params: PenaltiesParams = {}) => {
  return fetchPenaltiesWithCache(params);
});

// Time-based cache for penalties list
const fetchPenaltiesWithCache = unstable_cache(
  async (params: PenaltiesParams) => {
    const { search, status, category, employeeId, isApplied, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { employeeName: { contains: search, mode: 'insensitive' } },
        { penaltyTypeName: { contains: search, mode: 'insensitive' } },
        { reason: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (isApplied !== undefined) {
      where.isApplied = isApplied;
    }

    const [items, total] = await Promise.all([
      prisma.penalty.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.penalty.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
  [CACHE_TAGS.PENALTIES],
  { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.PENALTIES] }
);

// Get all penalties (for select options)
export const getAllPenalties = cache(async () => {
  return fetchAllPenaltiesWithCache();
});

const fetchAllPenaltiesWithCache = unstable_cache(
  async () => {
    return prisma.penalty.findMany({
      where: { isApplied: false },
      orderBy: { date: 'desc' },
      select: { id: true, systemId: true, employeeName: true, penaltyTypeName: true, amount: true, status: true },
    });
  },
  [CACHE_TAGS.PENALTIES],
  { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.PENALTIES] }
);
