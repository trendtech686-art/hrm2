import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validateBody, apiError } from '@/lib/api-utils'
import { checkRateLimit } from '@/lib/security-utils'
import { loginSchema } from './validation'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { resolveLoginUser } from '@/lib/auth/resolve-login-identifier'

const JWT_SECRET = process.env.JWT_SECRET!
const TOKEN_COOKIE_NAME = 'auth_token'
const TOKEN_MAX_AGE = 24 * 60 * 60 // 1 day in seconds (aligned with NextAuth maxAge)

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
  const { email: identifier, password } = validation.data

  try {
    // Resolve theo email hoặc SĐT
    const userLite = await resolveLoginUser(identifier)
    // resolveLoginUser chỉ include employee fields tối thiểu; cần fetch lại để lấy
    // password và các quan hệ đầy đủ cho activity log + JWT payload.
    const user = userLite
      ? await prisma.user.findUnique({
          where: { systemId: userLite.systemId },
          select: {
            systemId: true,
            email: true,
            password: true,
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
      : null

    if (!user) {
      createActivityLog({
        entityType: 'user',
        entityId: 'UNKNOWN',
        action: 'Đăng nhập thất bại',
        actionType: 'system',
        note: `Tài khoản không tồn tại: ${identifier}`,
        metadata: { identifier, ip, reason: 'user_not_found' },
      }).catch(() => undefined)
      return apiError('Thông tin đăng nhập không đúng', 401)
    }

    if (!user.isActive) {
      createActivityLog({
        entityType: 'user',
        entityId: user.systemId,
        action: 'Đăng nhập thất bại',
        actionType: 'system',
        note: 'Tài khoản bị vô hiệu hóa',
        metadata: { identifier, ip, reason: 'account_disabled' },
        createdBy: user.systemId,
      }).catch(() => undefined)
      return apiError('Tài khoản đã bị vô hiệu hóa', 401)
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      createActivityLog({
        entityType: 'user',
        entityId: user.systemId,
        action: 'Đăng nhập thất bại',
        actionType: 'system',
        note: 'Sai mật khẩu',
        metadata: { identifier, ip, reason: 'invalid_password' },
        createdBy: user.systemId,
      }).catch(() => undefined)
      return apiError('Thông tin đăng nhập không đúng', 401)
    }

    const token = jwt.sign(
      {
        userId: user.systemId,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    await prisma.user.update({
      where: { systemId: user.systemId },
      data: { lastLogin: new Date() },
    })

    createActivityLog({
      entityType: 'user',
      entityId: user.systemId,
      action: 'Đăng nhập',
      actionType: 'system',
      metadata: { identifier, ip, userName: user.employee?.fullName || user.email },
      createdBy: user.systemId,
    }).catch(() => undefined)

    const userData = {
      systemId: user.systemId,
      email: user.email,
      fullName: user.employee?.fullName || user.email,
      role: user.role,
      employeeId: user.employeeId,
      employee: user.employee,
    }

    // Create response with HTTP-only cookie (token not exposed in body)
    const response = NextResponse.json({
      success: true,
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
    logError('Login error', error)
    return apiError('Đăng nhập thất bại', 500)
  }
}
