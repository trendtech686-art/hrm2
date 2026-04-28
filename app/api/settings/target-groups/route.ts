import { prisma } from '@/lib/prisma'
import { apiError, apiSuccess, apiPaginated, requireAuth, parsePagination, validateBody } from '@/lib/api-utils'
import { API_MAX_PAGE_LIMIT } from '@/lib/pagination-constants'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { generateNextIds } from '@/lib/id-system'
import { z } from 'zod'

const TYPE = 'target-group'

const createTargetGroupSchema = z.object({
  id: z.string().min(1, 'id là bắt buộc'),
  name: z.string().min(1, 'name là bắt buộc'),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
})

interface SettingsDataRecord {
  systemId: string;
  id: string;
  name: string;
  description?: string | null;
  type: string;
  isActive: boolean;
  isDefault: boolean;
  metadata?: Record<string, unknown> | null;
  [key: string]: unknown;
}

function mapRecord(item: SettingsDataRecord) {
  const meta = (item?.metadata as Record<string, unknown> | null) || {}
  return { ...item, ...meta }
}

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const safeLimit = Math.min(limit, API_MAX_PAGE_LIMIT)
    const isActiveParam = searchParams.get('isActive')

    const where: { type: string; isDeleted: boolean; isActive?: boolean } = { type: TYPE, isDeleted: false }
    if (isActiveParam !== null) where.isActive = isActiveParam === 'true'

    const [rows, total] = await Promise.all([
      prisma.settingsData.findMany({
        where,
        orderBy: [{ id: 'asc' }],
        skip,
        take: safeLimit,
      }),
      prisma.settingsData.count({ where }),
    ])

    const data = rows.map(r => mapRecord(r as unknown as SettingsDataRecord))
    return apiPaginated(data, { page, limit, total })
  } catch (error) {
    logError('[target-groups] GET error', error)
    return apiError('Failed to fetch target groups', 500)
  }
}

export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createTargetGroupSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { id, name, description, isActive = true, isDefault = false } = body
    const { systemId, businessId } = await generateNextIds('target-groups')
    const finalId = id || businessId

    const created = await prisma.settingsData.create({
      data: {
        id: finalId,
        name,
        description,
        type: TYPE,
        isActive,
        isDefault,
        metadata: {},
        createdBy: session.user.id,
        updatedBy: session.user.id,
      },
    })

    createActivityLog({
      entityType: 'target_group',
      entityId: created.systemId,
      action: `Thêm nhóm đối tượng: ${name}`,
      actionType: 'create',
      createdBy: session.user?.id,
    }).catch(e => logError('[target-groups] activity log failed', e))

    return apiSuccess({ data: mapRecord(created as unknown as SettingsDataRecord) }, 201)
  } catch (error: unknown) {
    logError('[target-groups] POST error', error)
    const errorMessage = error instanceof Error ? error.message : undefined;
    return apiError('Failed to create target group', 500, errorMessage)
  }
}
