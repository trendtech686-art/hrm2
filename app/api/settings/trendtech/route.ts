import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { trendtechSettingsSchema } from './validation'

const SETTING_KEY = 'trendtech-settings'
const SETTING_GROUP = 'integrations'

// GET /api/settings/trendtech
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
      return apiSuccess({ data: null })
    }

    return apiSuccess({ data: setting.value })
  } catch (error) {
    console.error('Error fetching trendtech settings:', error)
    return apiError('Failed to fetch trendtech settings', 500)
  }
}

// PUT /api/settings/trendtech
export async function PUT(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, trendtechSettingsSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const settings = validation.data

  try {
    // Get existing to merge
    const existing = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    const mergedValue = {
      ...((existing?.value as object) || {}),
      ...settings,
    }

    const setting = await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      update: {
        value: mergedValue as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        systemId: `SET_TREND_${Date.now()}`,
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'integrations',
        value: mergedValue as Prisma.InputJsonValue,
        description: 'Trendtech integration settings',
      },
    })

    return apiSuccess({ data: setting.value })
  } catch (error) {
    console.error('Error saving trendtech settings:', error)
    return apiError('Failed to save trendtech settings', 500)
  }
}
