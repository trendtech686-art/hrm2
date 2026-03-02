/**
 * Payroll Stats API
 *
 * GET /api/payroll/stats — Lightweight aggregation for summary cards
 *
 * Returns:
 *  - currentMonthTotal: total net payroll for current month
 *  - draftCount: number of DRAFT batches
 *  - reviewedCount: number of PROCESSING (reviewed) batches
 *  - previousMonthLocked: whether previous month has a locked batch
 *  - currentMonthKey: "YYYY-MM"
 *  - previousMonthKey: "YYYY-MM"
 */

import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';

export async function GET() {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-indexed
    const prevDate = new Date(currentYear, currentMonth - 2, 1); // month - 2 because JS is 0-indexed
    const prevYear = prevDate.getFullYear();
    const prevMonth = prevDate.getMonth() + 1;

    const currentMonthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    const previousMonthKey = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;

    // Run all queries in parallel
    const [currentMonthAgg, draftCount, reviewedCount, previousMonthLocked] = await Promise.all([
      // Sum totalNet for current month
      prisma.payroll.aggregate({
        where: { year: currentYear, month: currentMonth },
        _sum: { totalNet: true },
      }),
      // Count DRAFT batches
      prisma.payroll.count({ where: { status: 'DRAFT' } }),
      // Count PROCESSING (reviewed) batches
      prisma.payroll.count({ where: { status: 'PROCESSING' } }),
      // Check if previous month has any COMPLETED/PAID (locked) batch
      prisma.payroll.count({
        where: {
          year: prevYear,
          month: prevMonth,
          status: { in: ['COMPLETED', 'PAID'] },
        },
      }),
    ]);

    return apiSuccess({
      currentMonthTotal: Number(currentMonthAgg._sum.totalNet ?? 0),
      draftCount,
      reviewedCount,
      previousMonthLocked: previousMonthLocked > 0,
      currentMonthKey,
      previousMonthKey,
    });
  } catch (error) {
    console.error('[Payroll Stats API] GET error:', error);
    return apiError('Failed to fetch payroll stats', 500);
  }
}
