/**
 * Purchase Return Stats Route
 * 
 * GET /api/purchase-returns/stats
 * 
 * Returns aggregate statistics for purchase returns:
 * - Total count
 * - Total return value
 * - Total refund amount
 * - Breakdown by status
 * - Recent activity
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';
import { PurchaseReturnStatus } from '@/generated/prisma/client';

// GET - Purchase return statistics
export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const supplierId = searchParams.get('supplierId');

    // Build where clause for date filtering
    const where: Prisma.PurchaseReturnWhereInput = {};
    
    if (startDate || endDate) {
      where.returnDate = {};
      if (startDate) where.returnDate.gte = new Date(startDate);
      if (endDate) where.returnDate.lte = new Date(endDate);
    }

    if (supplierId) {
      where.supplierId = supplierId;
    }

    // Get aggregate statistics
    const [
      total,
      byStatus,
      aggregates,
      recent,
    ] = await Promise.all([
      // Total count
      prisma.purchaseReturn.count({ where }),

      // Count by status
      prisma.purchaseReturn.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),

      // Sum totals
      prisma.purchaseReturn.aggregate({
        where,
        _sum: {
          totalReturnValue: true,
          refundAmount: true,
        },
      }),

      // Recent returns (last 10)
      prisma.purchaseReturn.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          systemId: true,
          id: true,
          status: true,
          totalReturnValue: true,
          refundAmount: true,
          supplierName: true,
          returnDate: true,
          createdAt: true,
        },
      }),
    ]);

    // Format status breakdown
    const statusBreakdown = Object.values(PurchaseReturnStatus).map((status) => {
      const statusData = byStatus.find((item) => item.status === status);
      return {
        status,
        count: statusData?._count || 0,
      };
    });

    const stats = {
      total,
      totalValue: Number(aggregates._sum.totalReturnValue || 0),
      totalRefund: Number(aggregates._sum.refundAmount || 0),
      byStatus: statusBreakdown,
      recent,
    };

    return apiSuccess(stats);
  } catch (error) {
    console.error('[Purchase Returns Stats API] GET error:', error);
    return apiError('Failed to fetch purchase return stats', 500);
  }
}
