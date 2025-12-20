import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// GET /api/auth/me - Get current user info
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Không có token xác thực' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
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
        return NextResponse.json(
          { error: 'User không tồn tại hoặc đã bị vô hiệu hóa' },
          { status: 401 }
        )
      }

      return NextResponse.json({
        id: user.systemId,
        email: user.email,
        role: user.role,
        employee: user.employee,
      })
    } catch {
      return NextResponse.json(
        { error: 'Token không hợp lệ' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Lỗi xác thực' },
      { status: 500 }
    )
  }
}
