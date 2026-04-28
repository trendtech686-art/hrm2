import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

const JWT_SECRET = process.env.JWT_SECRET!
const TOKEN_COOKIE_NAME = 'auth_token'

// GET /api/auth/me - Get current user info
// Supports both cookie and Authorization header
// Special case: handles auth internally but can return 401
export async function GET(request: Request) {
  try {
    // Try to get token from cookie first, then from header
    const cookieStore = await cookies()
    let token = cookieStore.get(TOKEN_COOKIE_NAME)?.value

    if (!token) {
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      }
    }

    if (!token) {
      return apiError('Chưa đăng nhập', 401)
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string
        email: string
        role: string
        employeeId?: string
      }

      const user = await prisma.user.findUnique({
        where: { systemId: decoded.userId },
        select: {
          systemId: true,
          email: true,
          role: true,
          isActive: true,
          employeeId: true,
          employee: {
            select: {
              systemId: true,
              fullName: true,
              department: {
                select: { systemId: true, name: true },
              },
              branch: {
                select: { systemId: true, name: true },
              },
              jobTitle: {
                select: { systemId: true, name: true },
              },
            },
          },
        },
      })

      if (!user || !user.isActive) {
        const response = apiError('User không tồn tại hoặc đã bị vô hiệu hóa', 401)
        // Clear invalid cookie
        response.cookies.delete(TOKEN_COOKIE_NAME)
        return response
      }

      return apiSuccess({
        systemId: user.systemId,
        email: user.email,
        fullName: user.employee?.fullName || user.email,
        role: user.role,
        employeeId: user.employeeId,
        employee: user.employee,
      })
    } catch {
      const response = apiError('Token không hợp lệ hoặc đã hết hạn', 401)
      // Clear invalid cookie
      response.cookies.delete(TOKEN_COOKIE_NAME)
      return response
    }
  } catch (error) {
    logError('Auth check error', error)
    return apiError('Lỗi xác thực', 500)
  }
}
