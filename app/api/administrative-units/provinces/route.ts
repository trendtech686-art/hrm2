import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/administrative-units/provinces
 * 
 * Query params:
 * - level: Filter by level ('2-level' | '3-level')
 * 
 * Returns provinces (34 for 2-level, 63 for 3-level)
 * 
 * Note: No auth required - this is public reference data
 */
export async function GET(request: NextRequest) {

  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');

    const provinces = await prisma.province.findMany({
      where: { 
        isDeleted: false,
        ...(level && { level }),
      },
      orderBy: { name: 'asc' },
      select: {
        systemId: true,
        id: true,
        name: true,
        level: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: provinces,
      count: provinces.length,
    });
  } catch (error) {
    console.error('Failed to fetch provinces:', error instanceof Error ? error.message : error);
    console.error('Stack:', error instanceof Error ? error.stack : 'no stack');
    return NextResponse.json(
      { success: false, error: 'Không thể tải danh sách tỉnh thành', details: String(error) },
      { status: 500 }
    );
  }
}
