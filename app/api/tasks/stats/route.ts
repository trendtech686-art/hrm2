/**
 * API Route: GET /api/tasks/stats
 * Returns task statistics
 */

import { NextResponse } from 'next/server';
import { getTaskStats } from '@/lib/data/tasks';
import { requirePermission, apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

export async function GET(request: Request) {
  const result = await requirePermission('view_tasks')
  if (result instanceof NextResponse) return result

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || undefined;
    
    const stats = await getTaskStats(userId);
    
    return apiSuccess(stats);
  } catch (error) {
    logError('Error fetching task stats', error);
    return apiError('Không thể tải thống kê công việc', 500);
  }
}
