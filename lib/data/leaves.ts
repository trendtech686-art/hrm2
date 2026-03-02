/**
 * Leave Data Fetcher (Server-side with caching)
 * 
 * Schema: Leave
 * Fields: employeeId, leaveType, startDate, endDate, totalDays, numberOfDays,
 *         reason, status, approvedBy, approvedAt, employeeName, leaveTypeName
 */

import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';
import type { PaginatedResult } from './orders';

export interface LeaveFilters {
  page?: number;
  limit?: number;
  search?: string;
  employeeId?: string;
  leaveType?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LeaveListItem {
  systemId: string;
  id: string;
  employeeId: string | null;
  employeeName: string | null;
  leaveTypeName: string | null;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string | null;
  status: string;
  approvedBy: string | null;
  approvedAt: Date | null;
}

function buildLeaveWhereClause(filters: LeaveFilters) {
  const where: Record<string, unknown> = {};

  if (filters.search) {
    where.OR = [
      { employeeName: { contains: filters.search, mode: 'insensitive' } },
      { reason: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.employeeId) where.employeeId = filters.employeeId;
  if (filters.leaveType) where.leaveType = filters.leaveType as 'ANNUAL' | 'SICK' | 'UNPAID' | 'MATERNITY' | 'PATERNITY' | 'OTHER';
  if (filters.status) where.status = filters.status;
  
  if (filters.startDate || filters.endDate) {
    where.startDate = {};
    if (filters.startDate) (where.startDate as Record<string, unknown>).gte = filters.startDate;
    if (filters.endDate) (where.startDate as Record<string, unknown>).lte = filters.endDate;
  }

  return where;
}

async function fetchLeaves(filters: LeaveFilters): Promise<PaginatedResult<LeaveListItem>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where = buildLeaveWhereClause(filters);
  
  const orderBy: Record<string, 'asc' | 'desc'>[] = [
    { startDate: 'desc' },
  ];
  if (filters.sortBy) {
    orderBy.unshift({ [filters.sortBy]: filters.sortOrder || 'desc' });
  }

  const [data, total] = await Promise.all([
    prisma.leave.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        systemId: true,
        id: true,
        employeeId: true,
        employeeName: true,
        leaveTypeName: true,
        startDate: true,
        endDate: true,
        totalDays: true,
        reason: true,
        status: true,
        approvedBy: true,
        approvedAt: true,
      },
    }),
    prisma.leave.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(l => ({
      systemId: l.systemId,
      id: l.id,
      employeeId: l.employeeId,
      employeeName: l.employeeName,
      leaveTypeName: l.leaveTypeName,
      startDate: l.startDate,
      endDate: l.endDate,
      totalDays: Number(l.totalDays),
      reason: l.reason,
      status: l.status,
      approvedBy: l.approvedBy,
      approvedAt: l.approvedAt,
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

export const getLeaves = unstable_cache(
  fetchLeaves,
  ['leaves'],
  { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.LEAVES] }
);

export async function getLeaveSummaryByType(employeeId?: string) {
  const where: Record<string, unknown> = {
    status: 'APPROVED',
  };
  if (employeeId) where.employeeId = employeeId;

  const result = await prisma.leave.groupBy({
    by: ['leaveType'],
    where,
    _sum: { totalDays: true },
    _count: true,
  });

  return result.map(r => ({
    leaveType: r.leaveType,
    totalDays: Number(r._sum?.totalDays ?? 0),
    count: r._count,
  }));
}

export async function getLeaveBalance(employeeId: string, leaveType: string, year: number) {
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);

  const usedDays = await prisma.leave.aggregate({
    where: {
      employeeId,
      leaveType: leaveType as 'ANNUAL' | 'SICK' | 'UNPAID' | 'MATERNITY' | 'PATERNITY' | 'OTHER',
      status: 'APPROVED',
      startDate: { gte: startOfYear, lte: endOfYear },
    },
    _sum: { totalDays: true },
  });

  return {
    used: Number(usedDays._sum?.totalDays ?? 0),
    // Note: entitlement would need to come from employee settings
  };
}
