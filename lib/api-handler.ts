/**
 * Centralized API Route Handler Wrapper
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Composes auth, rate limiting, error handling, and logging into a single wrapper.
 * Replaces manual `requireAuth()` + `checkRateLimit()` + try/catch in every route.
 * 
 * @example
 * // Authenticated route with rate limiting (default: 60 req/min)
 * export const GET = apiHandler(async (req, { session, params }) => {
 *   const data = await prisma.customer.findMany()
 *   return apiSuccess(data)
 * })
 * 
 * // Custom rate limit + public access
 * export const POST = apiHandler(
 *   async (req, { params }) => {
 *     const body = await req.json()
 *     return apiSuccess({ ok: true }, 201)
 *   },
 *   { auth: false, rateLimit: { max: 10, windowMs: 60_000 } }
 * )
 * 
 * // No rate limiting (internal/cron)
 * export const GET = apiHandler(handler, { rateLimit: false })
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/api-utils'
import { checkRateLimit } from '@/lib/security-utils'
import * as Sentry from '@sentry/nextjs'
import type { ApiSession } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { type Permission } from '@/features/employees/permissions'
import { getEffectiveRole } from '@/lib/rbac/get-role'
import { resolvePermissions } from '@/lib/rbac/resolve-permissions'

// ============================================
// TYPES
// ============================================

export interface ApiHandlerOptions {
  /** Require authentication (default: true) */
  auth?: boolean
  /** Required permission(s). Implies auth: true. */
  permission?: Permission | Permission[]
  /** Rate limiting config. false = disabled. Default: { max: 60, windowMs: 60_000 } */
  rateLimit?: false | { max?: number; windowMs?: number }
}

export interface ApiContext {
  /** Authenticated session (null if auth: false) */
  session: ApiSession | null
  /** Route dynamic params from Next.js */
  params: Record<string, string>
}

type ApiHandlerFn = (
  request: NextRequest,
  context: ApiContext
) => Promise<NextResponse> | NextResponse

// ============================================
// DEFAULT OPTIONS
// ============================================

const DEFAULT_RATE_LIMIT = { max: 60, windowMs: 60_000 } as const

// ============================================
// MAIN HANDLER
// ============================================

/**
 * Wraps an API route handler with auth, rate limiting, and error handling.
 * 
 * @param handler - The actual route logic
 * @param options - Configuration for auth and rate limiting
 */
export function apiHandler(
  handler: ApiHandlerFn,
  options: ApiHandlerOptions = {}
) {
  const {
    auth: requireAuthentication = true,
    permission: requiredPermission,
    rateLimit: rateLimitConfig = DEFAULT_RATE_LIMIT,
  } = options
  // If permission is specified, auth is always required
  const needsAuth = requireAuthentication || !!requiredPermission

  return async (
    request: NextRequest,
    routeContext?: { params?: Promise<Record<string, string>> }
  ): Promise<NextResponse> => {
    try {
      // 1. Rate Limiting
      if (rateLimitConfig !== false) {
        const { max = 60, windowMs = 60_000 } = rateLimitConfig
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
          || request.headers.get('x-real-ip')
          || 'unknown'
        const path = new URL(request.url).pathname
        const key = `${ip}:${request.method}:${path}`

        const result = checkRateLimit(key, max, windowMs)
        if (!result.allowed) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Too many requests. Please try again later.',
              message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
            },
            {
              status: 429,
              headers: {
                'Retry-After': String(Math.ceil((result.resetTime - Date.now()) / 1000)),
                'X-RateLimit-Limit': String(max),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': String(result.resetTime),
              },
            }
          )
        }
      }

      // 2. Authentication
      let session: ApiSession | null = null
      if (needsAuth) {
        const authSession = await getSessionFromCookie()
        if (!authSession?.user) {
          return NextResponse.json(
            { success: false, error: 'Unauthorized', message: 'Chưa đăng nhập' },
            { status: 401 }
          )
        }
        session = authSession as ApiSession
      }

      // 2b. Permission check
      if (requiredPermission && session) {
        const perms = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission]
        const role = getEffectiveRole(session.user) ?? session.user.role
        const resolved = await resolvePermissions(role)
        const hasAll = perms.every(p => resolved.includes(p))
        if (!hasAll) {
          return NextResponse.json(
            { success: false, error: 'Forbidden', message: 'Bạn không có quyền thực hiện thao tác này' },
            { status: 403 }
          )
        }
      }

      // 3. Resolve params
      const params = routeContext?.params ? await routeContext.params : {}

      // 4. Execute handler
      return await handler(request, { session, params })
    } catch (error) {
      // 5. Error handling + Sentry
      logError(`[API] ${request.method} ${request.url}`, error)
      Sentry.captureException(error, {
        extra: {
          method: request.method,
          url: request.url,
        },
      })

      const message = process.env.NODE_ENV === 'development'
        ? (error instanceof Error ? error.message : String(error))
        : 'Internal server error'

      return NextResponse.json(
        { success: false, error: message, message: 'Có lỗi xảy ra. Vui lòng thử lại.' },
        { status: 500 }
      )
    }
  }
}
