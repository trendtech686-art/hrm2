/**
 * API Route: GET /api/stock-transfers/stats
 * Returns stock transfer statistics
 */

import { getStockTransferStats } from '@/lib/data/stock-transfers';
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId') || undefined;
    
    const stats = await getStockTransferStats(branchId);
    
    return apiSuccess(stats);
  } catch (error) {
    logError('Error fetching stock transfer stats', error);
    return apiError('Lỗi khi lấy thống kê chuyển kho', 500);
  }
}
