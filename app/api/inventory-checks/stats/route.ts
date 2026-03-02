/**
 * API Route: GET /api/inventory-checks/stats
 * Returns inventory check statistics
 */

import { NextResponse } from 'next/server';
import { getInventoryCheckStats } from '@/lib/data/inventory-checks';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId') || undefined;
    
    const stats = await getInventoryCheckStats(branchId);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching inventory check stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory check stats' },
      { status: 500 }
    );
  }
}
