/**
 * Customers Data Fetcher (Server-side with caching)
 * 
 * Updated to match actual Prisma schema:
 * - Uses `currentDebt` instead of `debtAmount`
 * - Uses `isDeleted: false` instead of `isActive: true`
 * - Uses `customerGroup` (string) instead of relation
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';
import type { Prisma } from '@/generated/prisma/client';

// Types
export interface CustomerFilters {
  page?: number;
  limit?: number;
  search?: string;
  groupId?: string;
  hasDebt?: boolean;
  status?: string;
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

export interface CustomerListItem {
  systemId: string;
  name: string;
  phone: string | null;
  address: string | null;
  customerGroup: string | null;
  totalOrders: number;
  totalSpent: number;
  currentDebt: number;
  createdAt: Date;
}

/**
 * Get paginated customers list
 */
export async function getCustomers(
  filters: CustomerFilters = {}
): Promise<PaginatedResult<CustomerListItem>> {
  const { 
    page = 1, 
    limit = 50, 
    search, 
    groupId, 
    hasDebt, 
    status,
    sortBy = 'name', 
    sortOrder = 'asc' 
  } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.CustomerWhereInput = {
    isDeleted: false,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (groupId) {
    where.customerGroup = groupId;
  }

  if (status) {
    where.status = status as Prisma.EnumCustomerStatusFilter;
  }

  if (hasDebt === true) {
    where.currentDebt = { gt: 0 };
  } else if (hasDebt === false) {
    where.OR = [
      { currentDebt: { lte: 0 } },
      { currentDebt: null },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      select: {
        systemId: true,
        name: true,
        phone: true,
        address: true,
        customerGroup: true,
        totalOrders: true,
        totalSpent: true,
        currentDebt: true,
        createdAt: true,
      },
    }),
    prisma.customer.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(customer => ({
      systemId: customer.systemId,
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      customerGroup: customer.customerGroup,
      totalOrders: customer.totalOrders ?? 0,
      totalSpent: Number(customer.totalSpent ?? 0),
      currentDebt: Number(customer.currentDebt ?? 0),
      createdAt: customer.createdAt,
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
 * Get customer by systemId - Persistent cache (30s) + Request dedup
 */
const _getCustomerById = unstable_cache(
  async (systemId: string) => {
    return prisma.customer.findUnique({
      where: { systemId },
      select: {
        systemId: true,
        id: true,
        name: true,
        phone: true,
        address: true,
        ward: true,
        district: true,
        province: true,
        customerGroup: true,
        currentDebt: true,
        totalSpent: true,
        totalOrders: true,
        notes: true,
        tags: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
      },
    });
  },
  ['customer-by-id'],
  { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.CUSTOMERS] }
);
export const getCustomerById = cache((systemId: string) => _getCustomerById(systemId));

/**
 * Get customer groups from settings - CACHED (10 min)
 */
export const getCustomerGroups = unstable_cache(
  async () => {
    // Customer groups are stored in CustomerSetting
    const settings = await prisma.customerSetting.findMany({
      where: { 
        isActive: true,
        type: 'CUSTOMER_GROUP',
      },
      orderBy: { name: 'asc' },
      select: {
        systemId: true,
        id: true,
        name: true,
        color: true,
        metadata: true,
      },
    });
    
    return settings.map(s => ({
      systemId: s.systemId,
      id: s.id,
      name: s.name,
      color: s.color,
    }));
  },
  ['customer-groups'],
  { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.CUSTOMERS] }
);

/**
 * Get customers with high debt - CACHED (1 min)
 */
export const getCustomersWithHighDebt = unstable_cache(
  async (limit = 10) => {
    const customers = await prisma.customer.findMany({
      where: {
        isDeleted: false,
        currentDebt: { gt: 0 },
      },
      orderBy: { currentDebt: 'desc' },
      take: limit,
      select: {
        systemId: true,
        name: true,
        phone: true,
        currentDebt: true,
      },
    });
    
    return customers.map(c => ({
      ...c,
      currentDebt: Number(c.currentDebt ?? 0),
    }));
  },
  ['customers-high-debt'],
  { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.CUSTOMERS] }
);

/**
 * Get customer statistics - CACHED (1 min)
 */
export const getCustomerStats = unstable_cache(
  async () => {
    const [total, withDebt, totalDebt, newThisMonth] = await Promise.all([
      prisma.customer.count({ where: { isDeleted: false } }),
      prisma.customer.count({ 
        where: { isDeleted: false, currentDebt: { not: 0 } } 
      }),
      prisma.customer.aggregate({
        where: { isDeleted: false },
        _sum: { currentDebt: true },
      }),
      prisma.customer.count({
        where: {
          isDeleted: false,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    return {
      totalCustomers: total,
      customersWithDebt: withDebt,
      totalDebtAmount: Number(totalDebt._sum?.currentDebt ?? 0),
      newCustomersThisMonth: newThisMonth,
    };
  },
  ['customer-stats'],
  { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.CUSTOMERS] }
);

/**
 * Search customers - for autocomplete
 */
export async function searchCustomers(query: string, limit = 10) {
  if (!query || query.length < 2) return [];

  return prisma.customer.findMany({
    where: {
      isDeleted: false,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { phone: { contains: query, mode: 'insensitive' } },
      ],
    },
    take: limit,
    select: {
      systemId: true,
      name: true,
      phone: true,
      address: true,
    },
  });
}
