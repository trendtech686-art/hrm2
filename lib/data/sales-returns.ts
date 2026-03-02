/**
 * Sales Returns Data Fetchers
 * Server-side data fetching with caching
 */

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache';

export interface SalesReturn {
  id: string;
  code: string;
  receiptId?: string;
  receipt?: {
    id: string;
    code: string;
  };
  customerId?: string;
  customer?: {
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
  refundAmount: number;
  reason?: string;
  note?: string;
  returnDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalesReturnsParams {
  search?: string;
  customerId?: string;
  branchId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Request-level cache for sales returns
export const getSalesReturns = cache(async (params: SalesReturnsParams = {}) => {
  return fetchSalesReturnsWithCache(params);
});

// Time-based cache for sales returns list
import type { Prisma } from '@/generated/prisma/client';

const fetchSalesReturnsWithCache = unstable_cache(
  async (params: SalesReturnsParams) => {
    const { search, customerId, branchId, status, startDate, endDate, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.SalesReturnWhereInput = {};

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (branchId) {
      where.branchId = branchId;
    }

    if (status) {
      where.status = status as Prisma.SalesReturnWhereInput['status'];
    }

    if (startDate || endDate) {
      where.returnDate = {};
      if (startDate) where.returnDate.gte = new Date(startDate);
      if (endDate) where.returnDate.lte = new Date(endDate);
    }

    const [items, total] = await Promise.all([
      prisma.salesReturn.findMany({
        where,
        include: {
          // branch: { select: { id: true, name: true } }, // Removed: relation doesn't exist
          // receipt: { select: { id: true, code: true } }, // Removed: relation doesn't exist
        },
        orderBy: { returnDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.salesReturn.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
  [CACHE_TAGS.SALES_RETURNS],
  { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.SALES_RETURNS] }
);

// Get single sales return by ID
export const getSalesReturnById = cache(async (id: string) => {
  return fetchSalesReturnByIdWithCache(id);
});

const fetchSalesReturnByIdWithCache = unstable_cache(
  async (id: string) => {
    return prisma.salesReturn.findUnique({
      where: { id },
      include: {
        // branch: true, // Removed: relation doesn't exist
        // receipt: true, // Removed: relation doesn't exist
        items: true,
        // createdBy: { select: { id: true, name: true } }, // Removed: relation doesn't exist
      },
    });
  },
  [CACHE_TAGS.SALES_RETURNS],
  { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.SALES_RETURNS] }
);
