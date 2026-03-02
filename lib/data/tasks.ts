/**
 * Tasks Data Fetcher (Server-side with caching)
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';
import type { PaginatedResult } from './orders';

export interface TaskFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  createdById?: string;
  projectId?: string;
  dueDate?: Date | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TaskListItem {
  systemId: string;
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  assigneeName: string | null;
  createdByName: string | null;
  projectName: string | null;
  createdAt: Date;
  completedAt: Date | null;
}

import type { Prisma } from '@/generated/prisma/client';
import type { TaskStatus, TaskPriority } from '@/generated/prisma/client';

function buildTaskWhereClause(filters: TaskFilters): Prisma.TaskWhereInput {
  const where: Prisma.TaskWhereInput = {};

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
      { id: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.status) where.status = filters.status as TaskStatus;
  if (filters.priority) where.priority = filters.priority as TaskPriority;
  if (filters.assigneeId) where.assigneeId = filters.assigneeId;
  if (filters.createdById) where.creatorId = filters.createdById;

  if (filters.dueDate) {
    const date = new Date(filters.dueDate);
    where.dueDate = { lte: date };
  }

  return where;
}

async function fetchTasks(filters: TaskFilters): Promise<PaginatedResult<TaskListItem>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where = buildTaskWhereClause(filters);
  const orderBy: Prisma.TaskOrderByWithRelationInput = {
    [filters.sortBy || 'createdAt']: filters.sortOrder || 'desc'
  };

  const [data, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        systemId: true,
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        createdAt: true,
        completedAt: true,
        assigneeName: true,
        createdBy: true,
        type: true,
      },
    }),
    prisma.task.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(t => ({
      systemId: t.systemId,
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate,
      assigneeName: t.assigneeName,
      createdByName: t.createdBy || null,
      projectName: t.type || null,
      createdAt: t.createdAt,
      completedAt: t.completedAt,
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

export const getTasks = cache(async (filters: TaskFilters = {}) => {
  const cacheKey = `tasks-${JSON.stringify(filters)}`;
  
  return unstable_cache(
    () => fetchTasks(filters),
    [cacheKey],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.TASKS] }
  )();
});

export const getTaskById = cache(async (id: string) => {
  return unstable_cache(
    async () => {
      return prisma.task.findUnique({
        where: { systemId: id },
        include: {
          employees_tasks_assigneeIdToemployees: true,
          employees_tasks_creatorIdToemployees: true,
        },
      });
    },
    [`task-${id}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.TASKS] }
  )();
});

export const getMyTasks = cache(async (userId: string, status?: string) => {
  return unstable_cache(
    async () => {
      const where: Prisma.TaskWhereInput = { assigneeId: userId };
      if (status) where.status = status as TaskStatus;

      return prisma.task.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' },
        ],
        take: 50,
      });
    },
    [`my-tasks-${userId}-${status || 'all'}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.TASKS] }
  )();
});

export const getTaskStats = cache(async (userId?: string) => {
  return unstable_cache(
    async () => {
      const where: Prisma.TaskWhereInput = {};
      if (userId) where.assigneeId = userId;

      const [todo, inProgress, completed, overdue] = await Promise.all([
        prisma.task.count({ where: { ...where, status: 'TODO' } }),
        prisma.task.count({ where: { ...where, status: 'IN_PROGRESS' } }),
        prisma.task.count({ where: { ...where, status: 'DONE' } }),
        prisma.task.count({
          where: {
            ...where,
            status: { not: 'DONE' },
            dueDate: { lt: new Date() },
          },
        }),
      ]);

      return { todo, inProgress, completed, overdue };
    },
    [`task-stats-${userId || 'all'}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.TASKS] }
  )();
});
