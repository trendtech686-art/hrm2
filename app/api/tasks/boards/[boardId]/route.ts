import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, validateBody, apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger';
import { createActivityLog } from '@/lib/services/activity-log-service';
import { z } from 'zod';

// Validation schema for PUT request
const updateBoardSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  sortOrder: z.number().optional(),
  updatedBy: z.string().optional(),
})

// Build field-level diff between existing record and new values
function buildChanges<T extends Record<string, unknown>>(
  existing: T,
  updates: Partial<T>,
): Record<string, { from: unknown; to: unknown }> | undefined {
  const changes: Record<string, { from: unknown; to: unknown }> = {};
  for (const [key, next] of Object.entries(updates)) {
    if (next === undefined) continue;
    const prev = existing[key as keyof T];
    if (prev !== next) changes[key] = { from: prev, to: next };
  }
  return Object.keys(changes).length > 0 ? changes : undefined;
}

// GET - Single board with task count
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const result = await requirePermission('view_tasks');
  if (result instanceof NextResponse) return result;

  const { boardId } = await params;

  try {
    const board = await prisma.taskBoard.findUnique({
      where: { systemId: boardId },
    });

    if (!board || board.isDeleted) {
      return apiError('Không tìm thấy bảng công việc', 404);
    }

    // Count tasks in this board
    const taskCount = await prisma.task.count({
      where: { boardId, isDeleted: false },
    });

    return apiSuccess({ ...board, taskCount });
  } catch (error) {
    logError('Failed to fetch task board', error);
    return apiError('Không thể tải bảng công việc', 500);
  }
}

// PUT - Update board
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const result = await requirePermission('edit_tasks');
  if (result instanceof NextResponse) return result;

  const { boardId } = await params;

  const validation = await validateBody(request, updateBoardSchema);
  if (!validation.success) {
    return apiError(validation.error, 400);
  }
  const body = validation.data;

  try {
    const existing = await prisma.taskBoard.findUnique({
      where: { systemId: boardId },
    });

    if (!existing || existing.isDeleted) {
      return apiError('Không tìm thấy bảng công việc', 404);
    }

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.color !== undefined) updateData.color = body.color;
    if (body.icon !== undefined) updateData.icon = body.icon;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.isDefault !== undefined) updateData.isDefault = body.isDefault;
    if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;
    if (body.updatedBy !== undefined) updateData.updatedBy = body.updatedBy;

    const board = await prisma.taskBoard.update({
      where: { systemId: boardId },
      data: updateData,
    });

    const changes = buildChanges(existing as unknown as Record<string, unknown>, updateData);
    createActivityLog({
      entityType: 'task_board',
      entityId: boardId,
      action: `Cập nhật bảng công việc "${existing.name}"`,
      actionType: 'update',
      changes,
      metadata: { userName: body.updatedBy },
      createdBy: body.updatedBy || undefined,
    }).catch(() => undefined);

    return apiSuccess(board);
  } catch (error) {
    logError('Failed to update task board', error);
    return apiError('Không thể cập nhật bảng công việc', 500);
  }
}

// DELETE - Soft delete
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const result = await requirePermission('delete_tasks');
  if (result instanceof NextResponse) return result;

  const { boardId } = await params;

  try {
    const existing = await prisma.taskBoard.findUnique({
      where: { systemId: boardId },
    });

    if (!existing || existing.isDeleted) {
      return apiError('Không tìm thấy bảng công việc', 404);
    }

    // Unassign tasks from this board
    await prisma.task.updateMany({
      where: { boardId },
      data: { boardId: null },
    });

    const board = await prisma.taskBoard.update({
      where: { systemId: boardId },
      data: { isDeleted: true },
    });

    createActivityLog({
      entityType: 'task_board',
      entityId: boardId,
      action: `Xóa bảng công việc "${existing.name}"`,
      actionType: 'delete',
    }).catch(() => undefined);

    return apiSuccess(board);
  } catch (error) {
    logError('Failed to delete task board', error);
    return apiError('Không thể xóa bảng công việc', 500);
  }
}
