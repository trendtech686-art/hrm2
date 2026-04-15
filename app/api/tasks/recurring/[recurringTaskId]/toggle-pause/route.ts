import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger';

// POST - Toggle pause status
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ recurringTaskId: string }> }
) {
  const result = await requirePermission('edit_tasks');
  if (result instanceof NextResponse) return result;

  const { recurringTaskId } = await params;

  try {
    const existing = await prisma.recurringTask.findUnique({
      where: { systemId: recurringTaskId },
    });

    if (!existing || existing.isDeleted) {
      return apiError('Không tìm thấy công việc lặp lại', 404);
    }

    const task = await prisma.recurringTask.update({
      where: { systemId: recurringTaskId },
      data: { isPaused: !existing.isPaused },
    });

    return apiSuccess(task);
  } catch (error) {
    logError('Failed to toggle recurring task pause', error);
    return apiError('Không thể thay đổi trạng thái', 500);
  }
}
