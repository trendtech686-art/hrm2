import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { z } from 'zod'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { cache } from '@/lib/cache'

const SETTING_KEY = 'payroll-templates'
const SETTING_GROUP = 'hrm'

// Validation schema for a single payroll template
const payrollTemplateSchema = z.object({
  systemId: z.string(),
  id: z.string(),
  name: z.string().min(1, 'Tên mẫu không được để trống'),
  description: z.string().optional(),
  componentSystemIds: z.array(z.string()),
  isDefault: z.boolean().default(false),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.string().optional(),
  updatedBy: z.string().optional(),
})

// Validation schema for the entire templates array
const payrollTemplatesSchema = z.array(payrollTemplateSchema)

// GET /api/settings/payroll-templates - Get all payroll templates
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

    if (!setting || !setting.value) {
      return apiSuccess({ data: [] })
    }

    // Ensure we return an array
    const templates = Array.isArray(setting.value) ? setting.value : []
    return apiSuccess({ data: templates })
  } catch (error) {
    logError('Error fetching payroll templates', error)
    return apiError('Failed to fetch payroll templates', 500)
  }
}

// PUT /api/settings/payroll-templates - Update all payroll templates
export async function PUT(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, payrollTemplatesSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const templates = validation.data

  try {
    // Read existing data BEFORE upsert for activity log diff
    const existingSetting = await prisma.setting.findFirst({
      where: { key: SETTING_KEY, group: SETTING_GROUP },
    })
    const oldTemplates = (existingSetting?.value as unknown as Array<{ systemId: string; name: string; componentSystemIds: string[]; isDefault: boolean }>) ?? []

    const setting = await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      update: {
        value: templates as unknown as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        systemId: await generateIdWithPrefix('SET_PAYTPL', prisma),
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'hrm',
        value: templates as unknown as Prisma.InputJsonValue,
        description: 'Payroll templates configuration',
      },
    })
    const oldMap = new Map(oldTemplates.map(t => [t.systemId, t]))
    const newMap = new Map(templates.map(t => [t.systemId, t]))

    const logPromises: Promise<void>[] = []

    // Added templates
    for (const [id, tpl] of newMap) {
      if (!oldMap.has(id)) {
        logPromises.push(
          createActivityLog({
            entityType: 'payroll_template',
            entityId: id,
            action: `Thêm mẫu bảng lương: ${tpl.name}`,
            actionType: 'create',
            changes: { name: { from: null, to: tpl.name } },
            createdBy: session.user?.id,
          }).catch(e => logError('[payroll-templates] activity log failed', e))
        )
      }
    }

    // Deleted templates
    for (const [id, tpl] of oldMap) {
      if (!newMap.has(id)) {
        logPromises.push(
          createActivityLog({
            entityType: 'payroll_template',
            entityId: id,
            action: `Xóa mẫu bảng lương: ${tpl.name}`,
            actionType: 'delete',
            createdBy: session.user?.id,
          }).catch(e => logError('[payroll-templates] activity log failed', e))
        )
      }
    }

    // Updated templates
    for (const [id, newTpl] of newMap) {
      const oldTpl = oldMap.get(id)
      if (!oldTpl) continue
      const changes: Record<string, { from: unknown; to: unknown }> = {}
      if (newTpl.name !== oldTpl.name) changes['Tên'] = { from: oldTpl.name, to: newTpl.name }
      if (JSON.stringify(newTpl.componentSystemIds) !== JSON.stringify(oldTpl.componentSystemIds)) {
        changes['Thành phần lương'] = { from: `${oldTpl.componentSystemIds.length} thành phần`, to: `${newTpl.componentSystemIds.length} thành phần` }
      }
      if (newTpl.isDefault !== oldTpl.isDefault) changes['Mặc định'] = { from: oldTpl.isDefault ? 'Có' : 'Không', to: newTpl.isDefault ? 'Có' : 'Không' }
      if (Object.keys(changes).length > 0) {
        const changeDetail = Object.keys(changes).join(', ')
        logPromises.push(
          createActivityLog({
            entityType: 'payroll_template',
            entityId: id,
            action: `Cập nhật mẫu bảng lương: ${oldTpl.name}: ${changeDetail}`,
            actionType: 'update',
            changes,
            createdBy: session.user?.id,
          }).catch(e => logError('[payroll-templates] activity log failed', e))
        )
      }
    }

    await Promise.all(logPromises)

    cache.deletePattern('^settings:')
    return apiSuccess({ data: setting.value })
  } catch (error) {
    logError('Error saving payroll templates', error)
    return apiError('Failed to save payroll templates', 500)
  }
}
