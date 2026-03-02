import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parsePagination } from '@/lib/api-utils';

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
 * 
 * Note: No auth required - this is public reference data
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provinceId = searchParams.get('provinceId');
    const districtId = searchParams.get('districtId');
    const level = searchParams.get('level');
    const { page, limit, skip } = parsePagination(searchParams);

    const where = {
      isDeleted: false,
      ...(provinceId && { provinceId }),
      ...(districtId && { districtId: parseInt(districtId, 10) }),
      ...(level && { level }),
    };

    const [wards, total] = await Promise.all([
      prisma.ward.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
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
      }),
      prisma.ward.count({ where }),
    ]);

    return NextResponse.json({
      data: wards,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch wards:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải danh sách phường/xã' },
      { status: 500 }
    );
  }
}
