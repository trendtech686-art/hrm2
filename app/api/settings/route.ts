import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { createSettingSchema, bulkUpdateSettingsSchema } from './validation'

// GET /api/settings - Get all settings
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const group = searchParams.get('group')
    const key = searchParams.get('key')

    const where: Prisma.SettingWhereInput = {}

    if (group) {
      where.group = group
    }

    if (key) {
      where.key = key
    }

    const settings = await prisma.setting.findMany({
      where,
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    })

    // If single key requested, return just the value
    if (key && settings.length === 1) {
      return apiSuccess(settings[0])
    }

    // Group settings by group name
    const grouped = settings.reduce((acc: Record<string, Record<string, unknown>>, setting) => {
      if (!acc[setting.group]) {
        acc[setting.group] = {}
      }
      acc[setting.group][setting.key] = setting.value
      return acc
    }, {})

    return apiSuccess({ data: settings, grouped })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return apiError('Failed to fetch settings', 500)
  }
}

// POST /api/settings - Create or update setting
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createSettingSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const setting = await prisma.setting.upsert({
      where: {
        key_group: {
          key: body.key,
          group: body.group,
        },
      },
      update: {
        value: body.value,
        description: body.description,
      },
      create: {
        systemId: `SET${String(Date.now()).slice(-6).padStart(6, '0')}`,
        key: body.key,
        group: body.group,
        type: body.type || 'string',
        category: body.category || 'system',
        value: body.value,
        description: body.description,
      },
    })

    return apiSuccess(setting)
  } catch (error) {
    console.error('Error saving setting:', error)
    return apiError('Failed to save setting', 500)
  }
}

// PUT /api/settings - Bulk update settings
export async function PUT(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, bulkUpdateSettingsSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const results = await prisma.$transaction(
      body.settings.map((setting: { key: string; group: string; value?: unknown; description?: string; type?: string; category?: string }) =>
        prisma.setting.upsert({
          where: {
            key_group: {
              key: setting.key,
              group: setting.group,
            },
          },
          update: {
            value: setting.value as Prisma.InputJsonValue,
            description: setting.description,
          },
          create: {
            systemId: `SET${String(Date.now()).slice(-6).padStart(6, '0')}`,
            key: setting.key,
            group: setting.group,
            type: setting.type || 'string',
            category: setting.category || 'system',
            value: setting.value as Prisma.InputJsonValue,
            description: setting.description,
          },
        })
      )
    )

    return apiSuccess({ data: results })
  } catch (error) {
    console.error('Error bulk updating settings:', error)
    return apiError('Failed to update settings', 500)
  }
}