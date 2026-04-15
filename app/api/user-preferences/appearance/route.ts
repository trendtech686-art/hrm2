import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updateAppearanceSchema } from './validation'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

const PREFERENCE_KEY = 'appearance'
const PREFERENCE_CATEGORY = 'ui'

// Vietnamese labels for activity log
const fieldLabels: Record<string, string> = {
  theme: 'Theme màu',
  colorMode: 'Chế độ sáng/tối',
  font: 'Font chữ',
  fontSize: 'Cỡ chữ',
  customThemeConfig: 'Cấu hình theme tùy chỉnh',
  sidebarCollapsed: 'Thu gọn sidebar',
  compactMode: 'Chế độ compact',
}

// GET /api/user-preferences/appearance
export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const preference = await prisma.userPreference.findUnique({
      where: {
        userId_key: {
          userId: session.user.id,
          key: PREFERENCE_KEY,
        },
      },
    })

    if (!preference) {
      return apiSuccess({ data: null })
    }

    return apiSuccess({ data: preference.value })
  } catch (error) {
    logError('Error fetching appearance preferences', error)
    return apiError('Failed to fetch appearance preferences', 500)
  }
}

// PUT /api/user-preferences/appearance
export async function PUT(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updateAppearanceSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const settings = validation.data

  try {
    // Get existing preference to merge
    const existing = await prisma.userPreference.findUnique({
      where: {
        userId_key: {
          userId: session.user.id,
          key: PREFERENCE_KEY,
        },
      },
    })

    const mergedValue = {
      ...((existing?.value as object) || {}),
      ...settings,
    }

    const preference = await prisma.userPreference.upsert({
      where: {
        userId_key: {
          userId: session.user.id,
          key: PREFERENCE_KEY,
        },
      },
      update: {
        value: mergedValue as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        key: PREFERENCE_KEY,
        category: PREFERENCE_CATEGORY,
        value: mergedValue as Prisma.InputJsonValue,
      },
    })

    // Log appearance changes with Vietnamese labels
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    const existingObj = (existing?.value as Record<string, unknown>) || {}
    for (const key of Object.keys(settings)) {
      if (JSON.stringify(existingObj[key]) !== JSON.stringify((settings as Record<string, unknown>)[key])) {
        const label = fieldLabels[key] ?? key
        changes[label] = { from: existingObj[key], to: (settings as Record<string, unknown>)[key] }
      }
    }
    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'appearance',
        entityId: session.user.id,
        action: `Cập nhật giao diện: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session.user?.id ?? '',
      }).catch(e => logError('Activity log failed', e))
    }

    return apiSuccess({ data: preference.value })
  } catch (error) {
    logError('Error saving appearance preferences', error)
    return apiError('Failed to save appearance preferences', 500)
  }
}
