import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger';

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

  try {
    const body = await request.json();

    const existing = await prisma.taskBoard.findUnique({
      where: { systemId: boardId },
    });

    if (!existing || existing.isDeleted) {
      return apiError('Không tìm thấy bảng công việc', 404);
    }

    const board = await prisma.taskBoard.update({
      where: { systemId: boardId },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.color !== undefined && { color: body.color }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.isDefault !== undefined && { isDefault: body.isDefault }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
        ...(body.updatedBy !== undefined && { updatedBy: body.updatedBy }),
      },
    });

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

    return apiSuccess(board);
  } catch (error) {
    logError('Failed to delete task board', error);
    return apiError('Không thể xóa bảng công việc', 500);
  }
}
