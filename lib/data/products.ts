/**
 * Products Data Fetcher (Server-side with caching)
 * 
 * Use in Server Components for initial data
 * Supports server-side pagination, filtering, and caching
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';
import type { ProductStatus, ProductType } from '@/generated/prisma/client';

// Types
export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProductStatus;
  type?: ProductType;
  brandId?: string;
  categorySystemId?: string;
  branchId?: string;
  hasStock?: boolean;
  lowStock?: boolean;
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

export interface ProductListItem {
  systemId: string;
  id: string;
  name: string;
  thumbnailImage: string | null;
  type: ProductType;
  status: ProductStatus;
  unit: string;
  costPrice: number;
  totalInventory: number;
  totalAvailable: number;
  brandId: string | null;
  createdAt: Date;
}

import type { Prisma } from '@/generated/prisma/client';

// Build where clause from filters
function buildProductWhereClause(filters: ProductFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {
    isDeleted: false,
  };

  if (filters.search) {
    where.OR = [
      { id: { contains: filters.search, mode: 'insensitive' } },
      { name: { contains: filters.search, mode: 'insensitive' } },
      { barcode: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.brandId) {
    where.brandId = filters.brandId;
  }

  if (filters.categorySystemId) {
    where.categorySystemIds = { has: filters.categorySystemId };
  }

  if (filters.hasStock === true) {
    where.totalInventory = { gt: 0 };
  } else if (filters.hasStock === false) {
    where.totalInventory = 0;
  }

  if (filters.lowStock) {
    where.AND = [
      { reorderLevel: { not: null } },
      { totalAvailable: { lte: prisma.product.fields.reorderLevel } },
    ];
  }

  return where;
}

/**
 * Get paginated products list
 * Use this in Server Components
 */
export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResult<ProductListItem>> {
  const { page = 1, limit = 50, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
  const skip = (page - 1) * limit;

  const where = buildProductWhereClause(filters);

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      select: {
        systemId: true,
        id: true,
        name: true,
        thumbnailImage: true,
        type: true,
        status: true,
        unit: true,
        costPrice: true,
        totalInventory: true,
        totalAvailable: true,
        brandId: true,
        createdAt: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(product => ({
      ...product,
      costPrice: Number(product.costPrice),
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

/**
 * Get product by systemId - Persistent cache (30s) + Request dedup
 */
const _getProductById = unstable_cache(
  async (systemId: string) => {
    return prisma.product.findUnique({
      where: { systemId },
      include: {
        brand: true,
        prices: true,
      },
    });
  },
  ['product-by-id'],
  { revalidate: CACHE_TTL.SHORT / 1000, tags: [CACHE_TAGS.PRODUCTS] }
);
export const getProductById = cache((systemId: string) => _getProductById(systemId));

/**
 * Get products for dropdown/select - CACHED (5 min)
 */
export const getProductsForSelect = unstable_cache(
  async (branchId?: string) => {
    return prisma.product.findMany({
      where: {
        isDeleted: false,
        status: 'ACTIVE',
        ...(branchId && {
          inventory: {
            some: {
              branchId,
              onHand: { gt: 0 },
            },
          },
        }),
      },
      orderBy: { name: 'asc' },
      select: {
        systemId: true,
        id: true,
        name: true,
        unit: true,
        thumbnailImage: true,
        totalAvailable: true,
      },
    });
  },
  ['products-for-select'],
  { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.PRODUCTS] }
);

/**
 * Get products count by status - CACHED (1 min)
 */
export const getProductsCountByStatus = unstable_cache(
  async () => {
    const counts = await prisma.product.groupBy({
      by: ['status'],
      where: { isDeleted: false },
      _count: { status: true },
    });

    return counts.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {} as Record<string, number>);
  },
  ['products-count-by-status'],
  { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.PRODUCTS] }
);

/**
 * Get product stats for Server Component - CACHED (30s)
 * Returns shape matching ProductStats interface used by useProductStats hook
 */
export const getProductStats = unstable_cache(
  async () => {
    const completedStatuses = ['DELIVERED', 'COMPLETED'] as const

    const [
      totalProducts,
      stockStats,
      deletedCount,
      soldAgg,
      returnedAgg,
      orderCount,
      customerCount,
      revenueAgg,
      returnValueAgg,
    ] = await Promise.all([
      prisma.product.count({ where: { isDeleted: false } }),
      // Stock stats — computed from productInventory (source of truth)
      prisma.$queryRaw<[{ in_stock: bigint; out_of_stock: bigint; total_value: number }]>`
        SELECT
          COUNT(*) FILTER (WHERE COALESCE(pi_agg.total_on_hand, 0) > 0) as in_stock,
          COUNT(*) FILTER (WHERE COALESCE(pi_agg.total_on_hand, 0) <= 0) as out_of_stock,
          COALESCE(SUM(p."costPrice" * COALESCE(pi_agg.total_on_hand, 0)), 0)::float as total_value
        FROM products p
        LEFT JOIN (
          SELECT "productId", SUM("onHand")::int as total_on_hand
          FROM product_inventory
          GROUP BY "productId"
        ) pi_agg ON pi_agg."productId" = p."systemId"
        WHERE p."isDeleted" = false AND p.type != 'COMBO'
      `.then(r => ({
        inStock: Number(r[0]?.in_stock ?? 0),
        outOfStock: Number(r[0]?.out_of_stock ?? 0),
        totalValue: r[0]?.total_value ?? 0,
      })),
      prisma.product.count({ where: { isDeleted: true } }),
      prisma.orderLineItem.aggregate({
        _sum: { quantity: true },
        where: { order: { status: { in: [...completedStatuses] } } },
      }).then(r => r._sum.quantity ?? 0),
      prisma.salesReturnItem.aggregate({
        _sum: { quantity: true },
        where: { salesReturn: { status: 'COMPLETED' } },
      }).then(r => r._sum.quantity ?? 0),
      prisma.order.count({
        where: { status: { in: [...completedStatuses] } },
      }),
      prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(DISTINCT "customerId")::bigint as count
        FROM orders
        WHERE status IN ('DELIVERED', 'COMPLETED')
          AND "customerId" IS NOT NULL
      `.then(r => Number(r[0]?.count ?? 0)),
      prisma.order.aggregate({
        _sum: { grandTotal: true },
        where: { status: { in: [...completedStatuses] } },
      }).then(r => Number(r._sum.grandTotal ?? 0)),
      prisma.salesReturn.aggregate({
        _sum: { totalReturnValue: true },
        where: { status: 'COMPLETED' },
      }).then(r => Number(r._sum.totalReturnValue ?? 0)),
    ]);

    return {
      totalProducts,
      inStock: stockStats.inStock,
      outOfStock: stockStats.outOfStock,
      totalValue: stockStats.totalValue,
      deletedCount,
      quantitySold: soldAgg,
      quantityReturned: returnedAgg,
      netQuantitySold: Number(soldAgg) - Number(returnedAgg),
      orderCount,
      customerCount,
      revenue: revenueAgg,
      returnValue: returnValueAgg,
    };
  },
  ['products-stats'],
  { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.PRODUCTS, CACHE_TAGS.INVENTORY] }
);

/**
 * Get low stock products - CACHED (1 min)
 */
export const getLowStockProducts = unstable_cache(
  async (branchId?: string, limit = 20) => {
    // Products with totalAvailable <= reorderLevel
    const products = await prisma.$queryRaw<
      Array<{
        systemId: string;
        id: string;
        name: string;
        thumbnailImage: string | null;
        totalAvailable: number;
        reorderLevel: number;
      }>
    >`
      SELECT "systemId", id, name, "thumbnailImage", "totalAvailable", "reorderLevel"
      FROM products
      WHERE "isDeleted" = false
        AND "reorderLevel" IS NOT NULL
        AND "totalAvailable" <= "reorderLevel"
      ORDER BY ("totalAvailable" - "reorderLevel") ASC
      LIMIT ${limit}
    `;

    return products;
  },
  ['low-stock-products'],
  { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.INVENTORY] }
);

/**
 * Search products with full-text - for autocomplete
 */
export async function searchProducts(query: string, limit = 10) {
  if (!query || query.length < 2) return [];

  return prisma.product.findMany({
    where: {
      isDeleted: false,
      status: 'ACTIVE',
      OR: [
        { id: { contains: query, mode: 'insensitive' } },
        { name: { contains: query, mode: 'insensitive' } },
        { barcode: { contains: query, mode: 'insensitive' } },
      ],
    },
    take: limit,
    select: {
      systemId: true,
      id: true,
      name: true,
      thumbnailImage: true,
      unit: true,
      totalAvailable: true,
    },
  });
}
