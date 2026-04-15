/**
 * API Route: GET /api/inventory-checks/stats
 * Returns inventory check statistics
 */

import { getInventoryCheckStats } from '@/lib/data/inventory-checks';
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId') || undefined;
    
    const stats = await getInventoryCheckStats(branchId);
    
    return apiSuccess(stats);
  } catch (error) {
    logError('Error fetching inventory check stats', error);
    return apiError('Lỗi khi lấy thống kê kiểm kê', 500);
  }
}
