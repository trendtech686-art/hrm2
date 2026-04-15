'use server';

import prisma from '@/lib/prisma';
import type { StockHistoryEntry, StockHistoryAction } from '@/lib/types/prisma-extended';
import { generateIdWithPrefix } from '@/lib/id-generator';
import { logError } from '@/lib/logger'
import { requireActionPermission } from '@/lib/api-utils'

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface StockHistoryFilters {
  page?: number;
  limit?: number;
  productId?: string;
  branchSystemId?: string;
  action?: StockHistoryAction | string;
  fromDate?: string;
  toDate?: string;
  documentId?: string;
}

export interface StockHistoryResponse {
  data: StockHistoryEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StockHistoryCreateInput {
  productId: string;
  branchId: string;
  action: StockHistoryAction | string;
  source?: string;
  quantityChange: number;
  newStockLevel: number;
  documentId?: string;
  documentType?: string;
  employeeName?: string;
  note?: string;
}

/**
 * Fetch stock history with filters
 */
export async function getStockHistory(
  filters: StockHistoryFilters = {}
): Promise<ActionResult<StockHistoryResponse>> {
  const authResult = await requireActionPermission('view_inventory')
  if (!authResult.success) return authResult

  try {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (filters.productId) where.productId = filters.productId;
    if (filters.branchSystemId) where.branchId = filters.branchSystemId;
    if (filters.action) where.action = filters.action;
    if (filters.documentId) where.documentId = filters.documentId;

    if (filters.fromDate || filters.toDate) {
      where.createdAt = {};
      if (filters.fromDate) (where.createdAt as Record<string, unknown>).gte = new Date(filters.fromDate);
      if (filters.toDate) (where.createdAt as Record<string, unknown>).lte = new Date(filters.toDate);
    }

    const [data, total] = await Promise.all([
      prisma.stockHistory.findMany({
        where,
        include: {
          product: { select: { name: true, id: true } },
          branch: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.stockHistory.count({ where }),
    ]);

    return {
      success: true,
      data: {
        data: data as unknown as StockHistoryEntry[],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    logError('Failed to fetch stock history', error);
    return { success: false, error: 'Không thể tải lịch sử tồn kho' };
  }
}

/**
 * Fetch stock history for a specific product
 */
export async function getProductStockHistory(
  productId: string,
  options?: { limit?: number; fromDate?: string; toDate?: string }
): Promise<ActionResult<StockHistoryEntry[]>> {
  try {
    const authResult = await requireActionPermission('view_inventory')
    if (!authResult.success) return authResult

    const result = await getStockHistory({
      productId,
      limit: options?.limit || 100,
      fromDate: options?.fromDate,
      toDate: options?.toDate,
    });

    if (!result.success) return { success: false, error: result.error };
    return { success: true, data: result.data.data };
  } catch (error) {
    logError('Failed to fetch product stock history', error);
    return { success: false, error: 'Không thể tải lịch sử tồn kho sản phẩm' };
  }
}

/**
 * Create stock history entry
 */
export async function createStockHistory(
  data: StockHistoryCreateInput
): Promise<ActionResult<StockHistoryEntry>> {
  const authResult = await requireActionPermission('edit_inventory')
  if (!authResult.success) return authResult

  try {
    const systemId = await generateIdWithPrefix('SH', prisma);
    const entry = await prisma.stockHistory.create({
      data: {
        systemId,
        productId: data.productId,
        branchId: data.branchId,
        action: data.action,
        source: data.source,
        quantityChange: data.quantityChange,
        newStockLevel: data.newStockLevel,
        documentId: data.documentId,
        documentType: data.documentType,
        employeeName: data.employeeName,
        note: data.note,
      },
    });

    return { success: true, data: entry as unknown as StockHistoryEntry };
  } catch (error) {
    logError('Failed to create stock history', error);
    return { success: false, error: 'Không thể tạo lịch sử tồn kho' };
  }
}

/**
 * Get stock movement summary for a product
 */
export async function getStockMovementSummary(
  productId: string,
  period?: { fromDate: string; toDate: string }
): Promise<
  ActionResult<{
    inbound: number;
    outbound: number;
    netChange: number;
    transactions: number;
  }>
> {
  const authResult = await requireActionPermission('view_inventory')
  if (!authResult.success) return authResult

  try {
    const where: Record<string, unknown> = {
      productId: productId,
    };

    if (period) {
      where.createdAt = {
        gte: new Date(period.fromDate),
        lte: new Date(period.toDate),
      };
    }

    const histories = await prisma.stockHistory.findMany({
      where,
      select: {
        quantityChange: true,
        action: true,
      },
    });

    let inbound = 0;
    let outbound = 0;

    histories.forEach((h) => {
      if (h.quantityChange > 0) {
        inbound += h.quantityChange;
      } else {
        outbound += Math.abs(h.quantityChange);
      }
    });

    return {
      success: true,
      data: {
        inbound,
        outbound,
        netChange: inbound - outbound,
        transactions: histories.length,
      },
    };
  } catch (error) {
    logError('Failed to fetch stock movement summary', error);
    return { success: false, error: 'Không thể tải tổng hợp xuất nhập kho' };
  }
}

/**
 * Get stock history by document
 */
export async function getStockHistoryByDocument(
  documentId: string,
  documentType?: string
): Promise<ActionResult<StockHistoryEntry[]>> {
  const authResult = await requireActionPermission('view_inventory')
  if (!authResult.success) return authResult

  try {
    const where: Record<string, unknown> = { documentId };
    if (documentType) where.documentType = documentType;

    const data = await prisma.stockHistory.findMany({
      where,
      include: {
        product: { select: { name: true, id: true } },
        branch: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: data as unknown as StockHistoryEntry[] };
  } catch (error) {
    logError('Failed to fetch stock history by document', error);
    return { success: false, error: 'Không thể tải lịch sử tồn kho theo chứng từ' };
  }
}

/**
 * Get recent stock activities
 */
export async function getRecentStockActivities(
  limit: number = 20
): Promise<ActionResult<StockHistoryEntry[]>> {
  const authResult = await requireActionPermission('view_inventory')
  if (!authResult.success) return authResult

  try {
    const data = await prisma.stockHistory.findMany({
      include: {
        product: { select: { name: true, id: true } },
        branch: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return { success: true, data: data as unknown as StockHistoryEntry[] };
  } catch (error) {
    logError('Failed to fetch recent stock activities', error);
    return { success: false, error: 'Không thể tải hoạt động kho gần đây' };
  }
}
