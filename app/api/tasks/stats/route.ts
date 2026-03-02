/**
 * API Route: GET /api/tasks/stats
 * Returns task statistics
 */

import { NextResponse } from 'next/server';
import { getTaskStats } from '@/lib/data/tasks';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || undefined;
    
    const stats = await getTaskStats(userId);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching task stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task stats' },
      { status: 500 }
    );
  }
}
