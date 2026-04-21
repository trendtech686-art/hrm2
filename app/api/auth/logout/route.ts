import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { apiSuccess } from '@/lib/api-utils'
import { createActivityLog } from '@/lib/services/activity-log-service'

const TOKEN_COOKIE_NAME = 'auth_token'
const JWT_SECRET = process.env.JWT_SECRET!

async function logLogoutFromCookie() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value
    if (!token) return
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string; email?: string }
    if (!decoded?.userId) return
    await createActivityLog({
      entityType: 'user',
      entityId: decoded.userId,
      action: 'Đăng xuất',
      actionType: 'system',
      metadata: { email: decoded.email },
      createdBy: decoded.userId,
    })
  } catch {
    // ignore invalid/expired tokens
  }
}

// POST /api/auth/logout - Clear auth cookie (no auth required)
export async function POST() {
  await logLogoutFromCookie()

  const response = apiSuccess({ success: true })

  response.cookies.set({
    name: TOKEN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })

  return response
}

// GET for convenience
export async function GET() {
  return POST()
}
