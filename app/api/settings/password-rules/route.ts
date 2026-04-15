import { apiHandler } from '@/lib/api-handler'
import { apiSuccess } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'
import { getPasswordRules } from '@/lib/password-rules'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { cache } from '@/lib/cache'
import { z } from 'zod'
import { logError } from '@/lib/logger'

const updateRulesSchema = z.object({
  minLength: z.number().min(6).max(32),
  requireUppercase: z.boolean(),
  requireNumbers: z.boolean(),
  requireSpecialChars: z.boolean(),
})

export const GET = apiHandler(async () => {
  const rules = await getPasswordRules()
  return apiSuccess(rules)
}, { permission: 'edit_settings' })

export const POST = apiHandler(async (req, { session }) => {
  const body = updateRulesSchema.parse(await req.json())

  const oldSetting = await prisma.setting.findUnique({
    where: { key_group: { key: 'password_rules', group: 'security' } },
  })

  await prisma.setting.upsert({
    where: { key_group: { key: 'password_rules', group: 'security' } },
    update: { value: body },
    create: {
      systemId: await generateIdWithPrefix('SET', prisma),
      key: 'password_rules',
      group: 'security',
      type: 'json',
      category: 'system',
      value: body,
      description: 'Quy tắc mật khẩu',
    },
  })

  // Clear cache
  cache.delete('settings:security:password_rules')

  // Activity log
  createActivityLog({
    entityType: 'settings',
    entityId: 'password_rules',
    action: 'Cập nhật quy tắc mật khẩu',
    actionType: 'update',
    changes: {
      value: { from: oldSetting?.value ?? null, to: body },
    },
    createdBy: session?.user.id ?? '',
  }).catch(e => logError('[password-rules] activity log failed', e))

  return apiSuccess({ message: 'Đã lưu quy tắc mật khẩu' })
}, { permission: 'edit_settings' })
