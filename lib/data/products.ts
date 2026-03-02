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
import type { ProductStatus, ProductType } from '@prisma/client';

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
 * Get product by systemId - Request memoized
 */
export const getProductById = cache(async (systemId: string) => {
  return prisma.product.findUnique({
    where: { systemId },
    include: {
      brand: true,
      prices: true,
    },
  });
});

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
    const [totalProducts, activeProducts, outOfStockCount, lowStockCount, totalValueResult, deletedCount] = await Promise.all([
      prisma.product.count({ where: { isDeleted: false } }),
      prisma.product.count({ where: { isDeleted: false, status: 'ACTIVE' } }),
      prisma.product.count({ where: { isDeleted: false, type: { not: 'COMBO' }, totalInventory: { lte: 0 } } }),
      prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*)::bigint as count FROM products
        WHERE "isDeleted" = false AND type != 'COMBO'
          AND "reorderLevel" IS NOT NULL AND "totalInventory" > 0
          AND "totalInventory" <= "reorderLevel"
      `.then(r => Number(r[0]?.count ?? 0)),
      prisma.$queryRaw<[{ total: number | null }]>`
        SELECT COALESCE(SUM("costPrice" * "totalInventory"), 0)::float as total
        FROM products WHERE "isDeleted" = false AND type != 'COMBO'
      `.then(r => r[0]?.total ?? 0),
      prisma.product.count({ where: { isDeleted: true } }),
    ]);

    return { totalProducts, activeProducts, outOfStock: outOfStockCount, lowStock: lowStockCount, totalValue: totalValueResult, deletedCount };
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
