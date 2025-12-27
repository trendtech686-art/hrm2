import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const TOKEN_COOKIE_NAME = 'auth_token'

// GET /api/auth/me - Get current user info
// Supports both cookie and Authorization header
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
      return NextResponse.json(
        { error: 'Chưa đăng nhập' },
        { status: 401 }
      )
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
        include: {
          employee: {
            include: {
              department: true,
              branch: true,
              jobTitle: true,
            },
          },
        },
      })

      if (!user || !user.isActive) {
        const response = NextResponse.json(
          { error: 'User không tồn tại hoặc đã bị vô hiệu hóa' },
          { status: 401 }
        )
        // Clear invalid cookie
        response.cookies.delete(TOKEN_COOKIE_NAME)
        return response
      }

      return NextResponse.json({
        systemId: user.systemId,
        email: user.email,
        fullName: user.employee?.fullName || user.email,
        role: user.role,
        employeeId: user.employeeId,
        employee: user.employee,
      })
    } catch {
      const response = NextResponse.json(
        { error: 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 401 }
      )
      // Clear invalid cookie
      response.cookies.delete(TOKEN_COOKIE_NAME)
      return response
    }
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Lỗi xác thực' },
      { status: 500 }
    )
  }
}
