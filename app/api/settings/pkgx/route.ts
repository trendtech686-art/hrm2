import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { pkgxSettingsSchema } from './validation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

const SETTING_KEY = 'pkgx-settings'
const SETTING_GROUP = 'integrations'

// GET /api/settings/pkgx
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
    logError('Error fetching pkgx settings', error)
    return apiError('Failed to fetch pkgx settings', 500)
  }
}

// PUT /api/settings/pkgx
export async function PUT(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, pkgxSettingsSchema)
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
        systemId: await generateIdWithPrefix('SETPKGX'),
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'integrations',
        value: mergedValue as Prisma.InputJsonValue,
        description: 'PKGX integration settings',
      },
    })

    // Activity log — diff settings changes
    const existingValue = (existing?.value as Record<string, unknown>) || {}
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    for (const key of Object.keys(settings)) {
      const k = key as keyof typeof settings
      if (JSON.stringify(existingValue[k]) !== JSON.stringify(settings[k])) {
        changes[key] = { from: existingValue[k] ?? null, to: settings[k] }
      }
    }
    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'pkgx_settings',
        entityId: 'pkgx-settings',
        action: `Cập nhật cài đặt PKGX: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session.user?.id ?? '',
      }).catch(e => logError('pkgx settings activity log failed', e))
    }

    return apiSuccess({ data: setting.value })
  } catch (error) {
    logError('Error saving pkgx settings', error)
    return apiError('Failed to save pkgx settings', 500)
  }
}
