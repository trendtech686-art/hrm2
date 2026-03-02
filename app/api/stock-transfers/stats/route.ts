/**
 * API Route: GET /api/stock-transfers/stats
 * Returns stock transfer statistics
 */

import { NextResponse } from 'next/server';
import { getStockTransferStats } from '@/lib/data/stock-transfers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId') || undefined;
    
    const stats = await getStockTransferStats(branchId);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stock transfer stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock transfer stats' },
      { status: 500 }
    );
  }
}
