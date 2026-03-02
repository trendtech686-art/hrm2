/**
 * API Route: GET /api/tasks/dashboard-stats
 * Returns comprehensive task dashboard statistics — computed server-side.
 * No client-side data loading needed for metrics.
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const { searchParams } = new URL(request.url);
  const createdFrom = searchParams.get('createdFrom');

  try {
    // Date filter for all queries
    const dateFilter: Prisma.TaskWhereInput = {};
    if (createdFrom) {
      dateFilter.createdAt = { gte: new Date(createdFrom) };
    }

    // 1. Count by status — parallel queries
    const [
      todoCount,
      inProgressCount,
      reviewCount,
      doneCount,
      cancelledCount,
      overdueCount,
      highPriorityCount,
      total,
    ] = await Promise.all([
      prisma.task.count({ where: { ...dateFilter, status: 'TODO' } }),
      prisma.task.count({ where: { ...dateFilter, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { ...dateFilter, status: 'REVIEW' } }),
      prisma.task.count({ where: { ...dateFilter, status: 'DONE' } }),
      prisma.task.count({ where: { ...dateFilter, status: 'CANCELLED' } }),
      prisma.task.count({
        where: {
          ...dateFilter,
          status: { notIn: ['DONE', 'CANCELLED'] },
          dueDate: { lt: new Date() },
        },
      }),
      prisma.task.count({
        where: {
          ...dateFilter,
          priority: { in: ['HIGH', 'URGENT'] },
          status: { notIn: ['DONE', 'CANCELLED'] },
        },
      }),
      prisma.task.count({ where: dateFilter }),
    ]);

    // 2. On-time rate — fetch completed tasks with dates (minimal fields)
    const completedWithDates = await prisma.task.findMany({
      where: {
        ...dateFilter,
        status: 'DONE',
        dueDate: { not: null },
        completedAt: { not: null },
      },
      select: {
        dueDate: true,
        completedAt: true,
      },
    });

    const completedOnTime = completedWithDates.filter(
      (t) => t.completedAt! <= t.dueDate!
    ).length;
    const onTimeRate =
      completedWithDates.length > 0
        ? Math.round((completedOnTime / completedWithDates.length) * 100)
        : 0;

    // 3. Avg completion days
    const completedWithStartDates = await prisma.task.findMany({
      where: {
        ...dateFilter,
        status: 'DONE',
        startDate: { not: null },
        completedAt: { not: null },
      },
      select: {
        startDate: true,
        completedAt: true,
      },
    });

    const avgCompletionDays =
      completedWithStartDates.length > 0
        ? Math.round(
            completedWithStartDates.reduce((sum, t) => {
              const days =
                (t.completedAt!.getTime() - t.startDate!.getTime()) /
                (1000 * 60 * 60 * 24);
              return sum + days;
            }, 0) / completedWithStartDates.length
          )
        : 0;

    // 4. Workload by assignee — group by assigneeId with status breakdown
    const assigneeTasks = await prisma.task.findMany({
      where: {
        ...dateFilter,
        assigneeId: { not: null },
      },
      select: {
        assigneeId: true,
        status: true,
        dueDate: true,
        employees_tasks_assigneeIdToemployees: {
          select: { fullName: true },
        },
      },
    });

    const workloadMap = new Map<
      string,
      { name: string; total: number; inProgress: number; completed: number; overdue: number }
    >();

    const now = new Date();
    for (const task of assigneeTasks) {
      const aid = task.assigneeId!;
      if (!workloadMap.has(aid)) {
        workloadMap.set(aid, {
          name: task.employees_tasks_assigneeIdToemployees?.fullName || 'N/A',
          total: 0,
          inProgress: 0,
          completed: 0,
          overdue: 0,
        });
      }
      const w = workloadMap.get(aid)!;
      w.total++;
      if (task.status === 'IN_PROGRESS') w.inProgress++;
      if (task.status === 'DONE') w.completed++;
      if (
        task.dueDate &&
        task.dueDate < now &&
        task.status !== 'DONE' &&
        task.status !== 'CANCELLED'
      ) {
        w.overdue++;
      }
    }

    const byAssignee = Array.from(workloadMap.entries())
      .map(([assigneeId, data]) => ({ assigneeId, ...data }))
      .sort((a, b) => b.total - a.total);

    const completionRate =
      total > 0 ? Math.round((doneCount / total) * 100) : 0;

    return apiSuccess({
      total,
      byStatus: {
        notStarted: todoCount,
        inProgress: inProgressCount,
        review: reviewCount,
        completed: doneCount,
        cancelled: cancelledCount,
      },
      overdue: overdueCount,
      highPriority: highPriorityCount,
      onTimeRate,
      avgCompletionDays,
      completionRate,
      byAssignee,
    });
  } catch (error) {
    console.error('[Tasks Dashboard Stats] GET error:', error);
    return apiError('Không thể tải thống kê công việc', 500);
  }
}
