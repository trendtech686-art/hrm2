/**
 * Complaints Data Fetcher (Server-side with caching)
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';
import type { PaginatedResult } from './orders';

// Helper to build cache key from filters
function buildComplaintCacheKey(prefix: string, filters: ComplaintFilters): string {
  const sortedEntries = Object.entries(filters)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .sort(([a], [b]) => a.localeCompare(b));
  return `${prefix}:${JSON.stringify(sortedEntries)}`;
}

export interface ComplaintFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  branchId?: string;
  customerId?: string;
  assigneeId?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ComplaintListItem {
  systemId: string;
  id: string;
  customerName: string | null;
  customerPhone: string | null;
  title: string;
  status: string;
  priority: string;
  branchName: string | null;
  assigneeName: string | null;
  createdAt: Date;
  resolvedAt: Date | null;
}

function buildComplaintWhereClause(filters: ComplaintFilters) {
  const where: Record<string, unknown> = {};

  if (filters.search) {
    where.OR = [
      { id: { contains: filters.search, mode: 'insensitive' } },
      { title: { contains: filters.search, mode: 'insensitive' } },
      { customerName: { contains: filters.search, mode: 'insensitive' } },
      { customerPhone: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.branchId) where.branchId = filters.branchId;
  if (filters.customerId) where.customerId = filters.customerId;
  if (filters.assigneeId) where.assigneeId = filters.assigneeId;

  if (filters.startDate || filters.endDate) {
    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (filters.startDate) dateFilter.gte = new Date(filters.startDate);
    if (filters.endDate) dateFilter.lte = new Date(filters.endDate);
    where.createdAt = dateFilter;
  }

  return where;
}

async function fetchComplaints(filters: ComplaintFilters): Promise<PaginatedResult<ComplaintListItem>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where = buildComplaintWhereClause(filters);
  const orderBy: Record<string, 'asc' | 'desc'> = {};
  orderBy[filters.sortBy || 'createdAt'] = filters.sortOrder || 'desc';

  const [data, total] = await Promise.all([
    prisma.complaint.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        systemId: true,
        id: true,
        customerName: true,
        customerPhone: true,
        title: true,
        status: true,
        priority: true,
        createdAt: true,
        resolvedAt: true,
        branchName: true,
        assigneeName: true,
      },
    }),
    prisma.complaint.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(c => ({
      systemId: c.systemId,
      id: c.id,
      customerName: c.customerName,
      customerPhone: c.customerPhone,
      title: c.title,
      status: c.status,
      priority: c.priority,
      branchName: c.branchName,
      assigneeName: c.assigneeName,
      createdAt: c.createdAt,
      resolvedAt: c.resolvedAt,
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

export const getComplaints = cache(async (filters: ComplaintFilters = {}) => {
  const cacheKey = buildComplaintCacheKey('complaints', filters);
  
  return unstable_cache(
    () => fetchComplaints(filters),
    [cacheKey],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.COMPLAINTS] }
  )();
});

export const getComplaintById = cache(async (id: string) => {
  return unstable_cache(
    async () => {
      return prisma.complaint.findUnique({
        where: { systemId: id },
        include: {
          customer: true,
          employees: true,
        },
      });
    },
    [`complaint-${id}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.COMPLAINTS] }
  )();
});

export const getComplaintStats = cache(async (branchId?: string) => {
  return unstable_cache(
    async () => {
      const where: Record<string, unknown> = {};
      if (branchId) where.branchId = branchId;

      const [pending, inProgress, resolved, total] = await Promise.all([
        prisma.complaint.count({ where: { ...where, status: 'OPEN' } }),
        prisma.complaint.count({ where: { ...where, status: 'IN_PROGRESS' } }),
        prisma.complaint.count({ where: { ...where, status: 'RESOLVED' } }),
        prisma.complaint.count({ where }),
      ]);

      return { pending, inProgress, resolved, total };
    },
    [`complaint-stats-${branchId || 'all'}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.COMPLAINTS] }
  )();
});
