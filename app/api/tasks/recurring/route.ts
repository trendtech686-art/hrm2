import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, apiSuccess, apiError } from '@/lib/api-utils';
import { generateNextIdsWithTx } from '@/lib/id-system';
import { logError } from '@/lib/logger';

// GET - List all recurring tasks
export async function GET() {
  const result = await requirePermission('view_tasks');
  if (result instanceof NextResponse) return result;

  try {
    const tasks = await prisma.recurringTask.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });

    return apiSuccess(tasks);
  } catch (error) {
    logError('Failed to fetch recurring tasks', error);
    return apiError('Không thể tải công việc lặp lại', 500);
  }
}

// POST - Create new recurring task
export async function POST(request: NextRequest) {
  const result = await requirePermission('create_tasks');
  if (result instanceof NextResponse) return result;

  try {
    const body = await request.json();

    const task = await prisma.$transaction(async (tx) => {
      const { systemId, businessId: id } = await generateNextIdsWithTx(tx, 'recurring-tasks');

      return tx.recurringTask.create({
        data: {
          systemId,
          id,
          title: body.title,
          description: body.description || null,
          assigneeSystemId: body.assigneeSystemId || body.assignees?.[0]?.employeeSystemId || null,
          assignees: body.assignees || null,
          assignerId: body.assignerId || null,
          assignerName: body.assignerName || null,
          priority: mapPriority(body.priority),
          estimatedHours: body.estimatedHours || null,
          type: body.type || null,
          recurrencePattern: body.recurrencePattern || { frequency: body.frequency || 'weekly', interval: body.interval || 1 },
          startDate: new Date(body.startDate),
          durationDays: body.durationDays || 1,
          createDaysBefore: body.createDaysBefore || 0,
          isActive: body.isActive ?? true,
          isPaused: body.isPaused ?? false,
          nextOccurrenceDate: body.nextOccurrenceDate ? new Date(body.nextOccurrenceDate) : new Date(body.startDate),
          createdBy: body.createdBy || null,
          templateId: body.templateId || null,
        },
      });
    });

    return apiSuccess(task);
  } catch (error) {
    logError('Failed to create recurring task', error);
    return apiError('Không thể tạo công việc lặp lại', 500);
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
