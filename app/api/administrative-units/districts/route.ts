import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiError } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

/**
 * GET /api/administrative-units/districts
 * 
 * Query params:
 * - provinceId: Filter by province ID
 * 
 * Returns districts (~624 total, or filtered by province)
 */
export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Vui lòng đăng nhập', 401);

  try {
    const { searchParams } = new URL(request.url);
    const provinceId = searchParams.get('provinceId');

    const districts = await prisma.district.findMany({
      where: {
        isDeleted: false,
        ...(provinceId && { provinceId }),
      },
      orderBy: { name: 'asc' },
      select: {
        systemId: true,
        id: true,
        name: true,
        provinceId: true,
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
