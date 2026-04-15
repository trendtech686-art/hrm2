import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { cache } from '@/lib/cache'
import { z } from 'zod'
import crypto from 'crypto'
import { logError } from '@/lib/logger'
import { getOtpLoginSettings } from '@/app/api/settings/otp-login/route'

const OTP_TTL = 10 * 60 * 1000 // 10 phút
const OTP_RATE_LIMIT = 60 * 1000 // 1 phút

const sendOtpSchema = z.object({
  email: z.string().email(),
})

const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
})

/**
 * GET /api/auth/login-otp
 * Kiểm tra OTP login có bật không
 */
export const GET = apiHandler(async () => {
  const settings = await getOtpLoginSettings()
  return apiSuccess({ enabled: settings.enabled })
}, { auth: false })

/**
 * POST /api/auth/login-otp
 * Gửi OTP sau khi login thành công (hoặc verify OTP)
 */
export const POST = apiHandler(async (req) => {
  const body = await req.json()

  // Check action
  if (body.action === 'verify') {
    return handleVerify(body)
  }
  return handleSend(body)
}, { auth: false })

async function handleSend(body: unknown) {
  const { email } = sendOtpSchema.parse(body)
  const normalizedEmail = email.toLowerCase().trim()

  // Kiểm tra setting có bật OTP không
  const settings = await getOtpLoginSettings()
  if (!settings.enabled) {
    return apiSuccess({ required: false })
  }

  // Kiểm tra user tồn tại
  const user = await prisma.user.findFirst({
    where: { email: normalizedEmail, isActive: true },
    select: { systemId: true },
  })

  if (!user) {
    return apiError('Tài khoản không tồn tại', 400)
  }

  // Rate limit
  const rateLimitKey = `login-otp-rate:${normalizedEmail}`
  if (cache.get(rateLimitKey)) {
    return apiSuccess({ required: true, sent: true })
  }

  // Tạo OTP 6 số
  const otp = crypto.randomInt(100000, 999999).toString()
  const otpKey = `login-otp:${normalizedEmail}`

  cache.set(otpKey, {
    otp,
    attempts: 0,
    createdAt: Date.now(),
  }, OTP_TTL)

  cache.set(rateLimitKey, true, OTP_RATE_LIMIT)

  // Gửi email
  try {
    const sent = await sendEmail({
      to: normalizedEmail,
      subject: '[HRM] Mã xác thực đăng nhập',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e40af;">Xác thực đăng nhập</h2>
          <p>Xin chào,</p>
          <p>Mã xác thực đăng nhập của bạn là:</p>
          <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e40af;">${otp}</span>
          </div>
          <p>Mã này có hiệu lực trong <strong>10 phút</strong>.</p>
          <p style="color: #6b7280; font-size: 13px;">Nếu bạn không thực hiện đăng nhập, hãy đổi mật khẩu ngay.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px;">HRM System — ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</p>
        </div>
      `,
    })

    if (!sent) {
      cache.delete(otpKey)
      cache.delete(rateLimitKey)
      return apiError('Không thể gửi email OTP. Liên hệ quản trị viên.', 500)
    }
  } catch (error) {
    logError('[login-otp] Send email failed', error)
    cache.delete(otpKey)
    cache.delete(rateLimitKey)
    return apiError('Không thể gửi email OTP.', 500)
  }

  return apiSuccess({ required: true, sent: true })
}

async function handleVerify(body: unknown) {
  const { email, otp } = verifyOtpSchema.parse(body)
  const normalizedEmail = email.toLowerCase().trim()

  const otpKey = `login-otp:${normalizedEmail}`
  const stored = cache.get<{ otp: string; attempts: number; createdAt: number }>(otpKey)

  if (!stored) {
    return apiError('Mã OTP đã hết hạn. Vui lòng đăng nhập lại.', 400)
  }

  // Max 5 attempts
  if (stored.attempts >= 5) {
    cache.delete(otpKey)
    return apiError('Quá nhiều lần thử. Vui lòng đăng nhập lại.', 429)
  }

  if (stored.otp !== otp) {
    stored.attempts += 1
    cache.set(otpKey, stored, OTP_TTL - (Date.now() - stored.createdAt))
    return apiError(`Mã OTP không đúng. Còn ${5 - stored.attempts} lần thử.`, 400)
  }

  // OTP đúng - xóa khỏi cache
  cache.delete(otpKey)

  return apiSuccess({ verified: true })
}
