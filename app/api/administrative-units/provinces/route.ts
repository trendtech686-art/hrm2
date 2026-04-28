import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
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

    const response = apiSuccess({
      data: provinces,
      count: provinces.length,
    });
    response.headers.set('Cache-Control', 'private, no-cache');
    return response;
  } catch (error) {
    logError('Failed to fetch provinces', error);
    return apiError('Không thể tải danh sách tỉnh thành', 500);
  }
}

/**
 * POST /api/administrative-units/provinces
 * Create a new province
 */
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) {
    return apiError('Unauthorized', 401)
  }

  try {
    const body = await request.json()
    const { id, name, level = '2-level' } = body

    if (!id || !name) {
      return apiError('Mã và tên tỉnh thành là bắt buộc', 400)
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

    return apiSuccess(province, 201)
  } catch (error) {
    logError('Failed to create province', error)
    return apiError('Không thể tạo tỉnh thành', 500)
  }
}
