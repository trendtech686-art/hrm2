/**
 * API Route: GET /api/complaints/stats
 * Returns complaint statistics
 */

import { NextResponse } from 'next/server';
import { getComplaintStats } from '@/lib/data/complaints';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId') || undefined;
    
    const stats = await getComplaintStats(branchId);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching complaint stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaint stats' },
      { status: 500 }
    );
  }
}
