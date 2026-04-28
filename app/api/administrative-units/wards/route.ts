import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parsePagination, requireAuth, apiSuccess, apiError, apiPaginated } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { nanoid } from 'nanoid'

// Reference data — rarely changes, cache aggressively

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

    const response = apiPaginated(wards, { page, limit, total });
    response.headers.set('Cache-Control', 'private, no-cache');
    return response;
  } catch (error) {
    logError('Failed to fetch wards', error);
    return apiError('Không thể tải danh sách phường/xã', 500);
  }
}

/**
 * POST /api/administrative-units/wards
 * Create a new ward
 */
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) {
    return apiError('Unauthorized', 401)
  }

  try {
    const body = await request.json()
    const { id, name, provinceId, provinceName, districtId, districtName, level = '2-level' } = body

    if (!id || !name || !provinceId) {
      return apiError('Mã, tên và tỉnh thành là bắt buộc', 400)
    }

    const ward = await prisma.ward.create({
      data: {
        systemId: nanoid(),
        id,
        name,
        provinceId,
        provinceName: provinceName || null,
        districtId: districtId ? (typeof districtId === 'string' ? parseInt(districtId, 10) : districtId) : null,
        districtName: districtName || null,
        level,
        createdBy: session.user?.id,
      },
    })

    await createActivityLog({
      entityType: 'ward',
      entityId: ward.systemId,
      action: `Tạo phường/xã "${name}"`,
      actionType: 'create',
      metadata: { userName: session.user?.name, provinceId },
      createdBy: session.user?.id,
    })

    return apiSuccess(ward, 201)
  } catch (error) {
    logError('Failed to create ward', error)
    return apiError('Không thể tạo phường/xã', 500)
  }
}
