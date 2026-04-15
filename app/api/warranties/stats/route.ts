/**
 * API Route: GET /api/warranties/stats
 * Returns warranty statistics
 */

import { getWarrantyStats } from '@/lib/data/warranty';
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Chưa được xác thực', 401)

  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId') || undefined;
    
    const stats = await getWarrantyStats(branchId);
    
    return apiSuccess(stats);
  } catch (error) {
    logError('Error fetching warranty stats', error);
    return apiError('Không thể tải thống kê bảo hành', 500);
  }
}
