import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { shippingSettingsSchema } from './validation'
import { generateIdWithPrefix } from '@/lib/id-generator'

const SETTING_KEY = 'shipping-settings'
const SETTING_GROUP = 'operations'

// GET /api/settings/shipping - Get shipping settings
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
    console.error('Error fetching shipping settings:', error)
    return apiError('Failed to fetch shipping settings', 500)
  }
}

// PUT /api/settings/shipping - Update shipping settings
export async function PUT(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, shippingSettingsSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const settings = validation.data

  try {
    const setting = await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      update: {
        value: settings as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        systemId: await generateIdWithPrefix('SETSHIP'),
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'operations',
        value: settings as Prisma.InputJsonValue,
        description: 'Shipping configuration settings',
      },
    })

    return apiSuccess({ data: setting.value })
  } catch (error) {
    console.error('Error saving shipping settings:', error)
    return apiError('Failed to save shipping settings', 500)
  }
}
