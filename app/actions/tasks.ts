'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';
import type { Task, TaskStatus, TaskPriority } from '@/generated/prisma/client';
import type { ActionResult } from '@/types/action-result';
import { createTaskSchema, updateTaskSchema } from '@/features/tasks/validation';
import { logError } from '@/lib/logger'
import { requireActionPermission, getSessionFromCookie } from '@/lib/api-utils';
import { getEffectiveRole } from '@/lib/rbac/get-role';
import { resolvePermissions } from '@/lib/rbac/resolve-permissions';
import { notifyTaskAssigned, notifyTaskStatusChanged, notifyTaskCompleted, notifyTaskCreated, notifyTaskApprovalPending } from '@/lib/task-notifications';
import { getSessionUserName } from '@/lib/get-user-name'

// Vietnamese → Prisma enum mappings
const VIETNAMESE_STATUS_TO_ENUM: Record<string, TaskStatus> = {
  'Chưa bắt đầu': 'TODO',
  'Đang thực hiện': 'IN_PROGRESS',
  'Đang chờ': 'REVIEW',
  'Chờ duyệt': 'REVIEW',
  'Chờ xử lý': 'REVIEW',
  'Hoàn thành': 'DONE',
  'Đã hủy': 'CANCELLED',
};

const VIETNAMESE_PRIORITY_TO_ENUM: Record<string, TaskPriority> = {
  'Thấp': 'LOW',
  'Trung bình': 'MEDIUM',
  'Cao': 'HIGH',
  'Khẩn cấp': 'URGENT',
};

function toStatusEnum(status: string): TaskStatus {
  return VIETNAMESE_STATUS_TO_ENUM[status] || status as TaskStatus;
}

function toPriorityEnum(priority: string): TaskPriority {
  return VIETNAMESE_PRIORITY_TO_ENUM[priority] || priority as TaskPriority;
}

// ==================== Types ====================

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  type?: string;
  dueDate?: string | Date;
  startDate?: string | Date;
  assigneeId?: string;
  assigneeName?: string;
  assignerId?: string;
  assignerName?: string;
  assignees?: Array<{
    systemId?: string;
    employeeSystemId: string;
    employeeName: string;
    role?: string;
    assignedAt?: string;
    assignedBy?: string;
  }>;
  creatorId: string;
  estimatedHours?: number;
  tags?: string[];
  subtasks?: Array<{ id: string; title: string; completed: boolean }>;
  requiresEvidence?: boolean;
  boardId?: string;
  createdBy?: string;
}

export interface UpdateTaskInput {
  systemId: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  type?: string;
  dueDate?: string | Date | null;
  startDate?: string | Date | null;
  completedAt?: string | Date | null;
  completedDate?: string | Date | null;
  assigneeId?: string | null;
  assigneeName?: string | null;
  assignerId?: string | null;
  assignerName?: string | null;
  assignees?: Array<{
    systemId?: string;
    employeeSystemId: string;
    employeeName: string;
    role?: string;
    assignedAt?: string;
    assignedBy?: string;
  }>;
  estimatedHours?: number | null;
  actualHours?: number | null;
  progress?: number;
  tags?: string[];
  subtasks?: Array<{ id: string; title: string; completed: boolean }>;
  comments?: unknown[];
  attachments?: unknown[];
  activities?: unknown[];
  requiresEvidence?: boolean;
  completionEvidence?: unknown;
  approvalStatus?: string;
  rejectionReason?: string;
  blockedBy?: string[];
  blocks?: string[];
  boardId?: string | null;
  updatedBy?: string;
  timerRunning?: boolean;
  timerStartedAt?: string | Date | null;
  totalTrackedSeconds?: number;
}

// ==================== Actions ====================

/**
 * Create a new task
 */
export async function createTaskAction(input: CreateTaskInput): Promise<ActionResult<Task>> {
  const authResult = await requireActionPermission('create_tasks')
  if (!authResult.success) return authResult

  const validated = createTaskSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const systemId = await generateIdWithPrefix('CV', tx);
      
      const task = await tx.task.create({
        data: {
          systemId,
          id: systemId,
          title: input.title,
          description: input.description,
          status: toStatusEnum(input.status || 'TODO'),
          priority: toPriorityEnum(input.priority || 'MEDIUM'),
          type: input.type,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
          startDate: input.startDate ? new Date(input.startDate) : null,
          assigneeId: input.assigneeId,
          assigneeName: input.assigneeName,
          assignerId: input.assignerId,
          assignerName: input.assignerName,
          assignees: input.assignees as unknown as undefined,
          creatorId: input.creatorId,
          estimatedHours: input.estimatedHours,
          tags: input.tags || [],
          subtasks: input.subtasks as unknown as undefined,
          requiresEvidence: input.requiresEvidence ?? false,
          boardId: input.boardId || null,
          createdBy: input.createdBy,
          isDeleted: false,
        },
      });

      return task;
    });

    revalidatePath('/tasks');

    // Activity log
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'task',
        entityId: result.systemId,
        action: `Tạo công việc: ${result.title}`,
        actionType: 'create',
        note: `Ưu tiên: ${result.priority} | Người giao: ${result.assignerName || 'N/A'}`,
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] task create failed', e))

    // Fire-and-forget email notification for new assignment
    if (result.assigneeId) {
      notifyTaskAssigned({
        systemId: result.systemId,
        title: result.title,
        assigneeId: result.assigneeId,
        priority: result.priority,
        dueDate: result.dueDate,
        assignerName: result.assignerName,
      }).catch(() => {});
    }

    // Fire-and-forget email notification for task creation
    notifyTaskCreated({
      systemId: result.systemId,
      title: result.title,
      assigneeId: result.assigneeId,
      creatorId: result.creatorId,
      priority: result.priority,
      dueDate: result.dueDate,
    }).catch(() => {});

    return { success: true, data: result };
  } catch (error) {
    logError('Error creating task', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo công việc',
    };
  }
}

/**
 * Update an existing task
 */
export async function updateTaskAction(input: UpdateTaskInput): Promise<ActionResult<Task>> {
  // Allow both editors (edit_tasks) and assignees (view_tasks) to update tasks
  // Assignees can update: status, subtasks, comments, progress, evidence, approvalStatus, activities
  // Full editors can update all fields
  const session = await getSessionFromCookie()
  if (!session?.user) {
    return { success: false, error: 'Phiên đăng nhập hết hạn. Vui lòng tải lại trang (F5) hoặc đăng nhập lại.' }
  }
  const role = getEffectiveRole(session.user) ?? session.user.role
  const resolved = await resolvePermissions(role)
  const canEdit = resolved.includes('edit_tasks')
  const canView = resolved.includes('view_tasks')
  if (!canEdit && !canView) {
    return { success: false, error: 'Bạn không có quyền thực hiện thao tác này' }
  }

  const validated = updateTaskSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const { systemId, ...data } = input;

    const existing = await prisma.task.findUnique({
      where: { systemId },
    });

    if (!existing) {
      return { success: false, error: 'Không tìm thấy công việc' };
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = toStatusEnum(data.status as string);
    if (data.priority !== undefined) updateData.priority = toPriorityEnum(data.priority as string);
    if (data.type !== undefined) updateData.type = data.type;
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }
    if (data.startDate !== undefined) {
      updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    }
    if (data.completedAt !== undefined) {
      updateData.completedAt = data.completedAt ? new Date(data.completedAt) : null;
    }
    if (data.completedDate !== undefined) {
      updateData.completedDate = data.completedDate ? new Date(data.completedDate) : null;
    }
    if (data.assigneeId !== undefined) updateData.assigneeId = data.assigneeId;
    if (data.assigneeName !== undefined) updateData.assigneeName = data.assigneeName;
    if (data.assignerId !== undefined) updateData.assignerId = data.assignerId;
    if (data.assignerName !== undefined) updateData.assignerName = data.assignerName;
    if (data.assignees !== undefined) updateData.assignees = data.assignees;
    if (data.estimatedHours !== undefined) updateData.estimatedHours = data.estimatedHours;
    if (data.actualHours !== undefined) updateData.actualHours = data.actualHours;
    if (data.progress !== undefined) updateData.progress = data.progress;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.subtasks !== undefined) updateData.subtasks = data.subtasks;
    if (data.comments !== undefined) updateData.comments = data.comments;
    if (data.attachments !== undefined) updateData.attachments = data.attachments;
    if (data.activities !== undefined) updateData.activities = data.activities;
    if (data.requiresEvidence !== undefined) updateData.requiresEvidence = data.requiresEvidence;
    if (data.completionEvidence !== undefined) updateData.completionEvidence = data.completionEvidence;
    if (data.approvalStatus !== undefined) updateData.approvalStatus = data.approvalStatus;
    if (data.rejectionReason !== undefined) updateData.rejectionReason = data.rejectionReason;
    if (data.blockedBy !== undefined) updateData.blockedBy = data.blockedBy;
    if (data.blocks !== undefined) updateData.blocks = data.blocks;
    if (data.boardId !== undefined) updateData.boardId = data.boardId;
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy;
    if (data.timerRunning !== undefined) updateData.timerRunning = data.timerRunning;
    if (data.timerStartedAt !== undefined) {
      updateData.timerStartedAt = data.timerStartedAt ? new Date(data.timerStartedAt as string) : null;
    }
    if (data.totalTrackedSeconds !== undefined) updateData.totalTrackedSeconds = data.totalTrackedSeconds;

    const task = await prisma.task.update({
      where: { systemId },
      data: updateData,
    });

    // Fire-and-forget notifications
    if (data.assigneeId && data.assigneeId !== existing.assigneeId) {
      notifyTaskAssigned({
        systemId: task.systemId,
        title: task.title,
        assigneeId: task.assigneeId,
        priority: task.priority,
        dueDate: task.dueDate,
        assignerName: task.assignerName,
      }).catch(() => {});
    }
    if (data.status && data.status !== existing.status) {
      notifyTaskStatusChanged({
        systemId: task.systemId,
        title: task.title,
        assigneeId: task.assigneeId,
        creatorId: task.creatorId,
        status: task.status,
        oldStatus: existing.status,
      }).catch(() => {});

      if (task.status === 'REVIEW') {
        notifyTaskApprovalPending({
          systemId: task.systemId,
          title: task.title,
          assigneeId: task.assigneeId,
          creatorId: task.creatorId,
        }).catch(() => {});
      }
    }

    revalidatePath('/tasks');
    revalidatePath(`/tasks/${systemId}`);

    // Activity log
    const changedFields: string[] = []
    if (data.title !== undefined && data.title !== existing.title) changedFields.push('Tiêu đề')
    if (data.status !== undefined && toStatusEnum(data.status as string) !== existing.status) changedFields.push('Trạng thái')
    if (data.priority !== undefined && toPriorityEnum(data.priority as string) !== existing.priority) changedFields.push('Ưu tiên')
    if (data.assigneeId !== undefined && data.assigneeId !== existing.assigneeId) changedFields.push('Người thực hiện')
    if (data.dueDate !== undefined) changedFields.push('Hạn chót')
    if (data.progress !== undefined && data.progress !== existing.progress) changedFields.push('Tiến độ')
    if (data.approvalStatus !== undefined) changedFields.push('Phê duyệt')
    const userName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'task',
        entityId: systemId,
        action: `Cập nhật công việc: ${existing.title}`,
        actionType: 'update',
        note: changedFields.length > 0 ? `Thay đổi: ${changedFields.join(', ')}` : 'Cập nhật thông tin',
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] task update failed', e))

    return { success: true, data: task };
  } catch (error) {
    logError('Error updating task', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật công việc',
    };
  }
}

/**
 * Delete a task (soft delete)
 */
export async function deleteTaskAction(systemId: string): Promise<ActionResult<Task>> {
  const authResult = await requireActionPermission('delete_tasks')
  if (!authResult.success) return authResult

  try {
    const existing = await prisma.task.findUnique({
      where: { systemId },
    });

    if (!existing) {
      return { success: false, error: 'Không tìm thấy công việc' };
    }

    const task = await prisma.task.update({
      where: { systemId },
      data: { isDeleted: true },
    });

    revalidatePath('/tasks');

    // Activity log
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'task',
        entityId: systemId,
        action: `Xóa công việc: ${existing.title}`,
        actionType: 'delete',
        note: `Trạng thái: ${existing.status} | Ưu tiên: ${existing.priority}`,
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] task delete failed', e))

    return { success: true, data: task };
  } catch (error) {
    logError('Error deleting task', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa công việc',
    };
  }
}

/**
 * Restore a deleted task
 */
export async function restoreTaskAction(systemId: string): Promise<ActionResult<Task>> {
  const authResult = await requireActionPermission('edit_tasks')
  if (!authResult.success) return authResult

  try {
    const existing = await prisma.task.findUnique({
      where: { systemId },
    });

    if (!existing) {
      return { success: false, error: 'Không tìm thấy công việc' };
    }

    const task = await prisma.task.update({
      where: { systemId },
      data: { isDeleted: false },
    });

    revalidatePath('/tasks');

    // Activity log
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'task',
        entityId: systemId,
        action: `Khôi phục công việc: ${existing.title}`,
        actionType: 'update',
        note: 'Khôi phục từ thùng rác',
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] task restore failed', e))

    return { success: true, data: task };
  } catch (error) {
    logError('Error restoring task', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể khôi phục công việc',
    };
  }
}

/**
 * Update task status
 */
export async function updateTaskStatusAction(
  systemId: string,
  status: TaskStatus
): Promise<ActionResult<Task>> {
  const authResult = await requireActionPermission('edit_tasks')
  if (!authResult.success) return authResult

  try {
    const existing = await prisma.task.findUnique({
      where: { systemId },
    });

    if (!existing) {
      return { success: false, error: 'Không tìm thấy công việc' };
    }

    const updateData: Record<string, unknown> = { status };

    // If completed, set completedAt
    if (status === 'DONE') {
      updateData.completedAt = new Date();
      updateData.progress = 100;
    }

    const task = await prisma.task.update({
      where: { systemId },
      data: updateData,
    });

    // Fire-and-forget notifications
    notifyTaskStatusChanged({
      systemId: task.systemId,
      title: task.title,
      assigneeId: task.assigneeId,
      creatorId: task.creatorId,
      status: task.status,
      oldStatus: existing.status,
    }).catch(() => {});

    if (status === 'DONE') {
      notifyTaskCompleted({
        systemId: task.systemId,
        title: task.title,
        assigneeId: task.assigneeId,
        creatorId: task.creatorId,
      }).catch(() => {});
    }

    if (status === 'REVIEW') {
      notifyTaskApprovalPending({
        systemId: task.systemId,
        title: task.title,
        assigneeId: task.assigneeId,
        creatorId: task.creatorId,
      }).catch(() => {});
    }

    revalidatePath('/tasks');

    // Activity log
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'task',
        entityId: systemId,
        action: `Đổi trạng thái công việc: ${existing.title}`,
        actionType: 'update',
        note: `${existing.status} → ${status}`,
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] task status update failed', e))

    return { success: true, data: task };
  } catch (error) {
    logError('Error updating task status', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật trạng thái công việc',
    };
  }
}

/**
 * Complete a task
 */
export async function completeTaskAction(systemId: string): Promise<ActionResult<Task>> {
  const authResult = await requireActionPermission('edit_tasks')
  if (!authResult.success) return authResult

  return updateTaskStatusAction(systemId, 'DONE');
}

/**
 * Add a comment to a task
 */
export async function addTaskCommentAction(
  systemId: string,
  content: string,
  authorId?: string,
  authorName?: string
): Promise<ActionResult<Task>> {
  // Comments only require view_tasks — any viewer can comment
  const authResult = await requireActionPermission('view_tasks')
  if (!authResult.success) return authResult
  const { session } = authResult

  try {
    const existing = await prisma.task.findUnique({
      where: { systemId },
    });

    if (!existing) {
      return { success: false, error: 'Không tìm thấy công việc' };
    }

    const existingComments = (existing.comments as Prisma.JsonArray | null) || [];
    const newComment = {
      id: await generateIdWithPrefix('COMMENT', prisma),
      content,
      authorId,
      authorName,
      createdAt: new Date().toISOString(),
    };

    const task = await prisma.task.update({
      where: { systemId },
      data: {
        comments: [...existingComments, newComment] as Prisma.InputJsonValue,
      },
    });

    revalidatePath('/tasks');
    revalidatePath(`/tasks/${systemId}`);

    // Activity log
    const userName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'task',
        entityId: systemId,
        action: `Thêm bình luận: ${existing.title}`,
        actionType: 'update',
        note: `Bình luận bởi ${authorName || userName}`,
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] task comment failed', e))

    return { success: true, data: task };
  } catch (error) {
    logError('Error adding comment', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể thêm bình luận',
    };
  }
}

/**
 * Toggle task timer (start/stop)
 */
export async function toggleTaskTimerAction(
  systemId: string,
  action: 'start' | 'stop'
): Promise<ActionResult<Task>> {
  const authResult = await requireActionPermission('edit_tasks')
  if (!authResult.success) return authResult

  try {
    const existing = await prisma.task.findUnique({
      where: { systemId },
    });

    if (!existing) {
      return { success: false, error: 'Không tìm thấy công việc' };
    }

    let updateData: Record<string, unknown>;

    if (action === 'start') {
      updateData = {
        timerRunning: true,
        timerStartedAt: new Date(),
      };
    } else {
      // Calculate elapsed time
      const startedAt = existing.timerStartedAt;
      let additionalSeconds = 0;
      if (startedAt) {
        additionalSeconds = Math.floor(
          (Date.now() - new Date(startedAt).getTime()) / 1000
        );
      }

      updateData = {
        timerRunning: false,
        timerStartedAt: null,
        totalTrackedSeconds: existing.totalTrackedSeconds + additionalSeconds,
      };
    }

    const task = await prisma.task.update({
      where: { systemId },
      data: updateData,
    });

    revalidatePath('/tasks');

    // Activity log
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'task',
        entityId: systemId,
        action: `${action === 'start' ? 'Bắt đầu' : 'Dừng'} hẹn giờ: ${existing.title}`,
        actionType: 'update',
        note: action === 'start' ? 'Bắt đầu tính giờ' : `Dừng tính giờ`,
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] task timer toggle failed', e))

    return { success: true, data: task };
  } catch (error) {
    logError('Error toggling timer', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể chuyển đổi bộ hẹn giờ',
    };
  }
}
