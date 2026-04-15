import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger'
import { requireAuth } from '@/lib/api-utils'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { nanoid } from 'nanoid'

// Reference data — rarely changes, cache aggressively

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

    const response = NextResponse.json({
      success: true,
      data: provinces,
      count: provinces.length,
    });
    response.headers.set('Cache-Control', 'private, no-cache');
    return response;
  } catch (error) {
    logError('Failed to fetch provinces', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải danh sách tỉnh thành', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/administrative-units/provinces
 * Create a new province
 */
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, name, level = '2-level' } = body

    if (!id || !name) {
      return NextResponse.json({ success: false, error: 'Mã và tên tỉnh thành là bắt buộc' }, { status: 400 })
    }

    const province = await prisma.province.create({
      data: {
        systemId: nanoid(),
        id,
        name,
        level,
        createdBy: session.user?.id,
      },
    })

    await createActivityLog({
      entityType: 'province',
      entityId: province.systemId,
      action: `Tạo tỉnh/thành "${name}" (${id})`,
      actionType: 'create',
      metadata: { userName: session.user?.name },
      createdBy: session.user?.id,
    })

    return NextResponse.json({ success: true, data: province })
  } catch (error) {
    logError('Failed to create province', error)
    return NextResponse.json({ success: false, error: 'Không thể tạo tỉnh thành' }, { status: 500 })
  }
}
