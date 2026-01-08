import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import type { TaskStatus, TaskPriority } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { createTaskSchema } from './validation'

// GET - List all tasks
export async function GET(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const assigneeId = searchParams.get('assigneeId');
  const priority = searchParams.get('priority');

  try {
    const where: Prisma.TaskWhereInput = {};
    
    if (status) {
      where.status = status.toUpperCase() as TaskStatus;
    }
    if (assigneeId) {
      where.assigneeId = assigneeId;
    }
    if (priority) {
      where.priority = priority.toUpperCase() as TaskPriority;
    }

    const tasks = await prisma.task.findMany({
      where,
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
    });

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

    return apiSuccess(transformed)
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
    systemId,
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
    const created = await prisma.task.create({
      data: {
        systemId: systemId || `TASK-${Date.now()}`,
        id: id || `CV${String(Date.now()).slice(-6)}`,
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
