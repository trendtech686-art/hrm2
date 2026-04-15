import { apiHandler } from '@/lib/api-handler'
import { apiSuccess } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'
import { getFileSizeLimits } from '@/lib/file-size-limits'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { cache } from '@/lib/cache'
import { z } from 'zod'
import { logError } from '@/lib/logger'

const updateLimitsSchema = z.object({
  imageMb: z.number().min(1).max(100),
  documentMb: z.number().min(1).max(200),
  generalMb: z.number().min(1).max(100),
})

export const GET = apiHandler(async () => {
  const limits = await getFileSizeLimits()
  return apiSuccess(limits)
}, { permission: 'edit_settings' })

export const POST = apiHandler(async (req, { session }) => {
  const body = updateLimitsSchema.parse(await req.json())

  const oldSetting = await prisma.setting.findUnique({
    where: { key_group: { key: 'file_size_limits', group: 'media' } },
  })

  await prisma.setting.upsert({
    where: { key_group: { key: 'file_size_limits', group: 'media' } },
    update: { value: body },
    create: {
      systemId: await generateIdWithPrefix('SET', prisma),
      key: 'file_size_limits',
      group: 'media',
      type: 'json',
      category: 'system',
      value: body,
      description: 'Giới hạn kích thước file upload',
    },
  })

  // Clear cache
  cache.delete('settings:media:file_size_limits')

  // Activity log
  createActivityLog({
    entityType: 'settings',
    entityId: 'file_size_limits',
    action: 'Cập nhật giới hạn kích thước file',
    actionType: 'update',
    changes: {
      value: { from: oldSetting?.value ?? null, to: body },
    },
    createdBy: session?.user.id ?? '',
  }).catch(e => logError('[file-size-limits] activity log failed', e))

  return apiSuccess({ message: 'Đã lưu giới hạn kích thước file' })
}, { permission: 'edit_settings' })
