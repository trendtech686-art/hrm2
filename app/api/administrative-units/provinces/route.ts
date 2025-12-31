import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

/**
 * GET /api/administrative-units/provinces
 * 
 * Returns all provinces (34 provinces)
 */
export async function GET() {
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
      { success: false, error: 'Failed to fetch provinces' },
      { status: 500 }
    );
  }
}
