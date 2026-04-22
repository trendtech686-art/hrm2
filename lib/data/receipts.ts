/**
 * Receipts Data Fetcher (Server-side with caching)
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';
import type { PaginatedResult } from './orders';

export interface ReceiptFilters {
  page?: number;
  limit?: number;
  search?: string;
  branchId?: string;
  customerId?: string;
  status?: string;
  type?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ReceiptListItem {
  systemId: string;
  id: string;
  customerName: string | null;
  branchName: string | null;
  amount: number;
  status: string;
  type: string;
  createdAt: Date;
  paymentMethod: string | null;
}

import type { Prisma } from '@/generated/prisma/client';

function buildReceiptWhereClause(filters: ReceiptFilters): Prisma.ReceiptWhereInput {
  const where: Prisma.ReceiptWhereInput = {};

  if (filters.search) {
    where.OR = [
      { id: { contains: filters.search, mode: 'insensitive' } },
      { customerName: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.branchId) where.branchId = filters.branchId;
  if (filters.customerId) where.customerId = filters.customerId;
  if (filters.status) where.status = filters.status;
  if (filters.type) where.type = filters.type as Prisma.ReceiptWhereInput['type'];

  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
    if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
  }

  return where;
}

async function fetchReceipts(filters: ReceiptFilters): Promise<PaginatedResult<ReceiptListItem>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where = buildReceiptWhereClause(filters);
  const orderBy: Prisma.ReceiptOrderByWithRelationInput = {
    [filters.sortBy || 'createdAt']: filters.sortOrder || 'desc'
  };

  const [data, total] = await Promise.all([
    prisma.receipt.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        systemId: true,
        id: true,
        amount: true,
        status: true,
        type: true,
        createdAt: true,
        customerName: true,
        branchName: true,
        paymentMethod: true,
        customers: { select: { name: true } },
      },
    }),
    prisma.receipt.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(r => ({
      systemId: r.systemId,
      id: r.id,
      customerName: r.customers?.name || r.customerName || null,
      branchName: r.branchName || null,
      amount: r.amount.toNumber(),
      status: r.status,
      type: r.type,
      createdAt: r.createdAt,
      paymentMethod: r.paymentMethod,
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

export const getReceipts = cache(async (filters: ReceiptFilters = {}) => {
  const cacheKey = `receipts-${JSON.stringify(filters)}`;
  
  return unstable_cache(
    () => fetchReceipts(filters),
    [cacheKey],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.RECEIPTS] }
  )();
});

export const getReceiptById = cache(async (id: string) => {
  return unstable_cache(
    async () => {
      return prisma.receipt.findUnique({
        where: { systemId: id },
        include: {
          customers: true,
          order: true,
        },
      });
    },
    [`receipt-${id}`],
    { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.RECEIPTS] }
  )();
});

export const getReceiptStats = cache(async (branchId?: string) => {
  return unstable_cache(
    async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const where: Record<string, unknown> = {};
      if (branchId) where.branchId = branchId;

      const [total, completed, cancelled, totalAmountResult] = await Promise.all([
        prisma.receipt.count({ where }),
        prisma.receipt.count({ where: { ...where, status: 'completed' } }),
        prisma.receipt.count({ where: { ...where, status: 'cancelled' } }),
        prisma.receipt.aggregate({
          where,
          _sum: { amount: true },
        }),
      ]);

      return {
        total,
        completed,
        cancelled,
        totalAmount: totalAmountResult._sum?.amount?.toNumber() || 0,
      };
    },
    [`receipt-stats-${branchId || 'all'}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.RECEIPTS] }
  )();
});
