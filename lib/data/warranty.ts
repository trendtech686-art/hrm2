/**
 * Warranty Data Fetcher (Server-side with caching)
 * 
 * Schema: Warranty
 * Fields: systemId, id, customerName, customerPhone, productName, serialNumber,
 *         status, priority, branchId, branchName, assigneeId, employeeName,
 *         receivedAt, startedAt, completedAt, returnedAt, issueDescription
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';
import type { PaginatedResult } from './orders';

export interface WarrantyFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  branchId?: string;
  customerId?: string;
  productId?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface WarrantyListItem {
  systemId: string;
  id: string;
  customerName: string;
  customerPhone: string | null;
  productName: string;
  serialNumber: string | null;
  status: string;
  priority: string;
  issueDescription: string | null;
  branchName: string | null;
  employeeName: string | null;
  receivedAt: Date;
  completedAt: Date | null;
}

function buildWarrantyWhereClause(filters: WarrantyFilters) {
  const where: Record<string, unknown> = {
    isDeleted: false,
  };

  if (filters.search) {
    where.OR = [
      { id: { contains: filters.search, mode: 'insensitive' } },
      { customerName: { contains: filters.search, mode: 'insensitive' } },
      { customerPhone: { contains: filters.search, mode: 'insensitive' } },
      { serialNumber: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.status) where.status = filters.status;
  if (filters.branchId) where.branchId = filters.branchId;
  if (filters.customerId) where.customerId = filters.customerId;
  if (filters.productId) where.productId = filters.productId;

  if (filters.startDate || filters.endDate) {
    where.receivedAt = {};
    if (filters.startDate) (where.receivedAt as Record<string, unknown>).gte = new Date(String(filters.startDate));
    if (filters.endDate) (where.receivedAt as Record<string, unknown>).lte = new Date(String(filters.endDate));
  }

  return where;
}

async function fetchWarranties(filters: WarrantyFilters): Promise<PaginatedResult<WarrantyListItem>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where = buildWarrantyWhereClause(filters);
  const orderBy: Record<string, 'asc' | 'desc'> = {};
  orderBy[filters.sortBy || 'receivedAt'] = filters.sortOrder || 'desc';

  const [data, total] = await Promise.all([
    prisma.warranty.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        systemId: true,
        id: true,
        customerName: true,
        customerPhone: true,
        productName: true,
        serialNumber: true,
        status: true,
        priority: true,
        issueDescription: true,
        branchName: true,
        employeeName: true,
        receivedAt: true,
        completedAt: true,
      },
    }),
    prisma.warranty.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(w => ({
      systemId: w.systemId,
      id: w.id,
      customerName: w.customerName,
      customerPhone: w.customerPhone,
      productName: w.productName,
      serialNumber: w.serialNumber,
      status: w.status,
      priority: w.priority,
      issueDescription: w.issueDescription,
      branchName: w.branchName,
      employeeName: w.employeeName,
      receivedAt: w.receivedAt,
      completedAt: w.completedAt,
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

export const getWarranties = cache(async (filters: WarrantyFilters = {}) => {
  const cacheKey = `warranties-${JSON.stringify(filters)}`;
  
  return unstable_cache(
    () => fetchWarranties(filters),
    [cacheKey],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.WARRANTY] }
  )();
});

export const getWarrantyById = cache(async (systemId: string) => {
  return unstable_cache(
    async () => {
      return prisma.warranty.findUnique({
        where: { systemId },
        include: {
          product: true,
          customers: true,
          order: true,
        },
      });
    },
    [`warranty-${systemId}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.WARRANTY] }
  )();
});

/**
 * Get warranties due for follow-up (approaching deadline)
 */
export async function getWarrantiesDueForFollowUp(daysThreshold = 2) {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

  return prisma.warranty.findMany({
    where: {
      isDeleted: false,
      status: { in: ['RECEIVED', 'PROCESSING', 'WAITING_PARTS'] },
      completedAt: null,
    },
    select: {
      systemId: true,
      id: true,
      customerName: true,
      customerPhone: true,
      productName: true,
      status: true,
      receivedAt: true,
      branchName: true,
    },
    orderBy: { receivedAt: 'asc' },
    take: 50,
  });
}

/**
 * Get warranty count by status
 */
export async function getWarrantyCountByStatus() {
  const counts = await prisma.warranty.groupBy({
    by: ['status'],
    where: { isDeleted: false },
    _count: true,
  });

  return counts.reduce((acc, c) => {
    acc[c.status] = c._count;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Get warranty statistics for dashboard
 */
export const getWarrantyStats = cache(async (branchId?: string) => {
  return unstable_cache(
    async () => {
      const where: { isDeleted: boolean; branchId?: string } = { isDeleted: false };
      if (branchId) where.branchId = branchId;

      const [total, pending, processed, completed] = await Promise.all([
        prisma.warranty.count({ where }),
        prisma.warranty.count({ where: { ...where, status: 'RECEIVED' } }),
        prisma.warranty.count({ where: { ...where, status: 'PROCESSING' } }),
        prisma.warranty.count({ where: { ...where, status: 'COMPLETED' } }),
      ]);

      return { total, pending, processed, completed };
    },
    [`warranty-stats-${branchId || 'all'}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.WARRANTY] }
  )();
});
