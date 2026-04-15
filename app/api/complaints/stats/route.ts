/**
 * API Route: GET /api/complaints/stats
 * Returns complaint statistics
 */

import { getComplaintStats } from '@/lib/data/complaints';
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Chưa được xác thực', 401)

  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId') || undefined;
    
    const stats = await getComplaintStats(branchId);
    
    return apiSuccess(stats);
  } catch (error) {
    logError('Error fetching complaint stats', error);
    return apiError('Không thể tải thống kê khiếu nại', 500);
  }
}
