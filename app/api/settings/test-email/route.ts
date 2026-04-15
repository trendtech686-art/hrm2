import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError } from '@/lib/api-utils'
import { sendEmail } from '@/lib/email'

export const POST = apiHandler(async (req) => {
  const body = await req.json()
  const to = body?.to

  if (!to || typeof to !== 'string' || !to.includes('@')) {
    return apiError('Email không hợp lệ', 400)
  }

  const sent = await sendEmail({
    to,
    subject: '[HRM] Email test - Kiểm tra cấu hình SMTP',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #059669;">✅ Cấu hình SMTP hoạt động!</h2>
        <p>Email này được gửi từ hệ thống HRM để xác nhận cấu hình SMTP đã đúng.</p>
        <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
          Thời gian: ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
        </p>
      </div>
    `,
  })

  if (!sent) {
    return apiError('Gửi email thất bại. Kiểm tra lại cấu hình SMTP.', 500)
  }

  return apiSuccess({ message: 'Email test đã gửi thành công' })
}, { permission: 'edit_settings' })
