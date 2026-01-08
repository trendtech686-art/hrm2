import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiError } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

/**
 * GET /api/administrative-units/provinces
 * 
 * Returns all provinces (34 provinces)
 */
export async function GET() {
  const session = await requireAuth();
  if (!session) return apiError('Vui lòng đăng nhập', 401);

  try {
    const provinces = await prisma.province.findMany({
      where: { isDeleted: false },
      orderBy: { name: 'asc' },
      select: {
        systemId: true,
        id: true,
        name: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: provinces,
      count: provinces.length,
    });
  } catch (error) {
    console.error('Failed to fetch provinces:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải danh sách tỉnh thành' },
      { status: 500 }
    );
  }
}
