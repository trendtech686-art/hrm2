import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { cache } from '@/lib/cache'
import { z } from 'zod'
import crypto from 'crypto'
import { logError } from '@/lib/logger'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
})

const OTP_TTL = 10 * 60 * 1000 // 10 phút
const OTP_RATE_LIMIT = 60 * 1000 // 1 phút giữa các lần gửi

/**
 * POST /api/auth/forgot-password
 * Gửi OTP 6 số qua email để reset mật khẩu
 */
export const POST = apiHandler(async (req) => {
  const body = forgotPasswordSchema.parse(await req.json())
  const email = body.email.toLowerCase().trim()

  // Rate limit: 1 OTP mỗi phút per email
  const rateLimitKey = `otp-rate:${email}`
  if (cache.get(rateLimitKey)) {
    return apiError('Vui lòng chờ 1 phút trước khi gửi lại', 429)
  }

  // Tìm user trong DB
  const user = await prisma.user.findFirst({
    where: { email, isActive: true },
    select: { systemId: true, email: true },
  })

  // Luôn trả success để không leak thông tin user tồn tại
  if (!user) {
    return apiSuccess({ message: 'Nếu email tồn tại, bạn sẽ nhận được mã OTP' })
  }

  // Tạo OTP 6 số
  const otp = crypto.randomInt(100000, 999999).toString()

  // Lưu OTP vào cache (TTL 10 phút)
  const otpKey = `otp:${email}`
  cache.set(otpKey, {
    otp,
    userId: user.systemId,
    attempts: 0,
    createdAt: Date.now(),
  }, OTP_TTL)

  // Đặt rate limit
  cache.set(rateLimitKey, true, OTP_RATE_LIMIT)

  // Gửi email
  try {
    const sent = await sendEmail({
      to: email,
      subject: '[HRM] Mã xác nhận đặt lại mật khẩu',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e40af;">Đặt lại mật khẩu</h2>
          <p>Xin chào <strong>${email}</strong>,</p>
          <p>Mã xác nhận của bạn là:</p>
          <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e40af;">${otp}</span>
          </div>
          <p>Mã này có hiệu lực trong <strong>10 phút</strong>.</p>
          <p style="color: #6b7280; font-size: 13px;">Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px;">HRM System — ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</p>
        </div>
      `,
    })

    if (!sent) {
      cache.delete(otpKey)
      cache.delete(rateLimitKey)
      return apiError('Không thể gửi email. Vui lòng liên hệ quản trị viên.', 500)
    }
  } catch (error) {
    logError('[forgot-password] Send email failed', error)
    cache.delete(otpKey)
    cache.delete(rateLimitKey)
    return apiError('Không thể gửi email. Vui lòng thử lại sau.', 500)
  }

  return apiSuccess({ message: 'Nếu email tồn tại, bạn sẽ nhận được mã OTP' })
}, { auth: false })
