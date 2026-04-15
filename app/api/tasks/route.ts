import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import type { TaskStatus, TaskPriority } from '@/generated/prisma/client';
import { requirePermission, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createTaskSchema } from './validation'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

// Map Prisma enum values to Vietnamese display labels
const STATUS_MAP: Record<string, string> = {
  TODO: 'Chưa bắt đầu',
  IN_PROGRESS: 'Đang thực hiện',
  REVIEW: 'Chờ duyệt',
  DONE: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

const PRIORITY_MAP: Record<string, string> = {
  LOW: 'Thấp',
  MEDIUM: 'Trung bình',
  HIGH: 'Cao',
  URGENT: 'Khẩn cấp',
};

// Reverse map: Vietnamese → Prisma enum (for incoming creates)
const REVERSE_STATUS_MAP: Record<string, TaskStatus> = {
  'Chưa bắt đầu': 'TODO',
  'Đang thực hiện': 'IN_PROGRESS',
  'Đang chờ': 'REVIEW',
  'Chờ duyệt': 'REVIEW',
  'Chờ xử lý': 'REVIEW',
  'Hoàn thành': 'DONE',
  'Đã hủy': 'CANCELLED',
};

const REVERSE_PRIORITY_MAP: Record<string, TaskPriority> = {
  'Thấp': 'LOW',
  'Trung bình': 'MEDIUM',
  'Cao': 'HIGH',
  'Khẩn cấp': 'URGENT',
};

// GET - List all tasks
export async function GET(request: NextRequest) {
  const result = await requirePermission('view_tasks')
  if (result instanceof NextResponse) return result
  const session = result

  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = parsePagination(searchParams);
  const status = searchParams.get('status');
  const assigneeId = searchParams.get('assigneeId');
  const priority = searchParams.get('priority');
  const search = searchParams.get('search');
  const createdFrom = searchParams.get('createdFrom');
  const createdTo = searchParams.get('createdTo');
  const boardId = searchParams.get('boardId');

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
    if (boardId) {
      where.boardId = boardId;
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
          { createdAt: 'desc' },
          { priority: 'desc' },
          { dueDate: 'asc' },
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

    // Transform to match store format (Vietnamese labels for UI)
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
      status: STATUS_MAP[task.status] || task.status,
      priority: PRIORITY_MAP[task.priority] || task.priority,
      dueDate: task.dueDate?.toISOString().split('T')[0] || null,
      startDate: task.startDate?.toISOString().split('T')[0] || null,
      completedAt: task.completedAt?.toISOString() || null,
      tags: task.tags,
      progress: task.progress,
      assignees: typeof task.assignees === 'string' ? JSON.parse(task.assignees) : (task.assignees ?? []),
      subtasks: typeof task.subtasks === 'string' ? JSON.parse(task.subtasks) : (task.subtasks ?? []),
      comments: typeof task.comments === 'string' ? JSON.parse(task.comments) : (task.comments ?? []),
      activities: task.activities,
      completionEvidence: task.completionEvidence,
      approvalStatus: task.approvalStatus,
      rejectionReason: task.rejectionReason,
      requiresEvidence: task.requiresEvidence,
      estimatedHours: task.estimatedHours ? Number(task.estimatedHours) : null,
      actualHours: task.actualHours ? Number(task.actualHours) : null,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    }));

    return apiPaginated(transformed, { page, limit, total })
  } catch (error) {
    logError('[Tasks API] GET error', error);
    return apiError('Không thể tải danh sách công việc', 500)
  }
}

// POST - Create new task
export async function POST(request: NextRequest) {
  const result = await requirePermission('create_tasks')
  if (result instanceof NextResponse) return result
  const session = result

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
          status: (status ? (REVERSE_STATUS_MAP[status] || status.toUpperCase()) : 'TODO') as TaskStatus,
          priority: (priority ? (REVERSE_PRIORITY_MAP[priority] || priority.toUpperCase()) : 'MEDIUM') as TaskPriority,
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

    // Notify assignee about new task (non-blocking)
    if (created.assigneeId && created.assigneeId !== created.creatorId) {
      createNotification({
        type: 'task',
        title: 'Công việc mới',
        message: `Bạn được giao công việc "${created.title}"`,
        link: `/tasks?taskId=${created.systemId}`,
        recipientId: created.assigneeId,
        senderId: created.creatorId || undefined,
        senderName: created.employees_tasks_creatorIdToemployees?.fullName || undefined,
        settingsKey: 'task:created',
      }).catch(e => logError('[Tasks] Notification failed', e));
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'task',
          entityId: created.systemId,
          action: 'created',
          actionType: 'create',
          note: `Tạo công việc`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] task create failed', e))

    return apiSuccess({
      systemId: created.systemId,
      id: created.id,
      title: created.title,
      description: created.description,
      assigneeId: created.assigneeId,
      assigneeName: created.employees_tasks_assigneeIdToemployees?.fullName || null,
      creatorId: created.creatorId,
      creatorName: created.employees_tasks_creatorIdToemployees?.fullName || null,
      status: STATUS_MAP[created.status] || created.status,
      priority: PRIORITY_MAP[created.priority] || created.priority,
      dueDate: created.dueDate?.toISOString().split('T')[0] || null,
      tags: created.tags,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    }, 201)
  } catch (error) {
    logError('[Tasks API] POST error', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return apiError('Công việc với ID này đã tồn tại', 409)
      }
      if (error.code === 'P2003') {
        return apiError('ID người tạo hoặc người thực hiện không hợp lệ', 400)
      }
    }

    return apiError('Không thể tạo công việc', 500)
  }
}
