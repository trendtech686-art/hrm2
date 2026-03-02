import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import type { TaskStatus, TaskPriority } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createTaskSchema } from './validation'
import { generateNextIdsWithTx } from '@/lib/id-system'

// GET - List all tasks
export async function GET(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = parsePagination(searchParams);
  const status = searchParams.get('status');
  const assigneeId = searchParams.get('assigneeId');
  const priority = searchParams.get('priority');
  const search = searchParams.get('search');
  const createdFrom = searchParams.get('createdFrom');
  const createdTo = searchParams.get('createdTo');

  try {
    const where: Prisma.TaskWhereInput = {};
    
    if (status) {
      where.status = status.toUpperCase() as TaskStatus;
    }
    if (assigneeId) {
      // Search both legacy assigneeId field AND JSON assignees array
      where.OR = [
        { assigneeId },
        { assignees: { string_contains: assigneeId } },
      ];
    }
    if (priority) {
      where.priority = priority.toUpperCase() as TaskPriority;
    }
    
    // Date range filter for createdAt
    if (createdFrom || createdTo) {
      where.createdAt = {};
      if (createdFrom) (where.createdAt as Prisma.DateTimeFilter).gte = new Date(createdFrom);
      if (createdTo) (where.createdAt as Prisma.DateTimeFilter).lte = new Date(createdTo);
    }
    
    // Server-side search
    if (search) {
      const searchConditions: Prisma.TaskWhereInput[] = [
        { id: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
      // If we already have OR from assigneeId, wrap with AND
      if (where.OR) {
        where.AND = [{ OR: where.OR }, { OR: searchConditions }];
        delete where.OR;
      } else {
        where.OR = searchConditions;
      }
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' },
          { createdAt: 'desc' },
        ],
        include: {
          employees_tasks_assigneeIdToemployees: {
            select: {
              systemId: true,
              fullName: true,
              avatarUrl: true,
            },
          },
          employees_tasks_creatorIdToemployees: {
            select: {
              systemId: true,
              fullName: true,
            },
          },
        },
      }),
      prisma.task.count({ where }),
    ]);

    // Transform to match store format
    const transformed = tasks.map(task => ({
      systemId: task.systemId,
      id: task.id,
      title: task.title,
      description: task.description,
      assigneeId: task.assigneeId,
      assigneeName: task.employees_tasks_assigneeIdToemployees?.fullName || null,
      assigneeAvatar: task.employees_tasks_assigneeIdToemployees?.avatarUrl || null,
      creatorId: task.creatorId,
      creatorName: task.employees_tasks_creatorIdToemployees?.fullName || null,
      status: task.status.toLowerCase(),
      priority: task.priority.toLowerCase(),
      dueDate: task.dueDate?.toISOString().split('T')[0] || null,
      completedAt: task.completedAt?.toISOString() || null,
      tags: task.tags,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    }));

    return apiPaginated(transformed, { page, limit, total })
  } catch (error) {
    console.error('[Tasks API] GET error:', error);
    return apiError('Failed to fetch tasks', 500)
  }
}

// POST - Create new task
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createTaskSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const {
    systemId: _systemId,
    id,
    title,
    description,
    assigneeId,
    creatorId,
    status,
    priority,
    dueDate,
    tags,
  } = validation.data

  try {
    const created = await prisma.$transaction(async (tx) => {
      // Generate IDs using unified ID system
      const { systemId, businessId } = await generateNextIdsWithTx(
        tx,
        'internal-tasks',
        id?.trim() || undefined
      );

      return tx.task.create({
        data: {
          systemId,
          id: businessId,
          title,
          description,
          assigneeId,
          creatorId,
          status: (status?.toUpperCase() || 'TODO') as TaskStatus,
          priority: (priority?.toUpperCase() || 'MEDIUM') as TaskPriority,
          dueDate: dueDate ? new Date(dueDate) : null,
          tags: tags || [],
        },
        include: {
          employees_tasks_assigneeIdToemployees: {
            select: {
              fullName: true,
              avatarUrl: true,
            },
          },
          employees_tasks_creatorIdToemployees: {
            select: {
              fullName: true,
            },
          },
        },
      });
    });

    return apiSuccess({
      systemId: created.systemId,
      id: created.id,
      title: created.title,
      description: created.description,
      assigneeId: created.assigneeId,
      assigneeName: created.employees_tasks_assigneeIdToemployees?.fullName || null,
      creatorId: created.creatorId,
      creatorName: created.employees_tasks_creatorIdToemployees?.fullName || null,
      status: created.status.toLowerCase(),
      priority: created.priority.toLowerCase(),
      dueDate: created.dueDate?.toISOString().split('T')[0] || null,
      tags: created.tags,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    }, 201)
  } catch (error) {
    console.error('[Tasks API] POST error:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return apiError('A task with this ID already exists', 409)
      }
      if (error.code === 'P2003') {
        return apiError('Invalid creator or assignee ID', 400)
      }
    }

    return apiError('Failed to create task', 500)
  }
}
