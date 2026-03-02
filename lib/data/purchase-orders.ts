/**
 * Purchase Orders Data Fetcher (Server-side with caching)
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';
import type { PaginatedResult } from './orders';

export interface PurchaseOrderFilters {
  page?: number;
  limit?: number;
  search?: string;
  supplierId?: string;
  branchId?: string;
  status?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PurchaseOrderListItem {
  systemId: string;
  id: string;
  supplierName: string;
  branchName: string;
  status: string;
  total: number;
  paid: number;
  orderDate: Date;
  expectedDate: Date | null;
  creatorName: string | null;
}

import type { Prisma } from '@/generated/prisma/client';

function buildPurchaseOrderWhereClause(filters: PurchaseOrderFilters): Prisma.PurchaseOrderWhereInput {
  const where: Prisma.PurchaseOrderWhereInput = {};

  if (filters.search) {
    where.OR = [
      { id: { contains: filters.search, mode: 'insensitive' } },
      { supplierName: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.supplierId) where.supplierId = filters.supplierId;
  if (filters.branchId) where.branchId = filters.branchId;
  if (filters.status) where.status = filters.status as Prisma.PurchaseOrderWhereInput['status'];

  if (filters.startDate || filters.endDate) {
    where.orderDate = {};
    if (filters.startDate) where.orderDate.gte = new Date(filters.startDate);
    if (filters.endDate) where.orderDate.lte = new Date(filters.endDate);
  }

  return where;
}

async function fetchPurchaseOrders(filters: PurchaseOrderFilters): Promise<PaginatedResult<PurchaseOrderListItem>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where = buildPurchaseOrderWhereClause(filters);
  const orderBy: Prisma.PurchaseOrderOrderByWithRelationInput = {
    [filters.sortBy || 'orderDate']: filters.sortOrder || 'desc'
  };

  const [data, total] = await Promise.all([
    prisma.purchaseOrder.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        systemId: true,
        id: true,
        status: true,
        total: true,
        paid: true,
        orderDate: true,
        expectedDate: true,
        supplierName: true,
        branchName: true,
        creatorName: true,
      },
    }),
    prisma.purchaseOrder.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(po => ({
      systemId: po.systemId,
      id: po.id,
      supplierName: po.supplierName || '',
      branchName: po.branchName || '',
      status: po.status,
      total: po.total.toNumber(),
      paid: po.paid.toNumber(),
      orderDate: po.orderDate,
      expectedDate: po.expectedDate,
      creatorName: po.creatorName || null,
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

export const getPurchaseOrders = cache(async (filters: PurchaseOrderFilters = {}) => {
  const cacheKey = `purchase-orders:${JSON.stringify(filters)}`;
  
  return unstable_cache(
    () => fetchPurchaseOrders(filters),
    [cacheKey],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.PURCHASE_ORDERS] }
  )();
});

export const getPurchaseOrderById = cache(async (id: string) => {
  return unstable_cache(
    async () => {
      return prisma.purchaseOrder.findUnique({
        where: { systemId: id },
        include: {
          supplier: true,
          items: {
            include: { product: true },
          },
          payments: true,
        },
      });
    },
    [`purchase-order-${id}`],
    { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.PURCHASE_ORDERS] }
  )();
});

export const getPurchaseOrderStats = cache(async () => {
  return unstable_cache(
    async () => {
      const [totalOrders, pending, completed, totalAmountResult] = await Promise.all([
        prisma.purchaseOrder.count(),
        prisma.purchaseOrder.count({ where: { status: 'PENDING' } }),
        prisma.purchaseOrder.count({ where: { status: 'COMPLETED' } }),
        prisma.purchaseOrder.aggregate({
          where: { status: { not: 'CANCELLED' } },
          _sum: { grandTotal: true },
        }),
      ]);

      return { 
        totalOrders, 
        pendingOrders: pending, 
        completedOrders: completed,
        totalAmount: Number(totalAmountResult._sum?.grandTotal || 0),
      };
    },
    ['purchase-order-stats'],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.PURCHASE_ORDERS] }
  )();
});

export interface POItemStats {
  totalOrdered: number;
  totalReceived: number;
  totalReturned: number;
  netInStock: number;
  receivedRate: string;
  returnedRate: string;
}

/**
 * Server-side computation of PO item-level statistics
 * Replaces client-side loading of 3 large datasets (POs + Receipts + Returns)
 */
export const getPOItemStats = cache(async (): Promise<POItemStats> => {
  return unstable_cache(
    async () => {
      const [totalOrderedResult, totalReceivedResult, totalReturnedResult] = await Promise.all([
        // Sum of all PO line item quantities (excluding cancelled POs)
        prisma.purchaseOrderItem.aggregate({
          _sum: { quantity: true },
          where: { purchaseOrder: { status: { not: 'CANCELLED' } } },
        }),
        // Sum of receipt item quantities where receipt is linked to a PO
        prisma.inventoryReceiptItem.aggregate({
          _sum: { quantity: true },
          where: { inventoryReceipt: { purchaseOrderId: { not: null } } },
        }),
        // Sum of return item quantities where return is linked to a PO
        prisma.purchaseReturnItem.aggregate({
          _sum: { quantity: true },
          where: { purchaseReturn: { purchaseOrderId: { not: null } } },
        }),
      ]);

      const totalOrdered = totalOrderedResult._sum?.quantity || 0;
      const totalReceived = totalReceivedResult._sum?.quantity || 0;
      const totalReturned = totalReturnedResult._sum?.quantity || 0;
      const netInStock = totalReceived - totalReturned;

      return {
        totalOrdered,
        totalReceived,
        totalReturned,
        netInStock,
        receivedRate: totalOrdered > 0 ? ((totalReceived / totalOrdered) * 100).toFixed(1) : '0',
        returnedRate: totalReceived > 0 ? ((totalReturned / totalReceived) * 100).toFixed(1) : '0',
      };
    },
    ['po-item-stats'],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.PURCHASE_ORDERS] }
  )();
});
