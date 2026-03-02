import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiSuccessCached, apiError } from '@/lib/api-utils'
import { generateIdWithPrefix } from '@/lib/id-generator'

const SETTING_KEY = 'role-settings'
const SETTING_GROUP = 'hrm'

// GET /api/settings/roles - Get role settings
export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    if (!setting) {
      return apiSuccessCached({ data: null })
    }

    return apiSuccessCached({ data: setting.value })
  } catch (error) {
    console.error('Error fetching role settings:', error)
    return apiError('Failed to fetch role settings', 500)
  }
}

// PUT /api/settings/roles - Update role settings
export async function PUT(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  let body: { roles: unknown }
  try {
    body = await request.json()
  } catch {
    return apiError('Invalid JSON body', 400)
  }

  if (!body.roles || !Array.isArray(body.roles)) {
    return apiError('roles array is required', 400)
  }

  try {
    const setting = await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      update: {
        value: body.roles as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        systemId: await generateIdWithPrefix('SET_ROLE', prisma),
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'hrm',
        value: body.roles as Prisma.InputJsonValue,
        description: 'Role permissions settings',
      },
    })

    return apiSuccess({ data: setting.value })
  } catch (error) {
    console.error('Error saving role settings:', error)
    return apiError('Failed to save role settings', 500)
  }
}
