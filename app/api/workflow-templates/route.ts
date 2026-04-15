import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiSuccessCached, apiError } from '@/lib/api-utils'
import { saveWorkflowTemplatesSchema } from './validation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { cache } from '@/lib/cache'

const SETTINGS_KEY = 'workflow_templates'
const SETTINGS_GROUP = 'workflow'

// GET /api/workflow-templates - Get all workflow templates
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
      // Return empty array if not configured
      return apiSuccessCached({ data: [] })
    }

    // Parse JSON value and return
    let templates = []
    try {
      templates = typeof setting.value === 'string' 
        ? JSON.parse(setting.value) 
        : setting.value
    } catch {
      templates = []
    }

    return apiSuccessCached({ data: templates })
  } catch (error) {
    logError('Error fetching workflow templates', error)
    return apiError('Failed to fetch workflow templates', 500)
  }
}

// POST /api/workflow-templates - Save all workflow templates
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, saveWorkflowTemplatesSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const { templates } = validation.data

  try {
    // 1. Read existing for diff comparison
    const oldSetting = await prisma.setting.findUnique({
      where: { key_group: { key: SETTINGS_KEY, group: SETTINGS_GROUP } },
    })
    const oldTemplates = (oldSetting?.value ?? []) as Record<string, unknown>[]

    // 2. Upsert the setting with templates as JSON value
    await prisma.setting.upsert({
      where: { 
        key_group: {
          key: SETTINGS_KEY,
          group: SETTINGS_GROUP,
        },
      },
      update: {
        value: templates as unknown as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        systemId: await generateIdWithPrefix('SETWF'),
        key: SETTINGS_KEY,
        group: SETTINGS_GROUP,
        type: 'json',
        category: 'workflow',
        value: templates as unknown as Prisma.InputJsonValue,
        description: 'Workflow templates for various processes',
      },
    })

    // Invalidate server-side settings cache
    cache.deletePattern('^settings:')

    // 3. Activity log with detailed diff
    const isCreate = !oldSetting
    const newArr = Array.isArray(templates) ? templates as Record<string, unknown>[] : []
    const oldArr = Array.isArray(oldTemplates) ? oldTemplates : []

    if (isCreate) {
      createActivityLog({
        entityType: 'workflow_template',
        entityId: 'workflow_templates',
        action: `Tạo cài đặt mẫu quy trình: ${newArr.length} quy trình`,
        actionType: 'create',
        createdBy: session.user?.id ?? '',
      }).catch(e => logError('[workflow-templates] activity log failed', e))
    } else {
      // Compute diff
      const changes: Record<string, { from: unknown; to: unknown }> = {}
      const changedLabels: string[] = []
      const getId = (item: Record<string, unknown>) => String(item.systemId ?? item.id ?? '')
      const getName = (item: Record<string, unknown>) => String(item.label ?? item.name ?? '')
      const oldMap = new Map(oldArr.map(item => [getId(item), item]))
      const newMap = new Map(newArr.map(item => [getId(item), item]))

      // Added
      for (const [id, item] of newMap) {
        if (!oldMap.has(id)) {
          const label = `Thêm: ${getName(item)}`
          changes[label] = { from: null, to: getName(item) }
          changedLabels.push(label)
        }
      }
      // Removed
      for (const [id, item] of oldMap) {
        if (!newMap.has(id)) {
          const label = `Xóa: ${getName(item)}`
          changes[label] = { from: getName(item), to: null }
          changedLabels.push(label)
        }
      }
      // Modified
      for (const [id, newItem] of newMap) {
        const oldItem = oldMap.get(id)
        if (oldItem && JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
          const itemName = getName(newItem)
          const fieldChanges: string[] = []
          if (oldItem.label !== newItem.label) fieldChanges.push('Tên')
          if (oldItem.description !== newItem.description) fieldChanges.push('Mô tả')
          if (oldItem.isDefault !== newItem.isDefault) {
            fieldChanges.push('Mặc định')
            changes[`${itemName} → Mặc định`] = {
              from: oldItem.isDefault ? 'Có' : 'Không',
              to: newItem.isDefault ? 'Có' : 'Không',
            }
          }
          if (JSON.stringify(oldItem.subtasks) !== JSON.stringify(newItem.subtasks)) {
            fieldChanges.push('Các bước')
          }
          if (oldItem.name !== newItem.name) fieldChanges.push('Chức năng')
          if (fieldChanges.length > 0) {
            changedLabels.push(`${itemName} (${fieldChanges.join(', ')})`)
          }
        }
      }

      if (oldArr.length !== newArr.length) {
        changes['Số lượng'] = { from: `${oldArr.length} quy trình`, to: `${newArr.length} quy trình` }
      }

      if (changedLabels.length > 0) {
        const changeDetail = changedLabels.join(', ')
        createActivityLog({
          entityType: 'workflow_template',
          entityId: 'workflow_templates',
          action: `Cập nhật mẫu quy trình: ${changeDetail}`,
          actionType: 'update',
          changes,
          createdBy: session.user?.id ?? '',
        }).catch(e => logError('[workflow-templates] activity log failed', e))
      }
    }

    return apiSuccess({ success: true })
  } catch (error) {
    logError('Error saving workflow templates', error)
    return apiError('Failed to save workflow templates', 500)
  }
}
