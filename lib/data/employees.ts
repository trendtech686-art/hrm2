/**
 * Employees Data Fetcher (Server-side with caching)
 * 
 * Schema: Employee
 * Fields: systemId, id, fullName, workEmail, personalEmail, phone, branchId, departmentId,
 *         role, employmentStatus, startDate, avatar, hireDate
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';
import type { PaginatedResult } from './orders';

export interface EmployeeFilters {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  branchId?: string;
  employmentStatus?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EmployeeListItem {
  systemId: string;
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  departmentName: string | null;
  branchName: string | null;
  role: string;
  employmentStatus: string;
  startDate: Date | null;
  avatar: string | null;
}

function buildEmployeeWhereClause(filters: EmployeeFilters) {
  const where: Record<string, unknown> = {
    isDeleted: false,
  };

  if (filters.search) {
    where.OR = [
      { fullName: { contains: filters.search, mode: 'insensitive' } },
      { workEmail: { contains: filters.search, mode: 'insensitive' } },
      { phone: { contains: filters.search, mode: 'insensitive' } },
      { id: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.departmentId) where.departmentId = filters.departmentId;
  if (filters.branchId) where.branchId = filters.branchId;
  if (filters.employmentStatus) where.employmentStatus = filters.employmentStatus;

  return where;
}

async function fetchEmployees(filters: EmployeeFilters): Promise<PaginatedResult<EmployeeListItem>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where = buildEmployeeWhereClause(filters);
  const orderBy: Record<string, 'asc' | 'desc'> = {};
  orderBy[filters.sortBy || 'fullName'] = filters.sortOrder || 'asc';

  const [data, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        systemId: true,
        id: true,
        fullName: true,
        workEmail: true,
        phone: true,
        role: true,
        employmentStatus: true,
        startDate: true,
        avatar: true,
        department: { select: { name: true } },
        branch: { select: { name: true } },
      },
    }),
    prisma.employee.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(e => ({
      systemId: e.systemId,
      id: e.id,
      fullName: e.fullName,
      email: e.workEmail,
      phone: e.phone,
      departmentName: e.department?.name || null,
      branchName: e.branch?.name || null,
      role: e.role,
      employmentStatus: e.employmentStatus,
      startDate: e.startDate,
      avatar: e.avatar,
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

export const getEmployees = cache(async (filters: EmployeeFilters = {}) => {
  const cacheKey = `employees-${JSON.stringify(filters)}`;
  
  return unstable_cache(
    () => fetchEmployees(filters),
    [cacheKey],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.USERS] }
  )();
});

export const getEmployeeById = cache(async (systemId: string) => {
  return unstable_cache(
    async () => {
      return prisma.employee.findUnique({
        where: { systemId },
        include: {
          department: true,
          branch: true,
          jobTitle: true,
          manager: { select: { systemId: true, fullName: true } },
        },
      });
    },
    [`employee-${systemId}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.USERS] }
  )();
});

/**
 * Get employees for select (dropdown)
 */
export const getEmployeesForSelect = unstable_cache(
  async (branchId?: string) => {
    return prisma.employee.findMany({
      where: {
        isDeleted: false,
        employmentStatus: 'ACTIVE',
        ...(branchId && { branchId }),
      },
      orderBy: { fullName: 'asc' },
      select: {
        systemId: true,
        id: true,
        fullName: true,
        role: true,
        branchId: true,
      },
    });
  },
  ['employees-for-select'],
  { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.USERS] }
);

/**
 * Get employees count by status
 */
export async function getEmployeeCountByStatus() {
  const counts = await prisma.employee.groupBy({
    by: ['employmentStatus'],
    where: { isDeleted: false },
    _count: true,
  });

  return counts.reduce((acc, c) => {
    acc[c.employmentStatus] = c._count;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Get employee statistics for dashboard
 */
export const getEmployeeStats = cache(async () => {
  return unstable_cache(
    async () => {
      const [total, active, onLeave, resigned, deleted] = await Promise.all([
        prisma.employee.count({ where: { isDeleted: false } }),
        prisma.employee.count({ where: { isDeleted: false, employmentStatus: 'ACTIVE' } }),
        prisma.employee.count({ where: { isDeleted: false, employmentStatus: 'ON_LEAVE' } }),
        prisma.employee.count({ where: { isDeleted: false, employmentStatus: 'TERMINATED' } }),
        prisma.employee.count({ where: { isDeleted: true, permanentlyDeletedAt: null } }),
      ]);

      return { total, active, onLeave, resigned, deleted };
    },
    ['employee-stats'],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.USERS] }
  )();
});
