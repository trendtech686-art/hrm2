import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { createSettingSchema, bulkUpdateSettingsSchema } from './validation'
import { cache, CACHE_TTL } from '@/lib/cache'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

// GET /api/settings - Get all settings
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const group = searchParams.get('group')
    const key = searchParams.get('key')

    // Create cache key based on params
    const cacheKey = `settings:${group || 'all'}:${key || 'all'}`
    
    // Try cache first
    const cached = cache.get(cacheKey)
    if (cached) {
      return apiSuccess(cached)
    }

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
      cache.set(cacheKey, settings[0], CACHE_TTL.LONG * 1000)
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

    const result = { data: settings, grouped }
    cache.set(cacheKey, result, CACHE_TTL.LONG * 1000) // Cache 30 phút
    return apiSuccess(result)
  } catch (error) {
    logError('Error fetching settings', error)
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
    // Read old value for change tracking
    const oldSetting = await prisma.setting.findUnique({
      where: { key_group: { key: body.key, group: body.group } },
    })
    const oldValue = oldSetting?.value

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
        systemId: await generateIdWithPrefix('SET', prisma),
        key: body.key,
        group: body.group,
        type: body.type || 'string',
        category: body.category || 'system',
        value: body.value,
        description: body.description,
      },
    })

    // Log activity with diff
    const isCreate = !oldSetting
    if (isCreate) {
      await createActivityLog({
        entityType: 'settings',
        entityId: setting.systemId,
        action: `Tạo cài đặt: ${body.key}`,
        actionType: 'create',
        changes: { value: { from: null, to: body.value } },
        createdBy: session?.user.id ?? '',
      }).catch(e => logError('[settings] activity log failed', e))
    } else if (JSON.stringify(oldValue) !== JSON.stringify(body.value)) {
      await createActivityLog({
        entityType: 'settings',
        entityId: setting.systemId,
        action: `Cập nhật cài đặt: ${body.key}`,
        actionType: 'update',
        changes: { value: { from: oldValue, to: body.value } },
        createdBy: session?.user.id ?? '',
      }).catch(e => logError('[settings] activity log failed', e))
    }

    // Invalidate settings cache
    cache.deletePattern('^settings:')
    
    return apiSuccess(setting)
  } catch (error) {
    logError('Error saving setting', error)
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
    const results: Array<{
      systemId: string;
      key: string;
      value: Prisma.JsonValue;
      type: string;
      category: string;
      description: string | null;
      updatedAt: Date;
      updatedBy: string | null;
      group: string;
    }> = [];
    const changes: Record<string, { from: unknown; to: unknown }> = {};

    for (const setting of body.settings as Array<{ key: string; group: string; value?: unknown; description?: string; type?: string; category?: string }>) {
      // Read old value for diff
      const oldSetting = await prisma.setting.findUnique({
        where: { key_group: { key: setting.key, group: setting.group } },
      })
      const oldValue = oldSetting?.value

      const result = await prisma.setting.upsert({
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
          systemId: await generateIdWithPrefix('SET', prisma),
          key: setting.key,
          group: setting.group,
          type: setting.type || 'string',
          category: setting.category || 'system',
          value: setting.value as Prisma.InputJsonValue,
          description: setting.description,
        },
      });
      results.push(result);

      if (JSON.stringify(oldValue) !== JSON.stringify(setting.value)) {
        changes[`${setting.group}/${setting.key}`] = { from: oldValue ?? null, to: setting.value ?? null };
      }
    }

    // Log bulk update if any changes
    if (Object.keys(changes).length > 0) {
      await createActivityLog({
        entityType: 'settings',
        entityId: 'bulk-update',
        action: `Cập nhật hàng loạt cài đặt (${Object.keys(changes).length} mục)`,
        actionType: 'update',
        changes,
        createdBy: session?.user.id ?? '',
      }).catch(e => logError('[settings] bulk activity log failed', e))
    }

    // Invalidate settings cache
    cache.deletePattern('^settings:')

    return apiSuccess({ data: results })
  } catch (error) {
    logError('Error bulk updating settings', error)
    return apiError('Failed to update settings', 500)
  }
}