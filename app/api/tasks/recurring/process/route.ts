import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, apiSuccess, apiError } from '@/lib/api-utils';
import { generateNextIdsWithTx } from '@/lib/id-system';
import { logError } from '@/lib/logger';

// POST - Process recurring tasks (create scheduled task instances)
export async function POST(_request: NextRequest) {
  const result = await requirePermission('edit_tasks');
  if (result instanceof NextResponse) return result;

  try {
    const now = new Date();
    let created = 0;

    const recurringTasks = await prisma.recurringTask.findMany({
      where: {
        isActive: true,
        isPaused: false,
        isDeleted: false,
      },
    });

    for (const rt of recurringTasks) {
      const nextOccurrence = rt.nextOccurrenceDate;
      if (!nextOccurrence) continue;

      // Check if we should create the task (accounting for createDaysBefore)
      const createDate = new Date(nextOccurrence);
      createDate.setDate(createDate.getDate() - (rt.createDaysBefore || 0));

      if (createDate > now) continue;

      // Calculate due date based on duration
      const startDate = new Date(nextOccurrence);
      const dueDate = new Date(nextOccurrence);
      dueDate.setDate(dueDate.getDate() + (rt.durationDays || 1));

      // Create a new task from this recurring definition
      const task = await prisma.$transaction(async (tx) => {
        const { systemId, businessId: id } = await generateNextIdsWithTx(tx, 'internal-tasks');

        const assignees = rt.assignees as Array<{ employeeSystemId: string }> | null;
        const primaryAssignee = assignees?.[0]?.employeeSystemId || rt.assigneeSystemId;

        return tx.task.create({
          data: {
            systemId,
            id,
            title: rt.title,
            description: rt.description,
            assigneeId: primaryAssignee,
            creatorId: rt.createdBy || rt.assignerId || 'SYSTEM',
            status: 'TODO',
            priority: rt.priority,
            startDate,
            dueDate,
            estimatedHours: rt.estimatedHours,
            assignees: rt.assignees as unknown as undefined,
            assignerId: rt.assignerId,
            assignerName: rt.assignerName,
            createdBy: 'SYSTEM',
          },
        });
      });

      // Calculate next occurrence
      const pattern = rt.recurrencePattern as { frequency: string; interval: number };
      const nextDate = calculateNextDate(nextOccurrence, pattern);

      // Update the recurring task tracking
      const existingIds = (rt.createdTaskIds as string[]) || [];
      await prisma.recurringTask.update({
        where: { systemId: rt.systemId },
        data: {
          lastCreatedDate: now,
          nextOccurrenceDate: nextDate,
          occurrenceCount: rt.occurrenceCount + 1,
          createdTaskIds: [...existingIds, task.systemId],
        },
      });

      created++;
    }

    return apiSuccess({ created });
  } catch (error) {
    logError('Failed to process recurring tasks', error);
    return apiError('Không thể xử lý công việc lặp lại', 500);
  }
}

function calculateNextDate(
  fromDate: Date,
  pattern: { frequency: string; interval: number }
): Date {
  const next = new Date(fromDate);
  const interval = pattern.interval || 1;

  switch (pattern.frequency) {
    case 'daily':
      next.setDate(next.getDate() + interval);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7 * interval);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + interval);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + interval);
      break;
  }

  return next;
}
