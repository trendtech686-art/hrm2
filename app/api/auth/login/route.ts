import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const TOKEN_COOKIE_NAME = 'auth_token'
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

// POST /api/auth/login
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      )
    }

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
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Tài khoản đã bị vô hiệu hóa' },
        { status: 401 }
      )
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      )
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
    return NextResponse.json(
      { error: 'Đăng nhập thất bại' },
      { status: 500 }
    )
  }
}
