import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TaskStatus, TaskPriority } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils';
import { updateTaskSchema } from './validation';

type RouteContext = {
  params: Promise<{ taskId: string }>;
};

// GET - Get single task by systemId
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { taskId } = await context.params;

  try {
    const task = await prisma.task.findUnique({
      where: { systemId: taskId },
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

    if (!task) {
      return apiError('Task not found', 404);
    }

    return apiSuccess({
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
    });
  } catch (error) {
    console.error('[Tasks API] GET by ID error:', error);
    return apiError('Failed to fetch task', 500);
  }
}

// PATCH - Update task
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { taskId } = await context.params;

  const validation = await validateBody(request, updateTaskSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const {
    title,
    description,
    assigneeId,
    status,
    priority,
    dueDate,
    completedAt,
    tags,
  } = validation.data;

  try {
    // Check if exists
    const existing = await prisma.task.findUnique({
      where: { systemId: taskId },
    });

    if (!existing) {
      return apiError('Task not found', 404);
    }

    const updated = await prisma.task.update({
      where: { systemId: taskId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(assigneeId !== undefined && { assigneeId }),
        ...(status !== undefined && { status: status.toUpperCase() as TaskStatus }),
        ...(priority !== undefined && { priority: priority.toUpperCase() as TaskPriority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(completedAt !== undefined && { completedAt: completedAt ? new Date(completedAt) : null }),
        ...(tags !== undefined && { tags }),
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
      systemId: updated.systemId,
      id: updated.id,
      title: updated.title,
      description: updated.description,
      assigneeId: updated.assigneeId,
      assigneeName: updated.employees_tasks_assigneeIdToemployees?.fullName || null,
      creatorId: updated.creatorId,
      creatorName: updated.employees_tasks_creatorIdToemployees?.fullName || null,
      status: updated.status.toLowerCase(),
      priority: updated.priority.toLowerCase(),
      dueDate: updated.dueDate?.toISOString().split('T')[0] || null,
      completedAt: updated.completedAt?.toISOString() || null,
      tags: updated.tags,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('[Tasks API] PATCH error:', error);
    
    if (error instanceof Error && 'code' in error && error.code === 'P2003') {
      return apiError('Invalid assignee ID', 400);
    }

    return apiError('Failed to update task', 500);
  }
}

// DELETE - Delete task
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { taskId } = await context.params;

  try {
    // Check if exists
    const existing = await prisma.task.findUnique({
      where: { systemId: taskId },
    });

    if (!existing) {
      return apiError('Task not found', 404);
    }

    await prisma.task.delete({
      where: { systemId: taskId },
    });

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('[Tasks API] DELETE error:', error);
    return apiError('Failed to delete task', 500);
  }
}