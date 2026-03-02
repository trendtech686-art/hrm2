/**
 * Inventory Data Fetcher (Server-side with caching)
 * 
 * Use in Server Components for initial data
 * Supports server-side pagination, filtering, and caching
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';

// Types
export interface InventoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  branchId?: string;
  hasStock?: boolean;
  lowStock?: boolean;
  categorySystemId?: string;
  brandId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface InventoryListItem {
  productSystemId: string;
  productId: string;
  productName: string;
  thumbnailImage: string | null;
  unit: string;
  branchId: string;
  branchName: string;
  onHand: number;
  committed: number;
  inTransit: number;
  inDelivery: number;
  available: number;
  reorderLevel: number | null;
  costPrice: number;
  totalValue: number;
}

/**
 * Get paginated inventory list by branch
 */
export async function getInventory(
  filters: InventoryFilters = {}
): Promise<PaginatedResult<InventoryListItem>> {
  const { 
    page = 1, 
    limit = 50, 
    branchId,
    search,
    hasStock,
    lowStock,
    categorySystemId,
    brandId,
    sortBy = 'productName',
    sortOrder = 'asc'
  } = filters;
  
  const skip = (page - 1) * limit;

  // Build product where clause
  const productWhere: Record<string, unknown> = {
    isDeleted: false,
    isStockTracked: true,
  };

  if (search) {
    productWhere.OR = [
      { id: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
      { barcode: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (categorySystemId) {
    productWhere.categorySystemIds = { has: categorySystemId };
  }

  if (brandId) {
    productWhere.brandId = brandId;
  }

  // Build inventory where clause
  const inventoryWhere: Record<string, unknown> = {};
  
  if (branchId) {
    inventoryWhere.branchId = branchId;
  }

  if (hasStock === true) {
    inventoryWhere.onHand = { gt: 0 };
  } else if (hasStock === false) {
    inventoryWhere.onHand = 0;
  }

  // Query
  const [inventoryItems, total] = await Promise.all([
    prisma.productInventory.findMany({
      where: {
        ...inventoryWhere,
        product: productWhere,
      },
      skip,
      take: limit,
      include: {
        product: {
          select: {
            systemId: true,
            id: true,
            name: true,
            thumbnailImage: true,
            unit: true,
            costPrice: true,
            reorderLevel: true,
          },
        },
        branch: {
          select: {
            systemId: true,
            name: true,
          },
        },
      },
      orderBy: sortBy === 'productName' 
        ? { product: { name: sortOrder } }
        : { [sortBy]: sortOrder },
    }),
    prisma.productInventory.count({
      where: {
        ...inventoryWhere,
        product: productWhere,
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  // Transform data
  const data: InventoryListItem[] = inventoryItems.map(item => {
    const available = item.onHand - item.committed;
    const costPrice = Number(item.product.costPrice);
    
    return {
      productSystemId: item.product.systemId,
      productId: item.product.id,
      productName: item.product.name,
      thumbnailImage: item.product.thumbnailImage,
      unit: item.product.unit,
      branchId: item.branch.systemId,
      branchName: item.branch.name,
      onHand: item.onHand,
      committed: item.committed,
      inTransit: item.inTransit,
      inDelivery: item.inDelivery,
      available,
      reorderLevel: item.product.reorderLevel,
      costPrice,
      totalValue: costPrice * item.onHand,
    };
  });

  // Filter low stock after query (complex condition)
  const filteredData = lowStock
    ? data.filter(item => 
        item.reorderLevel !== null && item.available <= item.reorderLevel
      )
    : data;

  return {
    data: filteredData,
    pagination: {
      page,
      limit,
      total: lowStock ? filteredData.length : total,
      totalPages: lowStock ? Math.ceil(filteredData.length / limit) : totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * Get inventory by product and branch - Request memoized
 */
export const getProductInventory = cache(
  async (productSystemId: string, branchId?: string) => {
    return prisma.productInventory.findMany({
      where: {
        productId: productSystemId,
        ...(branchId && { branchId }),
      },
      include: {
        branch: {
          select: {
            systemId: true,
            name: true,
          },
        },
      },
    });
  }
);

/**
 * Get inventory summary by branch - CACHED (30s)
 */
export const getInventorySummary = unstable_cache(
  async (branchId?: string) => {
    const where = branchId ? { branchId } : {};

    const summary = await prisma.productInventory.aggregate({
      where,
      _sum: {
        onHand: true,
        committed: true,
        inTransit: true,
        inDelivery: true,
      },
      _count: {
        productId: true,
      },
    });

    // Calculate total value
    const totalValue = await prisma.$queryRaw<[{ total: number }]>`
      SELECT SUM(pi."onHand" * p."costPrice") as total
      FROM product_inventory pi
      JOIN "Product" p ON pi."productId" = p."systemId"
      ${branchId ? prisma.$queryRaw`WHERE pi."branchId" = ${branchId}` : prisma.$queryRaw``}
    `;

    return {
      totalProducts: summary._count.productId,
      totalOnHand: summary._sum.onHand || 0,
      totalCommitted: summary._sum.committed || 0,
      totalInTransit: summary._sum.inTransit || 0,
      totalInDelivery: summary._sum.inDelivery || 0,
      totalAvailable: (summary._sum.onHand || 0) - (summary._sum.committed || 0),
      totalValue: Number(totalValue[0]?.total || 0),
    };
  },
  ['inventory-summary'],
  { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.INVENTORY] }
);

/**
 * Get stock movements history
 */
export async function getStockHistory(
  filters: {
    page?: number;
    limit?: number;
    productSystemId?: string;
    branchId?: string;
    type?: string;
    startDate?: Date | string;
    endDate?: Date | string;
  } = {}
) {
  const { page = 1, limit = 50, productSystemId, branchId, type, startDate, endDate } = filters;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (productSystemId) {
    where.productSystemId = productSystemId;
  }

  if (branchId) {
    where.branchSystemId = branchId;
  }

  if (type) {
    where.type = type;
  }

  if (startDate || endDate) {
    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);
    where.createdAt = dateFilter;
  }

  const [data, total] = await Promise.all([
    prisma.stockHistory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        product: {
          select: {
            systemId: true,
            id: true,
            name: true,
          },
        },
        branch: {
          select: {
            systemId: true,
            name: true,
          },
        },
      },
    }),
    prisma.stockHistory.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
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

/**
 * Get inventory value by branch - CACHED (5 min)
 */
export const getInventoryValueByBranch = unstable_cache(
  async () => {
    const values = await prisma.$queryRaw<
      Array<{
        branchId: string;
        branchName: string;
        totalValue: number;
        totalProducts: number;
      }>
    >`
      SELECT 
        b."systemId" as "branchId",
        b.name as "branchName",
        COALESCE(SUM(pi."onHand" * p."costPrice"), 0) as "totalValue",
        COUNT(DISTINCT pi."productId") as "totalProducts"
      FROM "Branch" b
      LEFT JOIN product_inventory pi ON b."systemId" = pi."branchId"
      LEFT JOIN "Product" p ON pi."productId" = p."systemId"
      WHERE b."isActive" = true
      GROUP BY b."systemId", b.name
      ORDER BY "totalValue" DESC
    `;

    return values.map(v => ({
      ...v,
      totalValue: Number(v.totalValue),
      totalProducts: Number(v.totalProducts),
    }));
  },
  ['inventory-value-by-branch'],
  { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.INVENTORY] }
);
