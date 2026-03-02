'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';
import type { Task, TaskStatus, TaskPriority } from '@prisma/client';
import { auth } from '@/auth';
import type { ActionResult } from '@/types/action-result';
import { createTaskSchema, updateTaskSchema } from '@/features/tasks/validation';

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
  updatedBy?: string;
}

// ==================== Actions ====================

/**
 * Create a new task
 */
export async function createTaskAction(input: CreateTaskInput): Promise<ActionResult<Task>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

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
          status: input.status || 'TODO',
          priority: input.priority || 'MEDIUM',
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
          createdBy: input.createdBy,
          isDeleted: false,
        },
      });

      return task;
    });

    revalidatePath('/tasks');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating task:', error);
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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
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
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
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
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy;

    const task = await prisma.task.update({
      where: { systemId },
      data: updateData,
    });

    revalidatePath('/tasks');
    revalidatePath(`/tasks/${systemId}`);
    return { success: true, data: task };
  } catch (error) {
    console.error('Error updating task:', error);
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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

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
    return { success: true, data: task };
  } catch (error) {
    console.error('Error deleting task:', error);
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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

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
    return { success: true, data: task };
  } catch (error) {
    console.error('Error restoring task:', error);
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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

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

    revalidatePath('/tasks');
    return { success: true, data: task };
  } catch (error) {
    console.error('Error updating task status:', error);
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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

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
    return { success: true, data: task };
  } catch (error) {
    console.error('Error adding comment:', error);
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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

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
    return { success: true, data: task };
  } catch (error) {
    console.error('Error toggling timer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể chuyển đổi bộ hẹn giờ',
    };
  }
}

/**
 * Update task progress
 */
export async function updateTaskProgressAction(
  systemId: string,
  progress: number
): Promise<ActionResult<Task>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    if (progress < 0 || progress > 100) {
      return { success: false, error: 'Tiến độ phải từ 0 đến 100' };
    }

    const existing = await prisma.task.findUnique({
      where: { systemId },
    });

    if (!existing) {
      return { success: false, error: 'Không tìm thấy công việc' };
    }

    const updateData: Record<string, unknown> = { progress };

    // Auto-complete if progress is 100
    if (progress === 100 && existing.status !== 'DONE') {
      updateData.status = 'DONE';
      updateData.completedAt = new Date();
    }

    const task = await prisma.task.update({
      where: { systemId },
      data: updateData,
    });

    revalidatePath('/tasks');
    return { success: true, data: task };
  } catch (error) {
    console.error('Error updating progress:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật tiến độ',
    };
  }
}

/**
 * Update subtasks
 */
export async function updateSubtasksAction(
  systemId: string,
  subtasks: Array<{ id: string; title: string; completed: boolean }>
): Promise<ActionResult<Task>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const existing = await prisma.task.findUnique({
      where: { systemId },
    });

    if (!existing) {
      return { success: false, error: 'Không tìm thấy công việc' };
    }

    // Calculate progress based on completed subtasks
    const completedCount = subtasks.filter((s) => s.completed).length;
    const progress = subtasks.length > 0
      ? Math.round((completedCount / subtasks.length) * 100)
      : existing.progress;

    const task = await prisma.task.update({
      where: { systemId },
      data: {
        subtasks: subtasks as unknown as undefined,
        progress,
      },
    });

    revalidatePath('/tasks');
    revalidatePath(`/tasks/${systemId}`);
    return { success: true, data: task };
  } catch (error) {
    console.error('Error updating subtasks:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật công việc con',
    };
  }
}

/**
 * Approve task completion
 */
export async function approveTaskAction(
  systemId: string,
  approvedBy?: string,
  approvedByName?: string
): Promise<ActionResult<Task>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const existing = await prisma.task.findUnique({
      where: { systemId },
    });

    if (!existing) {
      return { success: false, error: 'Không tìm thấy công việc' };
    }

    const approvalHistory = (existing.approvalHistory as Prisma.JsonArray | null) || [];
    const newApproval = {
      action: 'approved',
      by: approvedBy,
      byName: approvedByName,
      at: new Date().toISOString(),
    };

    const task = await prisma.task.update({
      where: { systemId },
      data: {
        approvalStatus: 'approved',
        status: 'DONE',
        completedAt: new Date(),
        progress: 100,
        approvalHistory: [...approvalHistory, newApproval] as Prisma.InputJsonValue,
      },
    });

    revalidatePath('/tasks');
    return { success: true, data: task };
  } catch (error) {
    console.error('Error approving task:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể phê duyệt công việc',
    };
  }
}

/**
 * Reject task completion
 */
export async function rejectTaskAction(
  systemId: string,
  reason: string,
  rejectedBy?: string,
  rejectedByName?: string
): Promise<ActionResult<Task>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const existing = await prisma.task.findUnique({
      where: { systemId },
    });

    if (!existing) {
      return { success: false, error: 'Không tìm thấy công việc' };
    }

    const approvalHistory = (existing.approvalHistory as Prisma.JsonArray | null) || [];
    const newRejection = {
      action: 'rejected',
      reason,
      by: rejectedBy,
      byName: rejectedByName,
      at: new Date().toISOString(),
    };

    const task = await prisma.task.update({
      where: { systemId },
      data: {
        approvalStatus: 'rejected',
        rejectionReason: reason,
        status: 'IN_PROGRESS',
        completedAt: null,
        completionEvidence: undefined,
        approvalHistory: [...approvalHistory, newRejection] as Prisma.InputJsonValue,
      },
    });

    revalidatePath('/tasks');
    return { success: true, data: task };
  } catch (error) {
    console.error('Error rejecting task:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể từ chối công việc',
    };
  }
}
