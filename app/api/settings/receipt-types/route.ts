import { prisma } from '@/lib/prisma'
import { apiError, apiSuccess, requireAuth, parsePagination } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

const TYPE = 'receipt-type'

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
    const isActiveParam = searchParams.get('isActive')
    const isBusinessResultParam = searchParams.get('isBusinessResult')

    const where: { type: string; isDeleted: boolean; isActive?: boolean; metadata?: { path: string[]; equals: boolean } } = { type: TYPE, isDeleted: false }
    if (isActiveParam !== null) where.isActive = isActiveParam === 'true'
    if (isBusinessResultParam !== null) {
      where.metadata = { path: ['isBusinessResult'], equals: isBusinessResultParam === 'true' }
    }

    const [rows, total] = await Promise.all([
      prisma.settingsData.findMany({
        where,
        orderBy: [{ id: 'asc' }],
        skip,
        take: limit,
      }),
      prisma.settingsData.count({ where }),
    ])

    const data = rows.map(r => mapRecord(r as unknown as SettingsDataRecord))
    return apiSuccess({ data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch (error) {
    logError('[receipt-types] GET error', error)
    return apiError('Failed to fetch receipt types', 500)
  }
}

export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()
    const { id, name, description, isBusinessResult = false, isActive = true, isDefault = false, color } = body || {}
    if (!id || !name) return apiError('id and name are required', 400)

    const created = await prisma.settingsData.create({
      data: {
        id,
        name,
        description,
        type: TYPE,
        isActive,
        isDefault,
        metadata: { isBusinessResult, ...(color ? { color } : {}) },
        createdBy: session.user.id,
        updatedBy: session.user.id,
      },
    })

    createActivityLog({
      entityType: 'receipt_type',
      entityId: created.systemId,
      action: `Thêm loại phiếu thu: ${name}`,
      actionType: 'create',
      createdBy: session.user?.id,
    }).catch(e => logError('[receipt-types] activity log failed', e))

    return apiSuccess({ data: mapRecord(created as unknown as SettingsDataRecord) }, 201)
  } catch (error: unknown) {
    logError('[receipt-types] POST error', error)
    const errorMessage = error instanceof Error ? error.message : undefined;
    return apiError('Failed to create receipt type', 500, errorMessage)
  }
}
