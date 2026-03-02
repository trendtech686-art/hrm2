/**
 * API Route: GET /api/warranties/stats
 * Returns warranty statistics
 */

import { NextResponse } from 'next/server';
import { getWarrantyStats } from '@/lib/data/warranty';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId') || undefined;
    
    const stats = await getWarrantyStats(branchId);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching warranty stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch warranty stats' },
      { status: 500 }
    );
  }
}
