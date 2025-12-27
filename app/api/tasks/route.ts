import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET - List all tasks
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const assigneeId = searchParams.get('assigneeId');
  const priority = searchParams.get('priority');

  try {
    const where: Prisma.TaskWhereInput = {};
    
    if (status) {
      where.status = status.toUpperCase() as any;
    }
    if (assigneeId) {
      where.assigneeId = assigneeId;
    }
    if (priority) {
      where.priority = priority.toUpperCase() as any;
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

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('[Tasks API] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST - Create new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!creatorId) {
      return NextResponse.json(
        { error: 'Creator ID is required' },
        { status: 400 }
      );
    }

    const created = await prisma.task.create({
      data: {
        systemId: systemId || `TASK-${Date.now()}`,
        id: id || `CV${String(Date.now()).slice(-6)}`,
        title,
        description,
        assigneeId,
        creatorId,
        status: status?.toUpperCase() || 'TODO',
        priority: priority?.toUpperCase() || 'MEDIUM',
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

    return NextResponse.json({
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
    }, { status: 201 });
  } catch (error: any) {
    console.error('[Tasks API] POST error:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A task with this ID already exists' },
        { status: 409 }
      );
    }
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Invalid creator or assignee ID' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
