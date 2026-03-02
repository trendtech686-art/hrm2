/**
 * Departments Data Fetcher (Server-side with caching)
 * 
 * Schema: Department
 * Fields: systemId, id, name, description, managerId, parentId, isDeleted
 * Relations: parent, children, employees
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';
import type { PaginatedResult } from './orders';

export interface DepartmentFilters {
  page?: number;
  limit?: number;
  search?: string;
  parentId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DepartmentListItem {
  systemId: string;
  id: string;
  name: string;
  description: string | null;
  parentName: string | null;
  managerId: string | null;
  employeeCount: number;
}

function buildDepartmentWhereClause(filters: DepartmentFilters) {
  const where: Record<string, unknown> = {
    isDeleted: false,
  };

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { id: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.parentId) where.parentId = filters.parentId;

  return where;
}

async function fetchDepartments(filters: DepartmentFilters): Promise<PaginatedResult<DepartmentListItem>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where = buildDepartmentWhereClause(filters);
  const orderBy: Record<string, 'asc' | 'desc'> = {};
  orderBy[filters.sortBy || 'name'] = filters.sortOrder || 'asc';

  const [data, total] = await Promise.all([
    prisma.department.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        systemId: true,
        id: true,
        name: true,
        description: true,
        managerId: true,
        parentId: true,
        parent: { select: { name: true } },
        _count: { select: { employees: true } },
      },
    }),
    prisma.department.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(d => ({
      systemId: d.systemId,
      id: d.id,
      name: d.name,
      description: d.description,
      parentName: d.parent?.name || null,
      managerId: d.managerId,
      employeeCount: d._count.employees,
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

export const getDepartments = cache(async (filters: DepartmentFilters = {}) => {
  const cacheKey = `departments-${JSON.stringify(filters)}`;
  
  return unstable_cache(
    () => fetchDepartments(filters),
    [cacheKey],
    { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.SETTINGS] }
  )();
});

export const getDepartmentById = cache(async (systemId: string) => {
  return unstable_cache(
    async () => {
      return prisma.department.findUnique({
        where: { systemId },
        include: {
          parent: true,
          children: true,
          employees: {
            where: { isDeleted: false },
            select: {
              systemId: true,
              id: true,
              fullName: true,
              role: true,
            },
          },
        },
      });
    },
    [`department-${systemId}`],
    { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.SETTINGS] }
  )();
});

/**
 * Get departments for select (dropdown)
 */
export const getDepartmentsForSelect = unstable_cache(
  async () => {
    return prisma.department.findMany({
      where: { isDeleted: false },
      orderBy: { name: 'asc' },
      select: {
        systemId: true,
        id: true,
        name: true,
        parentId: true,
        _count: { select: { employees: true } },
      },
    });
  },
  ['departments-for-select'],
  { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.SETTINGS] }
);

/**
 * Get department hierarchy (tree structure)
 */
export async function getDepartmentTree() {
  const departments = await prisma.department.findMany({
    where: { isDeleted: false },
    include: {
      _count: { select: { employees: true } },
    },
    orderBy: { name: 'asc' },
  });

  // Build tree structure
  const rootDepartments = departments.filter(d => !d.parentId);
  const childMap = new Map<string, typeof departments>();
  
  departments.forEach(d => {
    if (d.parentId) {
      const children = childMap.get(d.parentId) || [];
      children.push(d);
      childMap.set(d.parentId, children);
    }
  });

  interface DepartmentNode {
    systemId: string;
    id: string;
    name: string;
    employeeCount: number;
    children: DepartmentNode[];
  }

  function buildNode(dept: typeof departments[0]): DepartmentNode {
    return {
      systemId: dept.systemId,
      id: dept.id,
      name: dept.name,
      employeeCount: dept._count.employees,
      children: (childMap.get(dept.systemId) || []).map(buildNode),
    };
  }

  return rootDepartments.map(buildNode);
}
