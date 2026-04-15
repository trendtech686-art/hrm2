/**
 * Suppliers Data Fetcher (Server-side with caching)
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';
import { buildCacheKey } from '@/lib/cache/index';
import type { PaginatedResult } from './orders';

export interface SupplierFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SupplierListItem {
  systemId: string;
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  isActive: boolean;
  totalOrders: number;
  totalAmount: number;
}

import type { Prisma } from '@/generated/prisma/client';

function buildSupplierWhereClause(filters: SupplierFilters): Prisma.SupplierWhereInput {
  const where: Prisma.SupplierWhereInput = {};

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { phone: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.isActive !== undefined) where.isActive = filters.isActive;

  return where;
}

async function fetchSuppliers(filters: SupplierFilters): Promise<PaginatedResult<SupplierListItem>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where = buildSupplierWhereClause(filters);
  const orderBy: Prisma.SupplierOrderByWithRelationInput = {
    [filters.sortBy || 'name']: filters.sortOrder || 'asc'
  };

  const [data, totalCount] = await Promise.all([
    prisma.supplier.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        _count: { select: { purchaseOrders: true } },
        purchaseOrders: {
          select: { total: true },
          where: { status: 'COMPLETED' },
        },
      },
    }),
    prisma.supplier.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    data: data.map(s => ({
      systemId: s.systemId,
      id: s.id,
      name: s.name,
      phone: s.phone,
      email: s.email,
      address: s.address,
      isActive: s.isActive,
      totalOrders: s._count.purchaseOrders,
      totalAmount: s.purchaseOrders.reduce((sum, po) => sum + po.total.toNumber(), 0),
    })),
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export const getSuppliers = cache(async (filters: SupplierFilters = {}) => {
  const cacheKey = buildCacheKey(
    'suppliers',
    filters.page,
    filters.limit,
    filters.search,
    filters.isActive?.toString(),
    filters.sortBy,
    filters.sortOrder
  );
  
  return unstable_cache(
    () => fetchSuppliers(filters),
    [cacheKey],
    { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.SUPPLIERS] }
  )();
});

export const getSupplierById = cache(async (id: string) => {
  return unstable_cache(
    async () => {
      return prisma.supplier.findUnique({
        where: { systemId: id },
        include: {
          purchaseOrders: {
            take: 10,
            orderBy: { orderDate: 'desc' },
          },
        },
      });
    },
    [`supplier-${id}`],
    { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.SUPPLIERS] }
  )();
});

export const getSuppliersForSelect = cache(async () => {
  return unstable_cache(
    async () => {
      return prisma.supplier.findMany({
        where: { isActive: true },
        select: {
          systemId: true,
          id: true,
          name: true,
        },
        orderBy: { name: 'asc' },
      });
    },
    ['suppliers-select'],
    { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.SUPPLIERS] }
  )();
});

/**
 * Get supplier statistics - CACHED (1 min)
 */
export const getSupplierStats = unstable_cache(
  async () => {
    const [total, activeCount, debitResult, creditResult, totalPurchasedResult, totalPaidResult, deletedCount] = await Promise.all([
      prisma.supplier.count({ where: { isDeleted: false } }),
      prisma.supplier.count({ where: { status: 'Đang Giao Dịch', isDeleted: false } }),
      prisma.supplier.aggregate({ _sum: { currentDebt: true }, where: { currentDebt: { gt: 0 }, isDeleted: false } }),
      prisma.supplier.aggregate({ _sum: { currentDebt: true }, where: { currentDebt: { lt: 0 }, isDeleted: false } }),
      prisma.supplier.aggregate({ _sum: { totalPurchased: true }, where: { isDeleted: false } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { supplierId: { not: null }, status: { not: 'cancelled' } } }),
      prisma.supplier.count({ where: { isDeleted: true } }),
    ]);

    return {
      totalSuppliers: total,
      activeSuppliers: activeCount,
      totalDebit: Number(debitResult._sum?.currentDebt || 0),
      totalCredit: Math.abs(Number(creditResult._sum?.currentDebt || 0)),
      totalPurchased: Number(totalPurchasedResult._sum?.totalPurchased || 0),
      totalPaid: Number(totalPaidResult._sum?.amount || 0),
      deletedCount,
    };
  },
  ['supplier-stats'],
  { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.SUPPLIERS] }
);
