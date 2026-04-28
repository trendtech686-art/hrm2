/**
 * GET /api/shipments/carriers - Get unique carrier names
 * Lightweight endpoint for filter dropdown
 */

import { prisma } from '@/lib/prisma';
import { apiHandler } from '@/lib/api-handler';
import { apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'

export const GET = apiHandler(async () => {
  try {
    const results = await prisma.shipment.findMany({
      select: { carrier: true },
      distinct: ['carrier'],
      where: { carrier: { not: '' } },
      orderBy: { carrier: 'asc' },
    });

    const carriers = results.map(r => r.carrier).filter(Boolean);
    return apiSuccess(carriers);
  } catch (error) {
    logError('Error fetching carriers', error);
    return apiError('Không thể tải danh sách hãng vận chuyển', 500);
  }
}, {
  rateLimit: { max: 30, windowMs: 60_000 }
})
