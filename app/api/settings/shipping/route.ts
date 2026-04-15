import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { shippingSettingsSchema } from './validation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { logError } from '@/lib/logger'
import { cache } from '@/lib/cache'
import { createActivityLog } from '@/lib/services/activity-log-service'

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
    logError('Error fetching shipping settings', error)
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
    // Read old value for change tracking
    const oldSetting = await prisma.setting.findUnique({
      where: { key_group: { key: SETTING_KEY, group: SETTING_GROUP } },
    })
    const oldValue = (oldSetting?.value ?? {}) as Record<string, unknown>

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

    // Log changes
    const FIELD_LABELS: Record<string, string> = {
      weightSource: 'Nguồn cân nặng',
      customWeight: 'Cân nặng tuỳ chỉnh',
      weightUnit: 'Đơn vị cân nặng',
      length: 'Dài',
      width: 'Rộng',
      height: 'Cao',
      deliveryRequirement: 'Yêu cầu giao hàng',
      shippingNote: 'Ghi chú vận chuyển',
      autoSyncStatus: 'Tự động đồng bộ trạng thái',
      autoCancelOrder: 'Tự động huỷ đơn',
      autoSyncCod: 'Tự động đồng bộ COD',
      latePickupWarningDays: 'Cảnh báo chậm lấy hàng (ngày)',
      lateDeliveryWarningDays: 'Cảnh báo chậm giao hàng (ngày)',
    }
    const newValue = settings as Record<string, unknown>
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    const allKeys = new Set([...Object.keys(oldValue), ...Object.keys(newValue)])
    for (const key of allKeys) {
      if (JSON.stringify(oldValue[key]) !== JSON.stringify(newValue[key])) {
        const label = FIELD_LABELS[key] || key
        changes[label] = { from: oldValue[key] ?? null, to: newValue[key] ?? null }
      }
    }
    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'shipping_settings',
        entityId: 'shipping-settings',
        action: `Cập nhật cài đặt vận chuyển: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session?.user.id ?? '',
      }).catch(e => logError('[settings/shipping] activity log failed', e))
    }

    cache.deletePattern('^settings:')
    return apiSuccess({ data: setting.value })
  } catch (error) {
    logError('Error saving shipping settings', error)
    return apiError('Failed to save shipping settings', 500)
  }
}
