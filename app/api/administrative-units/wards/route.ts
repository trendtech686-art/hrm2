import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/administrative-units/wards
 * 
 * Query params:
 * - provinceId: Filter by province ID
 * - districtId: Filter by district ID (for 3-level wards)
 * - level: Filter by level ('2-level' | '3-level')
 * - limit: Max results (default 1000)
 * 
 * Returns wards (~10,000+ total, filtered by params)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provinceId = searchParams.get('provinceId');
    const districtId = searchParams.get('districtId');
    const level = searchParams.get('level');
    const limit = parseInt(searchParams.get('limit') || '1000', 10);

    const wards = await prisma.ward.findMany({
      where: {
        isDeleted: false,
        ...(provinceId && { provinceId }),
        ...(districtId && { districtId: parseInt(districtId, 10) }),
        ...(level && { level }),
      },
      orderBy: { name: 'asc' },
      take: limit,
      select: {
        systemId: true,
        id: true,
        name: true,
        provinceId: true,
        provinceName: true,
        districtId: true,
        districtName: true,
        level: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: wards,
      count: wards.length,
    });
  } catch (error) {
    console.error('Failed to fetch wards:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wards' },
      { status: 500 }
    );
  }
}
