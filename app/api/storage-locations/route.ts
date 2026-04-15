import { prisma } from '@/lib/prisma'
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

const TYPE = 'storage-location'

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(1000, Math.max(1, parseInt(searchParams.get('limit') || '1000')))
    const search = searchParams.get('search') || undefined
    const branchId = searchParams.get('branchId') || undefined
    const isActiveParam = searchParams.get('isActive')
    const isActive = isActiveParam === null ? undefined : isActiveParam === 'true'
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'

    const where: { type: string; isDeleted: boolean; branchId?: string; isActive?: boolean; OR?: { name?: { contains: string; mode: 'insensitive' }; id?: { contains: string; mode: 'insensitive' } }[] } = { type: TYPE, isDeleted: false }
    if (branchId) where.branchId = branchId
    if (isActive !== undefined) where.isActive = isActive
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [raw, total] = await Promise.all([
      prisma.settingsData.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.settingsData.count({ where }),
    ])

    const data = raw.map(item => ({
      ...item,
      ...(item.metadata as Record<string, unknown> | null | undefined || {}),
    }))

    return apiSuccess({ data, total, page, pageSize: limit })
  } catch (error) {
    logError('Error fetching storage locations', error)
    return apiError('Failed to fetch storage locations', 500)
  }
}

export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()
    const { id, name, description, branchId, isDefault = false, isActive = true } = body || {}
    if (!id || !name) return apiError('id and name are required', 400)

    const created = await prisma.settingsData.create({
      data: {
        id,
        name,
        description,
        type: TYPE,
        isDefault,
        isActive,
        isDeleted: false,
        metadata: branchId ? { branchId } : {},
        createdBy: session.user.id,
        updatedBy: session.user.id,
      },
    })

    createActivityLog({
      entityType: 'storage_location',
      entityId: created.systemId,
      action: `Thêm điểm lưu kho: ${name}`,
      actionType: 'create',
      createdBy: session.user?.id,
    }).catch(e => logError('Failed to create activity log', e))

    return apiSuccess({ ...created, ...(created.metadata as Record<string, unknown> | null | undefined || {}) }, 201)
  } catch (error) {
    logError('Error creating storage location', error)
    return apiError('Failed to create storage location', 500)
  }
}
