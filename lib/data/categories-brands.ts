/**
 * Categories & Brands Data Fetcher (Server-side with caching)
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';
import type { PaginatedResult } from './orders';

// ============= CATEGORIES =============

export interface CategoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  parentId?: string | null;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CategoryListItem {
  systemId: string;
  id: string;
  name: string;
  slug: string | null;
  parentName: string | null;
  productCount: number;
  isActive: boolean;
  sortOrder: number | null;
}

async function fetchCategories(filters: CategoryFilters): Promise<PaginatedResult<CategoryListItem>> {
  const page = filters.page || 1;
  const limit = filters.limit || 50;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (filters.search) {
    where.name = { contains: filters.search, mode: 'insensitive' };
  }
  if (filters.parentId !== undefined) {
    where.parentId = filters.parentId;
  }
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  const orderBy: Record<string, 'asc' | 'desc'> = {};
  orderBy[filters.sortBy || 'sortOrder'] = filters.sortOrder || 'asc';

  const [data, total] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        parent: { select: { name: true } },
        _count: { select: { productCategories: true } },
      },
    }),
    prisma.category.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(c => ({
      systemId: c.systemId,
      id: c.id,
      name: c.name,
      slug: c.slug,
      parentName: c.parent?.name || null,
      productCount: c._count.productCategories,
      isActive: c.isActive,
      sortOrder: c.sortOrder,
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

export const getCategoriesPage = cache(async (filters: CategoryFilters = {}) => {
  const cacheKey = `categories-page:${JSON.stringify(filters)}`;
  
  return unstable_cache(
    () => fetchCategories(filters),
    [cacheKey],
    { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.CATEGORIES] }
  )();
});

export const getCategoryTree = cache(async () => {
  return unstable_cache(
    async () => {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        select: {
          systemId: true,
          id: true,
          name: true,
          slug: true,
          parentId: true,
          sortOrder: true,
          _count: { select: { productCategories: true } },
        },
        orderBy: { sortOrder: 'asc' },
      });

      // Build tree structure
      const rootCategories = categories.filter(c => !c.parentId);
      const childMap = new Map<string, typeof categories>();
      
      categories.forEach(c => {
        if (c.parentId) {
          const children = childMap.get(c.parentId) || [];
          children.push(c);
          childMap.set(c.parentId, children);
        }
      });

      return rootCategories.map(root => ({
        ...root,
        productCount: root._count.productCategories,
        children: (childMap.get(root.systemId) || []).map(child => ({
          ...child,
          productCount: child._count.productCategories,
        })),
      }));
    },
    ['category-tree'],
    { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.CATEGORIES] }
  )();
});

// ============= BRANDS =============

export interface BrandFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BrandListItem {
  systemId: string;
  id: string;
  name: string;
  logo: string | null;
  logoUrl: string | null;
  productCount: number;
  isActive: boolean;
}

async function fetchBrands(filters: BrandFilters): Promise<PaginatedResult<BrandListItem>> {
  const page = filters.page || 1;
  const limit = filters.limit || 50;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (filters.search) {
    where.name = { contains: filters.search, mode: 'insensitive' };
  }
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  const orderBy: Record<string, 'asc' | 'desc'> = {};
  orderBy[filters.sortBy || 'name'] = filters.sortOrder || 'asc';

  const [data, total] = await Promise.all([
    prisma.brand.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        systemId: true,
        id: true,
        name: true,
        logo: true,
        logoUrl: true,
        isActive: true,
        _count: { select: { products: true } },
      },
    }),
    prisma.brand.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(b => ({
      systemId: b.systemId,
      id: b.id,
      name: b.name,
      logo: b.logo,
      logoUrl: b.logoUrl,
      productCount: b._count.products,
      isActive: b.isActive,
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

export const getBrandsPage = cache(async (filters: BrandFilters = {}) => {
  const cacheKey = `brands-page:${JSON.stringify(filters)}`;
  
  return unstable_cache(
    () => fetchBrands(filters),
    [cacheKey],
    { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.BRANDS] }
  )();
});
