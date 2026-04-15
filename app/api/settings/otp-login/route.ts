import { apiHandler } from '@/lib/api-handler'
import { apiSuccess } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { cache } from '@/lib/cache'
import { z } from 'zod'
import { logError } from '@/lib/logger'

const CACHE_KEY = 'settings:security:otp_login'

const updateSchema = z.object({
  enabled: z.boolean(),
})

export interface OtpLoginSettings {
  enabled: boolean
}

const DEFAULT_SETTINGS: OtpLoginSettings = { enabled: false }

export async function getOtpLoginSettings(): Promise<OtpLoginSettings> {
  const cached = cache.get<OtpLoginSettings>(CACHE_KEY)
  if (cached) return cached

  try {
    const setting = await prisma.setting.findUnique({
      where: { key_group: { key: 'otp_login', group: 'security' } },
    })
    if (setting?.value) {
      const result = { ...DEFAULT_SETTINGS, ...(setting.value as object) }
      cache.set(CACHE_KEY, result, 5 * 60 * 1000)
      return result
    }
  } catch {
    // Fallback to defaults
  }
  return DEFAULT_SETTINGS
}

export const GET = apiHandler(async () => {
  const settings = await getOtpLoginSettings()
  return apiSuccess(settings)
}, { permission: 'edit_settings' })

export const POST = apiHandler(async (req, { session }) => {
  const body = updateSchema.parse(await req.json())

  const oldSetting = await prisma.setting.findUnique({
    where: { key_group: { key: 'otp_login', group: 'security' } },
  })

  await prisma.setting.upsert({
    where: { key_group: { key: 'otp_login', group: 'security' } },
    update: { value: body },
    create: {
      systemId: await generateIdWithPrefix('SET', prisma),
      key: 'otp_login',
      group: 'security',
      type: 'json',
      category: 'system',
      value: body,
      description: 'Cài đặt đăng nhập OTP',
    },
  })

  cache.delete(CACHE_KEY)

  createActivityLog({
    entityType: 'settings',
    entityId: 'otp_login',
    action: body.enabled ? 'Bật xác thực OTP khi đăng nhập' : 'Tắt xác thực OTP khi đăng nhập',
    actionType: 'update',
    changes: {
      value: { from: oldSetting?.value ?? null, to: body },
    },
    createdBy: session?.user.id ?? '',
  }).catch(e => logError('[otp-login] activity log failed', e))

  return apiSuccess({ message: body.enabled ? 'Đã bật xác thực OTP' : 'Đã tắt xác thực OTP' })
}, { permission: 'edit_settings' })
