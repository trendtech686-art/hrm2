/**
 * Returns Data Fetcher (Server-side with caching)
 * 
 * Schema:
 * - SalesReturn: systemId, id, orderId, customerId, branchId, returnDate, status, reason,
 *                total, refundAmount, customerName, branchName (denormalized)
 * - PurchaseReturn: systemId, id, supplierId, purchaseOrderId, branchId, returnDate, status,
 *                   total, refundAmount, supplierName, branchName (denormalized)
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';
import type { PaginatedResult } from './orders';

// ============= SALES RETURNS =============

export interface SalesReturnFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  branchId?: string;
  customerId?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SalesReturnListItem {
  systemId: string;
  id: string;
  orderId: string;
  customerName: string | null;
  status: string;
  total: number;
  refundAmount: number;
  branchName: string | null;
  returnDate: Date;
  reason: string | null;
}

function buildSalesReturnWhereClause(filters: SalesReturnFilters) {
  const where: Record<string, unknown> = {};

  if (filters.search) {
    where.OR = [
      { id: { contains: filters.search, mode: 'insensitive' } },
      { customerName: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.status) where.status = filters.status;
  if (filters.branchId) where.branchId = filters.branchId;
  if (filters.customerId) where.customerId = filters.customerId;

  if (filters.startDate || filters.endDate) {
    where.returnDate = {};
    if (filters.startDate) (where.returnDate as Record<string, unknown>).gte = new Date(String(filters.startDate));
    if (filters.endDate) (where.returnDate as Record<string, unknown>).lte = new Date(String(filters.endDate));
  }

  return where;
}

async function fetchSalesReturns(filters: SalesReturnFilters): Promise<PaginatedResult<SalesReturnListItem>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where = buildSalesReturnWhereClause(filters);
  const orderBy: Record<string, 'asc' | 'desc'> = {};
  orderBy[filters.sortBy || 'returnDate'] = filters.sortOrder || 'desc';

  const [data, total] = await Promise.all([
    prisma.salesReturn.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        systemId: true,
        id: true,
        orderId: true,
        status: true,
        total: true,
        refundAmount: true,
        returnDate: true,
        reason: true,
        customerName: true,
        branchName: true,
      },
    }),
    prisma.salesReturn.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(sr => ({
      systemId: sr.systemId,
      id: sr.id,
      orderId: sr.orderId,
      customerName: sr.customerName,
      status: sr.status,
      total: Number(sr.total),
      refundAmount: Number(sr.refundAmount ?? 0),
      branchName: sr.branchName,
      returnDate: sr.returnDate,
      reason: sr.reason,
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

export const getSalesReturns = cache(async (filters: SalesReturnFilters = {}) => {
  const cacheKey = `sales-returns-${JSON.stringify(filters)}`;
  
  return unstable_cache(
    () => fetchSalesReturns(filters),
    [cacheKey],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.SALES_RETURNS] }
  )();
});

export const getSalesReturnById = cache(async (id: string) => {
  return unstable_cache(
    async () => {
      return prisma.salesReturn.findUnique({
        where: { systemId: id },
        include: {
          items: true,
        },
      });
    },
    [`sales-return-${id}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.SALES_RETURNS] }
  )();
});

// ============= PURCHASE RETURNS =============

export interface PurchaseReturnFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  branchId?: string;
  supplierId?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PurchaseReturnListItem {
  systemId: string;
  id: string;
  purchaseOrderId: string | null;
  supplierName: string | null;
  status: string;
  total: number;
  branchName: string | null;
  returnDate: Date;
  reason: string | null;
}

function buildPurchaseReturnWhereClause(filters: PurchaseReturnFilters) {
  const where: Record<string, unknown> = {};

  if (filters.search) {
    where.OR = [
      { id: { contains: filters.search, mode: 'insensitive' } },
      { supplierName: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.status) where.status = filters.status;
  if (filters.branchId) where.branchId = filters.branchId;
  if (filters.supplierId) where.supplierId = filters.supplierId;

  if (filters.startDate || filters.endDate) {
    where.returnDate = {};
    if (filters.startDate) (where.returnDate as Record<string, unknown>).gte = new Date(String(filters.startDate));
    if (filters.endDate) (where.returnDate as Record<string, unknown>).lte = new Date(String(filters.endDate));
  }

  return where;
}

async function fetchPurchaseReturns(filters: PurchaseReturnFilters): Promise<PaginatedResult<PurchaseReturnListItem>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where = buildPurchaseReturnWhereClause(filters);
  const orderBy: Record<string, 'asc' | 'desc'> = {};
  orderBy[filters.sortBy || 'returnDate'] = filters.sortOrder || 'desc';

  const [data, total] = await Promise.all([
    prisma.purchaseReturn.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        systemId: true,
        id: true,
        purchaseOrderId: true,
        status: true,
        total: true,
        returnDate: true,
        reason: true,
        supplierName: true,
        branchName: true,
      },
    }),
    prisma.purchaseReturn.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(pr => ({
      systemId: pr.systemId,
      id: pr.id,
      purchaseOrderId: pr.purchaseOrderId,
      supplierName: pr.supplierName,
      status: pr.status,
      total: Number(pr.total),
      branchName: pr.branchName,
      returnDate: pr.returnDate,
      reason: pr.reason,
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

export const getPurchaseReturns = cache(async (filters: PurchaseReturnFilters = {}) => {
  const cacheKey = `purchase-returns-${JSON.stringify(filters)}`;
  
  return unstable_cache(
    () => fetchPurchaseReturns(filters),
    [cacheKey],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.PURCHASE_RETURNS] }
  )();
});

export const getPurchaseReturnById = cache(async (id: string) => {
  return unstable_cache(
    async () => {
      return prisma.purchaseReturn.findUnique({
        where: { systemId: id },
        include: {
          items: true,
          suppliers: true,
        },
      });
    },
    [`purchase-return-${id}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.PURCHASE_RETURNS] }
  )();
});
