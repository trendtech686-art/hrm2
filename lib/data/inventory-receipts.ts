/**
 * Inventory Receipts Data Fetchers
 * Server-side data fetching with caching
 */

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache';

export interface InventoryReceipt {
  id: string;
  code: string;
  type: string;
  status: string;
  branchId: string;
  branch?: {
    id: string;
    name: string;
  };
  supplierId?: string;
  supplier?: {
    id: string;
    name: string;
  };
  purchaseOrderId?: string;
  purchaseOrder?: {
    id: string;
    code: string;
  };
  stockLocationId?: string;
  stockLocation?: {
    id: string;
    name: string;
  };
  totalQuantity: number;
  totalAmount: number;
  receiptDate: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryReceiptsParams {
  search?: string;
  type?: string;
  status?: string;
  branchId?: string;
  supplierId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Request-level cache for inventory receipts
export const getInventoryReceipts = cache(async (params: InventoryReceiptsParams = {}) => {
  return fetchInventoryReceiptsWithCache(params);
});

// Time-based cache for inventory receipts list
const fetchInventoryReceiptsWithCache = unstable_cache(
  async (params: InventoryReceiptsParams) => {
    const { search, type, status, branchId, supplierId, startDate, endDate, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.code = { contains: search, mode: 'insensitive' };
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

    if (supplierId) {
      where.supplierId = supplierId;
    }

    if (startDate || endDate) {
      const dateFilter: { gte?: Date; lte?: Date } = {};
      if (startDate) dateFilter.gte = new Date(startDate);
      if (endDate) dateFilter.lte = new Date(endDate);
      where.receiptDate = dateFilter;
    }

    const [items, total] = await Promise.all([
      prisma.inventoryReceipt.findMany({
        where,
        include: {
          // supplier: { select: { id: true, name: true } }, // Removed: relation doesn't exist
          // stockLocation: { select: { id: true, name: true } }, // Removed: relation doesn't exist
          // purchaseOrder: { select: { id: true, code: true } }, // Removed: relation doesn't exist
        },
        orderBy: { receiptDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.inventoryReceipt.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
  [CACHE_TAGS.INVENTORY_RECEIPTS],
  { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.INVENTORY_RECEIPTS] }
);

// Get single inventory receipt by ID
export const getInventoryReceiptById = cache(async (id: string) => {
  return fetchInventoryReceiptByIdWithCache(id);
});

const fetchInventoryReceiptByIdWithCache = unstable_cache(
  async (id: string) => {
    return prisma.inventoryReceipt.findUnique({
      where: { id },
      include: {
        // supplier: true, // Removed: relation doesn't exist
        // stockLocation: true, // Removed: relation doesn't exist
        // purchaseOrder: true, // Removed: relation doesn't exist
        items: true,
        // createdBy: { select: { id: true, name: true } }, // Removed: relation doesn't exist
      },
    });
  },
  [CACHE_TAGS.INVENTORY_RECEIPTS],
  { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.INVENTORY_RECEIPTS] }
);
