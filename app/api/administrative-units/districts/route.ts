import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { nanoid } from 'nanoid'

// Reference data — rarely changes, cache aggressively

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

    const response = apiSuccess({
      data: districts,
      count: districts.length,
    });
    response.headers.set('Cache-Control', 'private, no-cache');
    return response;
  } catch (error) {
    logError('Failed to fetch districts', error);
    return apiError('Không thể tải danh sách quận/huyện', 500);
  }
}

/**
 * POST /api/administrative-units/districts
 * Create a new district
 */
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) {
    return apiError('Unauthorized', 401)
  }

  try {
    const body = await request.json()
    const { id, name, provinceId, level = '3-level' } = body

    if (!id || !name || !provinceId) {
      return apiError('Mã, tên và tỉnh thành là bắt buộc', 400)
    }

    const district = await prisma.district.create({
      data: {
        systemId: nanoid(),
        id: typeof id === 'string' ? parseInt(id, 10) : id,
        name,
        provinceId,
        level,
        createdBy: session.user?.id,
      },
    })

    await createActivityLog({
      entityType: 'district',
      entityId: district.systemId,
      action: `Tạo quận/huyện "${name}"`,
      actionType: 'create',
      metadata: { userName: session.user?.name, provinceId },
      createdBy: session.user?.id,
    })

    return apiSuccess(district, 201)
  } catch (error) {
    logError('Failed to create district', error)
    return apiError('Không thể tạo quận/huyện', 500)
  }
}
