import { prisma } from '@/lib/prisma'
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils'

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
    return apiSuccess(data)
  } catch (error) {
    console.error('[importers] GET error:', error)
    return apiError('Failed to fetch importers', 500)
  }
}

export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()
    const { id, name, description, isDefault = false, isActive = true } = body || {}
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
        metadata: {},
        createdBy: session.user.id,
        updatedBy: session.user.id,
      },
    })

    return apiSuccess(created, 201)
  } catch (error) {
    console.error('[importers] POST error:', error)
    return apiError('Failed to create importer', 500)
  }
}
