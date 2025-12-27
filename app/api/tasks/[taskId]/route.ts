import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: Promise<{ taskId: string }>;
};

// GET - Get single task by systemId
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
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
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
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
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PATCH - Update task
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const { taskId } = await context.params;

  try {
    const body = await request.json();
    const {
      title,
      description,
      assigneeId,
      status,
      priority,
      dueDate,
      completedAt,
      tags,
    } = body;

    // Check if exists
    const existing = await prisma.task.findUnique({
      where: { systemId: taskId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const updated = await prisma.task.update({
      where: { systemId: taskId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(assigneeId !== undefined && { assigneeId }),
        ...(status !== undefined && { status: status.toUpperCase() }),
        ...(priority !== undefined && { priority: priority.toUpperCase() }),
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

    return NextResponse.json({
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
  } catch (error: any) {
    console.error('[Tasks API] PATCH error:', error);
    
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Invalid assignee ID' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE - Delete task
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const { taskId } = await context.params;

  try {
    // Check if exists
    const existing = await prisma.task.findUnique({
      where: { systemId: taskId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    await prisma.task.delete({
      where: { systemId: taskId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Tasks API] DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
