import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/cache'
import { getPasswordRules, validatePassword } from '@/lib/password-rules'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { createActivityLog } from '@/lib/services/activity-log-service'

const resetPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  otp: z.string().length(6, 'Mã OTP phải có 6 số'),
  newPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

const MAX_OTP_ATTEMPTS = 5

/**
 * POST /api/auth/reset-password
 * Verify OTP và đặt lại mật khẩu mới
 */
export const POST = apiHandler(async (req) => {
  const body = resetPasswordSchema.parse(await req.json())
  const email = body.email.toLowerCase().trim()

  // Lấy OTP từ cache
  const otpKey = `otp:${email}`
  const stored = cache.get(otpKey) as {
    otp: string
    userId: string
    attempts: number
    createdAt: number
  } | undefined

  if (!stored) {
    return apiError('Mã OTP đã hết hạn hoặc không tồn tại. Vui lòng yêu cầu mã mới.', 400)
  }

  // Chống brute-force: max 5 lần thử
  if (stored.attempts >= MAX_OTP_ATTEMPTS) {
    cache.delete(otpKey)
    return apiError('Đã vượt quá số lần thử. Vui lòng yêu cầu mã OTP mới.', 429)
  }

  // Verify OTP
  if (stored.otp !== body.otp) {
    // Tăng số lần thử
    stored.attempts += 1
    cache.set(otpKey, stored, 10 * 60 * 1000) // Giữ TTL cũ
    const remaining = MAX_OTP_ATTEMPTS - stored.attempts
    return apiError(`Mã OTP không đúng. Còn ${remaining} lần thử.`, 400)
  }

  // Validate password rules
  const rules = await getPasswordRules()
  const validationError = validatePassword(body.newPassword, rules)
  if (validationError) {
    return apiError(validationError, 400)
  }

  // Hash password mới và cập nhật
  const hashedPassword = await bcrypt.hash(body.newPassword, 10)
  await prisma.user.update({
    where: { systemId: stored.userId },
    data: { password: hashedPassword },
  })

  // Xóa OTP sau khi dùng
  cache.delete(otpKey)

  createActivityLog({
    entityType: 'user',
    entityId: stored.userId,
    action: 'Đặt lại mật khẩu',
    actionType: 'update',
    note: 'Đặt lại mật khẩu qua OTP',
    metadata: { email },
    createdBy: stored.userId,
  }).catch(() => undefined)

  return apiSuccess({ message: 'Đặt lại mật khẩu thành công' })
}, { auth: false })
