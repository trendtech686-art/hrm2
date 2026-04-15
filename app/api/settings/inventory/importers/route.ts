import { prisma } from '@/lib/prisma'
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

const TYPE = 'importer'

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || undefined

    const where: { type: string; isDeleted: boolean; OR?: { name?: { contains: string; mode: 'insensitive' }; id?: { contains: string; mode: 'insensitive' } }[] } = { type: TYPE, isDeleted: false }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ]
    }

    const data = await prisma.settingsData.findMany({ where, orderBy: [{ name: 'asc' }] })
    // Merge metadata vào top-level để UI nhận address, origin, phone, email...
    const result = data.map(item => {
      const { metadata, ...rest } = item
      return { ...rest, ...(metadata as Record<string, unknown> || {}) }
    })
    return apiSuccess(result)
  } catch (error) {
    logError('[importers] GET error', error)
    return apiError('Failed to fetch importers', 500)
  }
}

export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()
    const { id, name, description, isDefault = false, isActive = true, ...extraFields } = body || {}
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
        metadata: Object.keys(extraFields).length > 0 ? extraFields : {},
        createdBy: session.user.id,
        updatedBy: session.user.id,
      },
    })

    createActivityLog({
      entityType: 'importer',
      entityId: created.systemId,
      action: `Thêm nhà nhập khẩu: ${name}`,
      actionType: 'create',
      createdBy: session.user?.id,
    }).catch(e => logError('Failed to create activity log', e))

    // Merge metadata vào response
    const { metadata: createdMeta, ...createdRest } = created
    return apiSuccess({ ...createdRest, ...(createdMeta as Record<string, unknown> || {}) }, 201)
  } catch (error) {
    logError('[importers] POST error', error)
    return apiError('Failed to create importer', 500)
  }
}
