/**
 * API Route: GET /api/employees/stats
 * Returns employee statistics
 */

import { NextResponse } from 'next/server';
import { getEmployeeStats } from '@/lib/data/employees';

export async function GET() {
  try {
    const stats = await getEmployeeStats();
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching employee stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employee stats' },
      { status: 500 }
    );
  }
}
