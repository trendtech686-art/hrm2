import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger';

// GET - Single recurring task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ recurringTaskId: string }> }
) {
  const result = await requirePermission('view_tasks');
  if (result instanceof NextResponse) return result;

  const { recurringTaskId } = await params;

  try {
    const task = await prisma.recurringTask.findUnique({
      where: { systemId: recurringTaskId },
    });

    if (!task || task.isDeleted) {
      return apiError('Không tìm thấy công việc lặp lại', 404);
    }

    return apiSuccess(task);
  } catch (error) {
    logError('Failed to fetch recurring task', error);
    return apiError('Không thể tải công việc lặp lại', 500);
  }
}

// PUT - Update recurring task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ recurringTaskId: string }> }
) {
  const result = await requirePermission('edit_tasks');
  if (result instanceof NextResponse) return result;

  const { recurringTaskId } = await params;

  try {
    const body = await request.json();

    const existing = await prisma.recurringTask.findUnique({
      where: { systemId: recurringTaskId },
    });

    if (!existing || existing.isDeleted) {
      return apiError('Không tìm thấy công việc lặp lại', 404);
    }

    const task = await prisma.recurringTask.update({
      where: { systemId: recurringTaskId },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.assignees !== undefined && { assignees: body.assignees }),
        ...(body.assigneeSystemId !== undefined && { assigneeSystemId: body.assigneeSystemId }),
        ...(body.assignerId !== undefined && { assignerId: body.assignerId }),
        ...(body.assignerName !== undefined && { assignerName: body.assignerName }),
        ...(body.priority !== undefined && { priority: mapPriority(body.priority) }),
        ...(body.estimatedHours !== undefined && { estimatedHours: body.estimatedHours }),
        ...(body.recurrencePattern !== undefined && { recurrencePattern: body.recurrencePattern }),
        ...(body.startDate !== undefined && { startDate: new Date(body.startDate) }),
        ...(body.durationDays !== undefined && { durationDays: body.durationDays }),
        ...(body.createDaysBefore !== undefined && { createDaysBefore: body.createDaysBefore }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.isPaused !== undefined && { isPaused: body.isPaused }),
        ...(body.nextOccurrenceDate !== undefined && { nextOccurrenceDate: body.nextOccurrenceDate ? new Date(body.nextOccurrenceDate) : null }),
        ...(body.createdTaskIds !== undefined && { createdTaskIds: body.createdTaskIds }),
        ...(body.occurrenceCount !== undefined && { occurrenceCount: body.occurrenceCount }),
        ...(body.lastCreatedDate !== undefined && { lastCreatedDate: body.lastCreatedDate ? new Date(body.lastCreatedDate) : null }),
      },
    });

    return apiSuccess(task);
  } catch (error) {
    logError('Failed to update recurring task', error);
    return apiError('Không thể cập nhật công việc lặp lại', 500);
  }
}

// DELETE - Soft delete
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ recurringTaskId: string }> }
) {
  const result = await requirePermission('delete_tasks');
  if (result instanceof NextResponse) return result;

  const { recurringTaskId } = await params;

  try {
    await prisma.recurringTask.update({
      where: { systemId: recurringTaskId },
      data: { isDeleted: true },
    });

    return apiSuccess({ message: 'Đã xóa' });
  } catch (error) {
    logError('Failed to delete recurring task', error);
    return apiError('Không thể xóa công việc lặp lại', 500);
  }
}

function mapPriority(priority: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' {
  const map: Record<string, 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'> = {
    'Thấp': 'LOW', 'low': 'LOW', 'LOW': 'LOW',
    'Trung bình': 'MEDIUM', 'medium': 'MEDIUM', 'MEDIUM': 'MEDIUM',
    'Cao': 'HIGH', 'high': 'HIGH', 'HIGH': 'HIGH',
    'Khẩn cấp': 'URGENT', 'urgent': 'URGENT', 'URGENT': 'URGENT',
  };
  return map[priority] || 'MEDIUM';
}
