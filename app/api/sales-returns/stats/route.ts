/**
 * Sales Returns Stats API Route
 * 
 * GET /api/sales-returns/stats - Get sales return statistics
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';
import { SalesReturnStatus } from '@/generated/prisma/client';
import { logError } from '@/lib/logger'

export async function GET(_request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    // Get counts by status
    const [total, pending, approved, completed, rejected, received] = await Promise.all([
      prisma.salesReturn.count(),
      prisma.salesReturn.count({ where: { status: SalesReturnStatus.PENDING } }),
      prisma.salesReturn.count({ where: { status: SalesReturnStatus.APPROVED } }),
      prisma.salesReturn.count({ where: { status: SalesReturnStatus.COMPLETED } }),
      prisma.salesReturn.count({ where: { status: SalesReturnStatus.REJECTED } }),
      prisma.salesReturn.count({ where: { isReceived: true } }),
    ]);

    // Calculate total value
    const totalValueResult = await prisma.salesReturn.aggregate({
      _sum: {
        total: true,
      },
    });

    const totalValue = Number(totalValueResult._sum.total || 0);

    // Calculate pending value
    const pendingValueResult = await prisma.salesReturn.aggregate({
      where: { status: SalesReturnStatus.PENDING },
      _sum: {
        total: true,
      },
    });

    const pendingValue = Number(pendingValueResult._sum.total || 0);

    return apiSuccess({
      total,
      pending,
      approved,
      completed,
      rejected,
      received,
      totalValue,
      pendingValue,
    });
  } catch (error) {
    logError('[Sales Returns Stats API] GET error', error);
    return apiError('Không thể tải thống kê trả hàng', 500);
  }
}
