import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TaskStatus, TaskPriority } from '@/generated/prisma/client';
import { requirePermission, validateBody, apiSuccess, apiError } from '@/lib/api-utils';
import { updateTaskSchema } from './validation';
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

// Reverse map: Vietnamese → Prisma enum (for incoming updates)
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

type RouteContext = {
  params: Promise<{ taskId: string }>;
};

// GET - Get single task by systemId
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const result = await requirePermission('view_tasks')
  if (result instanceof NextResponse) return result

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
      return apiError('Không tìm thấy công việc', 404);
    }

    return apiSuccess({
      systemId: task.systemId,
      id: task.id,
      title: task.title,
      description: task.description,
      type: task.type,
      assigneeId: task.assigneeId,
      assigneeName: task.employees_tasks_assigneeIdToemployees?.fullName || null,
      assigneeAvatar: task.employees_tasks_assigneeIdToemployees?.avatarUrl || null,
      assignerId: task.assignerId,
      assignerName: task.assignerName,
      creatorId: task.creatorId,
      creatorName: task.employees_tasks_creatorIdToemployees?.fullName || null,
      status: STATUS_MAP[task.status] || task.status,
      priority: PRIORITY_MAP[task.priority] || task.priority,
      dueDate: task.dueDate?.toISOString().split('T')[0] || null,
      startDate: task.startDate?.toISOString().split('T')[0] || null,
      completedAt: task.completedAt?.toISOString() || null,
      completedDate: task.completedDate?.toISOString().split('T')[0] || null,
      tags: task.tags,
      progress: task.progress,
      timerRunning: task.timerRunning,
      timerStartedAt: task.timerStartedAt?.toISOString() || null,
      totalTrackedSeconds: task.totalTrackedSeconds,
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
      createdBy: task.createdBy,
      updatedBy: task.updatedBy,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    });
  } catch (error) {
    logError('[Tasks API] GET by ID error', error);
    return apiError('Không thể tải công việc', 500);
  }
}

// PATCH - Update task
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const result = await requirePermission('edit_tasks')
  if (result instanceof NextResponse) return result

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
      return apiError('Không tìm thấy công việc', 404);
    }

    const updated = await prisma.task.update({
      where: { systemId: taskId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(assigneeId !== undefined && { assigneeId }),
        ...(status !== undefined && { status: REVERSE_STATUS_MAP[status] || status.toUpperCase() as TaskStatus }),
        ...(priority !== undefined && { priority: REVERSE_PRIORITY_MAP[priority] || priority.toUpperCase() as TaskPriority }),
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

    // Send notifications for task changes (non-blocking)
    const currentUserEmployeeId = result.user?.employeeId;
    const taskLink = `/tasks?taskId=${updated.systemId}`;

    // Notify on status change
    if (status !== undefined && existing.status !== updated.status) {
      const newStatusLabel = STATUS_MAP[updated.status] || updated.status;
      const recipients = [updated.assigneeId, updated.creatorId].filter(
        (id): id is string => !!id && id !== currentUserEmployeeId
      );
      const uniqueRecipients = [...new Set(recipients)];
      for (const recipientId of uniqueRecipients) {
        createNotification({
          type: 'task',
          title: 'Cập nhật công việc',
          message: `"${updated.title}" chuyển sang ${newStatusLabel}`,
          link: taskLink,
          recipientId,
          senderId: currentUserEmployeeId || undefined,
          senderName: result.user?.name || undefined,
          settingsKey: 'task:status',
        }).catch(e => logError('[Tasks] Status notification failed', e));
      }
    }

    // Notify on assignee change
    if (assigneeId !== undefined && existing.assigneeId !== updated.assigneeId && updated.assigneeId) {
      if (updated.assigneeId !== currentUserEmployeeId) {
        createNotification({
          type: 'task',
          title: 'Công việc mới',
          message: `Bạn được giao công việc "${updated.title}"`,
          link: taskLink,
          recipientId: updated.assigneeId,
          senderId: currentUserEmployeeId || undefined,
          senderName: result.user?.name || undefined,
          settingsKey: 'task:assigned',
        }).catch(e => logError('[Tasks] Assignment notification failed', e));
      }
    }

    // Log activity
    getUserNameFromDb(result.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'task',
          entityId: taskId,
          action: 'updated',
          actionType: 'update',
          note: `Cập nhật công việc`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] task update failed', e))

    return apiSuccess({
      systemId: updated.systemId,
      id: updated.id,
      title: updated.title,
      description: updated.description,
      assigneeId: updated.assigneeId,
      assigneeName: updated.employees_tasks_assigneeIdToemployees?.fullName || null,
      creatorId: updated.creatorId,
      creatorName: updated.employees_tasks_creatorIdToemployees?.fullName || null,
      status: STATUS_MAP[updated.status] || updated.status,
      priority: PRIORITY_MAP[updated.priority] || updated.priority,
      dueDate: updated.dueDate?.toISOString().split('T')[0] || null,
      completedAt: updated.completedAt?.toISOString() || null,
      tags: updated.tags,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (error) {
    logError('[Tasks API] PATCH error', error);
    
    if (error instanceof Error && 'code' in error && error.code === 'P2003') {
      return apiError('ID người thực hiện không hợp lệ', 400);
    }

    return apiError('Không thể cập nhật công việc', 500);
  }
}

// DELETE - Delete task
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const result = await requirePermission('delete_tasks')
  if (result instanceof NextResponse) return result

  const { taskId } = await context.params;

  try {
    // Check if exists
    const existing = await prisma.task.findUnique({
      where: { systemId: taskId },
    });

    if (!existing) {
      return apiError('Không tìm thấy công việc', 404);
    }

    await prisma.task.delete({
      where: { systemId: taskId },
    });

    // Log activity
    getUserNameFromDb(result.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'task',
          entityId: taskId,
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa công việc`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] task delete failed', e))

    return apiSuccess({ success: true });
  } catch (error) {
    logError('[Tasks API] DELETE error', error);
    return apiError('Không thể xóa công việc', 500);
  }
}