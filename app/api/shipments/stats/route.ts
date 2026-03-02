/**
 * API Route: GET /api/shipments/stats
 * Returns shipment statistics
 */

import { NextResponse } from 'next/server';
import { getShipmentStats } from '@/lib/data/shipments';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId') || undefined;
    
    const stats = await getShipmentStats(branchId);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching shipment stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipment stats' },
      { status: 500 }
    );
  }
}
