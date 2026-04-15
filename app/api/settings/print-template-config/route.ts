/**
 * Print Template Config API
 * Stores the full template configuration (templates + default sizes)
 * Replaces the old Zustand localStorage-based store
 */

import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { cache } from '@/lib/cache'

const SETTINGS_KEY = 'print_template_config'
const SETTINGS_GROUP = 'printer'

// GET /api/settings/print-template-config
export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const setting = await prisma.setting.findUnique({
      where: {
        key_group: {
          key: SETTINGS_KEY,
          group: SETTINGS_GROUP,
        },
      },
    })

    if (!setting?.value) {
      return apiSuccess({ data: { templates: {}, defaultSizes: {} } })
    }

    let data: { templates: Record<string, unknown>; defaultSizes: Record<string, string> }
    try {
      const raw = typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value
      data = {
        templates: raw?.templates || {},
        defaultSizes: raw?.defaultSizes || {},
      }
    } catch {
      data = { templates: {}, defaultSizes: {} }
    }

    return apiSuccess({ data })
  } catch (error) {
    logError('[PRINT-TEMPLATE-CONFIG] GET error', error)
    return apiError('Failed to fetch print template config', 500)
  }
}

// PUT /api/settings/print-template-config
export async function PUT(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()
    const { templates, defaultSizes } = body

    if (!templates || typeof templates !== 'object') {
      return apiError('Invalid templates data', 400)
    }

    const value = { templates, defaultSizes: defaultSizes || {} }

    // Read existing BEFORE update for diff
    const oldSetting = await prisma.setting.findUnique({
      where: { key_group: { key: SETTINGS_KEY, group: SETTINGS_GROUP } },
    })
    const oldData = (oldSetting?.value && typeof oldSetting.value === 'object')
      ? oldSetting.value as Record<string, unknown>
      : null

    await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTINGS_KEY,
          group: SETTINGS_GROUP,
        },
      },
      update: {
        value: JSON.parse(JSON.stringify(value)),
        updatedAt: new Date(),
      },
      create: {
        systemId: await generateIdWithPrefix('SET_PRINT', prisma),
        key: SETTINGS_KEY,
        value: JSON.parse(JSON.stringify(value)),
        type: 'json',
        group: SETTINGS_GROUP,
        category: 'printer',
        description: 'Print template configuration (templates + default paper sizes)',
      },
    })

    cache.deletePattern('^settings:')

    // Activity log with diff
    const oldTemplates = (oldData?.templates || {}) as Record<string, { content?: string; updatedAt?: string }>
    const oldDefaultSizes = (oldData?.defaultSizes || {}) as Record<string, string>
    const newDefaultSizes = defaultSizes || {}

    const changes: Record<string, { from: unknown; to: unknown }> = {}
    const changedTemplateKeys: string[] = []

    // Detect which templates changed (content or added/removed)
    const allKeys = new Set([...Object.keys(oldTemplates), ...Object.keys(templates)])
    for (const key of allKeys) {
      const oldTpl = oldTemplates[key]
      const newTpl = (templates as Record<string, { content?: string }>)[key]
      if (!oldTpl && newTpl) {
        changedTemplateKeys.push(key)
      } else if (oldTpl && !newTpl) {
        changedTemplateKeys.push(key)
      } else if (oldTpl && newTpl && oldTpl.content !== newTpl.content) {
        changedTemplateKeys.push(key)
      }
    }

    // Detect default size changes
    const changedSizes: string[] = []
    const allSizeKeys = new Set([...Object.keys(oldDefaultSizes), ...Object.keys(newDefaultSizes)])
    for (const key of allSizeKeys) {
      if (oldDefaultSizes[key] !== newDefaultSizes[key]) {
        changedSizes.push(key)
        changes[`Khổ giấy mặc định (${key})`] = {
          from: oldDefaultSizes[key] || '(chưa đặt)',
          to: newDefaultSizes[key] || '(đã xóa)',
        }
      }
    }

    if (changedTemplateKeys.length > 0) {
      changes['Mẫu in thay đổi'] = {
        from: `${changedTemplateKeys.length} mẫu`,
        to: changedTemplateKeys.slice(0, 5).join(', ') + (changedTemplateKeys.length > 5 ? '...' : ''),
      }
    }

    // Build descriptive action
    const actionParts: string[] = []
    if (changedTemplateKeys.length > 0) actionParts.push(`${changedTemplateKeys.length} mẫu in`)
    if (changedSizes.length > 0) actionParts.push(`${changedSizes.length} khổ giấy mặc định`)
    const actionDetail = actionParts.length > 0 ? `: ${actionParts.join(', ')}` : ''

    createActivityLog({
      entityType: 'print_template',
      entityId: 'print_template_config',
      action: `Cập nhật cấu hình mẫu in${actionDetail}`,
      actionType: 'update',
      changes: Object.keys(changes).length > 0 ? changes : undefined,
      createdBy: session.user?.id ?? '',
    }).catch(e => logError('[print-template-config] activity log failed', e))

    return apiSuccess({ data: value })
  } catch (error) {
    logError('[PRINT-TEMPLATE-CONFIG] PUT error', error)
    return apiError('Failed to save print template config', 500)
  }
}
