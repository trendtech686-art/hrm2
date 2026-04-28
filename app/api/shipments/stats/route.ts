/**
 * API Route: GET /api/shipments/stats
 * Returns shipment statistics
 */

import { getShipmentStats } from '@/lib/data/shipments';
import { apiHandler } from '@/lib/api-handler';
import { apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'

export const GET = apiHandler(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId') || undefined;
    
    const stats = await getShipmentStats(branchId);
    
    return apiSuccess(stats);
  } catch (error) {
    logError('Error fetching shipment stats', error);
    return apiError('Không thể tải thống kê vận đơn', 500);
  }
}, {
  rateLimit: { max: 30, windowMs: 60_000 }
})
