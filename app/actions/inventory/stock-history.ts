'use server';

import prisma from '@/lib/prisma';

type StockHistory = NonNullable<Awaited<ReturnType<typeof prisma.stockHistory.findFirst>>>;

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface StockHistoryFilters {
  page?: number;
  limit?: number;
  productId?: string;
  branchId?: string;
  action?: string;
  documentType?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginatedStockHistory {
  data: StockHistory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getStockHistory(
  filters: StockHistoryFilters = {}
): Promise<ActionResult<PaginatedStockHistory>> {
  try {
    const { 
      page = 1, 
      limit = 50, 
      productId, 
      branchId, 
      action,
      documentType,
      startDate, 
      endDate 
    } = filters;

    const where: Record<string, unknown> = {};
    if (productId) where.productId = productId;
    if (branchId) where.branchId = branchId;
    if (action) where.action = action;
    if (documentType) where.documentType = documentType;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) (where.createdAt as Record<string, unknown>).gte = startDate;
      if (endDate) (where.createdAt as Record<string, unknown>).lte = endDate;
    }

    const [data, total] = await Promise.all([
      prisma.stockHistory.findMany({
        where,
        include: {
          product: {
            select: { systemId: true, name: true, id: true },
          },
          branch: {
            select: { systemId: true, name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.stockHistory.count({ where }),
    ]);

    return {
      success: true,
      data: {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error('Failed to fetch stock history:', error);
    return { success: false, error: 'Không thể tải lịch sử xuất nhập kho' };
  }
}

export async function getStockHistoryByProduct(
  productId: string,
  options: { branchId?: string; limit?: number } = {}
): Promise<ActionResult<StockHistory[]>> {
  try {
    const where: Record<string, unknown> = { productId };
    if (options.branchId) where.branchId = options.branchId;

    const history = await prisma.stockHistory.findMany({
      where,
      include: {
        branch: {
          select: { systemId: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: options.limit || 100,
    });

    return { success: true, data: history };
  } catch (error) {
    console.error('Failed to fetch stock history by product:', error);
    return { success: false, error: 'Không thể tải lịch sử xuất nhập kho' };
  }
}

export async function getStockHistoryByDocument(
  documentId: string,
  documentType?: string
): Promise<ActionResult<StockHistory[]>> {
  try {
    const where: Record<string, unknown> = { documentId };
    if (documentType) where.documentType = documentType;

    const history = await prisma.stockHistory.findMany({
      where,
      include: {
        product: {
          select: { systemId: true, name: true, id: true },
        },
        branch: {
          select: { systemId: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: history };
  } catch (error) {
    console.error('Failed to fetch stock history by document:', error);
    return { success: false, error: 'Không thể tải lịch sử xuất nhập kho' };
  }
}

export async function getStockHistoryActions(): Promise<ActionResult<string[]>> {
  try {
    const actions = await prisma.stockHistory.findMany({
      select: { action: true },
      distinct: ['action'],
      orderBy: { action: 'asc' },
    });

    return { success: true, data: actions.map((a) => a.action) };
  } catch (error) {
    console.error('Failed to fetch stock history actions:', error);
    return { success: false, error: 'Không thể tải danh sách loại thao tác' };
  }
}

export async function getStockHistorySummary(
  productId: string,
  branchId?: string
): Promise<ActionResult<{
  totalIn: number;
  totalOut: number;
  netChange: number;
  currentStock: number;
}>> {
  try {
    const where: Record<string, unknown> = { productId };
    if (branchId) where.branchId = branchId;

    const history = await prisma.stockHistory.findMany({
      where,
      select: { quantityChange: true },
    });

    const summary = history.reduce(
      (acc, h) => {
        if (h.quantityChange > 0) {
          acc.totalIn += h.quantityChange;
        } else {
          acc.totalOut += Math.abs(h.quantityChange);
        }
        acc.netChange += h.quantityChange;
        return acc;
      },
      { totalIn: 0, totalOut: 0, netChange: 0 }
    );

    // Get current stock from ProductInventory
    const inventoryWhere: Record<string, unknown> = { productId };
    if (branchId) inventoryWhere.branchId = branchId;

    const inventory = await prisma.inventory.aggregate({
      where: inventoryWhere,
      _sum: { quantity: true },
    });

    return {
      success: true,
      data: {
        ...summary,
        currentStock: inventory._sum.quantity || 0,
      },
    };
  } catch (error) {
    console.error('Failed to get stock history summary:', error);
    return { success: false, error: 'Không thể tính tổng hợp xuất nhập kho' };
  }
}

export async function getRecentStockMovements(
  branchId?: string,
  limit: number = 20
): Promise<ActionResult<StockHistory[]>> {
  try {
    const where: Record<string, unknown> = {};
    if (branchId) where.branchId = branchId;

    const history = await prisma.stockHistory.findMany({
      where,
      include: {
        product: {
          select: { systemId: true, name: true, id: true, imageUrl: true },
        },
        branch: {
          select: { systemId: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return { success: true, data: history };
  } catch (error) {
    console.error('Failed to fetch recent stock movements:', error);
    return { success: false, error: 'Không thể tải lịch sử xuất nhập kho gần đây' };
  }
}

export async function getStockHistoryStats(
  options: { branchId?: string; startDate?: Date; endDate?: Date } = {}
): Promise<ActionResult<{
  totalIn: number;
  totalOut: number;
  transactionCount: number;
  uniqueProducts: number;
}>> {
  try {
    const where: Record<string, unknown> = {};
    if (options.branchId) where.branchId = options.branchId;
    if (options.startDate || options.endDate) {
      where.createdAt = {};
      if (options.startDate) (where.createdAt as Record<string, unknown>).gte = options.startDate;
      if (options.endDate) (where.createdAt as Record<string, unknown>).lte = options.endDate;
    }

    const [stats, uniqueProducts] = await Promise.all([
      prisma.stockHistory.aggregate({
        where,
        _sum: { quantityChange: true },
        _count: true,
      }),
      prisma.stockHistory.findMany({
        where,
        select: { productId: true },
        distinct: ['productId'],
      }),
    ]);

    // Separate in and out
    const inRecords = await prisma.stockHistory.aggregate({
      where: { ...where, quantityChange: { gt: 0 } },
      _sum: { quantityChange: true },
    });

    const outRecords = await prisma.stockHistory.aggregate({
      where: { ...where, quantityChange: { lt: 0 } },
      _sum: { quantityChange: true },
    });

    return {
      success: true,
      data: {
        totalIn: inRecords._sum.quantityChange || 0,
        totalOut: Math.abs(outRecords._sum.quantityChange || 0),
        transactionCount: stats._count,
        uniqueProducts: uniqueProducts.length,
      },
    };
  } catch (error) {
    console.error('Failed to get stock history stats:', error);
    return { success: false, error: 'Không thể tải thống kê xuất nhập kho' };
  }
}
