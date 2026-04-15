import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { logError } from '@/lib/logger'
import { getPasswordRules, validatePassword } from '@/lib/password-rules'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
  newPassword: z.string().min(1, 'Vui lòng nhập mật khẩu mới'),
})

export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  let body: z.infer<typeof changePasswordSchema>
  try {
    const raw = await request.json()
    body = changePasswordSchema.parse(raw)
  } catch {
    return apiError('Dữ liệu không hợp lệ', 400)
  }

  try {
    const userSystemId = session.user?.id
    if (!userSystemId) return apiError('Không tìm thấy người dùng', 400)

    const user = await prisma.user.findUnique({
      where: { systemId: userSystemId },
      select: { systemId: true, password: true },
    })

    if (!user) return apiError('Người dùng không tồn tại', 404)

    const isValidPassword = await bcrypt.compare(body.currentPassword, user.password)
    if (!isValidPassword) {
      return apiError('Mật khẩu hiện tại không đúng', 400)
    }

    // Validate new password against rules from DB
    const rules = await getPasswordRules()
    const validationError = validatePassword(body.newPassword, rules)
    if (validationError) {
      return apiError(validationError, 400)
    }

    const hashedNewPassword = await bcrypt.hash(body.newPassword, 10)
    await prisma.user.update({
      where: { systemId: user.systemId },
      data: { password: hashedNewPassword },
    })

    return apiSuccess({ message: 'Đổi mật khẩu thành công' })
  } catch (error) {
    logError('Error changing password', error)
    return apiError('Lỗi khi đổi mật khẩu', 500)
  }
}
