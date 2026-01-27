import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/administrative-units/districts
 * 
 * Query params:
 * - provinceId: Filter by province ID
 * - level: Filter by level ('2-level' | '3-level')
 * 
 * Returns districts (691 for 3-level, 0 for 2-level)
 * 
 * Note: No auth required - this is public reference data
 */
export async function GET(request: NextRequest) {

  try {
    const { searchParams } = new URL(request.url);
    const provinceId = searchParams.get('provinceId');
    const level = searchParams.get('level');

    const districts = await prisma.district.findMany({
      where: {
        isDeleted: false,
        ...(provinceId && { provinceId }),
        ...(level && { level }),
      },
      orderBy: { name: 'asc' },
      select: {
        systemId: true,
        id: true,
        name: true,
        provinceId: true,
        level: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: districts,
      count: districts.length,
    });
  } catch (error) {
    console.error('Failed to fetch districts:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải danh sách quận/huyện' },
      { status: 500 }
    );
  }
}
