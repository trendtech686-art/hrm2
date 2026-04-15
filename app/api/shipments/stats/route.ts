/**
 * API Route: GET /api/shipments/stats
 * Returns shipment statistics
 */

import { NextResponse } from 'next/server';
import { getShipmentStats } from '@/lib/data/shipments';
import { requireAuth, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId') || undefined;
    
    const stats = await getShipmentStats(branchId);
    
    return NextResponse.json(stats);
  } catch (error) {
    logError('Error fetching shipment stats', error);
    return NextResponse.json(
      { error: 'Không thể tải thống kê vận đơn' },
      { status: 500 }
    );
  }
}
