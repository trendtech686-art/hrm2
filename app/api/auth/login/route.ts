import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validateBody, apiError } from '@/lib/api-utils'
import { checkRateLimit } from '@/lib/security-utils'
import { loginSchema } from './validation'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const TOKEN_COOKIE_NAME = 'auth_token'
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

// POST /api/auth/login - No auth required
export async function POST(request: Request) {
  // Rate limit: 5 attempts per minute per IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const rateLimit = checkRateLimit(`login:${ip}`, 5, 60_000)
  if (!rateLimit.allowed) {
    return apiError('Quá nhiều lần thử. Vui lòng đợi 1 phút.', 429)
  }

  const validation = await validateBody(request, loginSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const { email, password } = validation.data

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
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

    if (!user) {
      return apiError('Email hoặc mật khẩu không đúng', 401)
    }

    if (!user.isActive) {
      return apiError('Tài khoản đã bị vô hiệu hóa', 401)
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return apiError('Email hoặc mật khẩu không đúng', 401)
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.systemId,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Update last login
    await prisma.user.update({
      where: { systemId: user.systemId },
      data: { lastLogin: new Date() },
    })

    // Prepare user data for response
    const userData = {
      systemId: user.systemId,
      email: user.email,
      fullName: user.employee?.fullName || user.email,
      role: user.role,
      employeeId: user.employeeId,
      employee: user.employee,
    }

    // Create response with HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      token, // Still return token for backward compatibility
      user: userData,
    })

    // Set HTTP-only cookie for secure auth
    response.cookies.set({
      name: TOKEN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: TOKEN_MAX_AGE,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return apiError('Đăng nhập thất bại', 500)
  }
}
