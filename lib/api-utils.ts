/**
 * API Utilities - Auth & Validation Middleware
 * 
 * Provides standardized authentication and validation for all API routes.
 * 
 * @example
 * ```typescript
 * import { requireAuth, validateBody, apiError, apiSuccess } from '@/lib/api-utils'
 * import { createCustomerSchema } from './validation'
 * 
 * export async function POST(request: Request) {
 *   const session = await requireAuth()
 *   if (!session) return apiError('Unauthorized', 401)
 *   
 *   const result = await validateBody(request, createCustomerSchema)
 *   if (!result.success) return apiError(result.error, 400)
 *   
 *   // ... process result.data
 *   return apiSuccess(data, 201)
 * }
 * ```
 */

import { API_MAX_PAGE_LIMIT } from '@/lib/pagination-constants'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decode } from 'next-auth/jwt'
import { z } from 'zod'
import { logError } from '@/lib/logger'
import { type Permission } from '@/features/employees/permissions'
import { getEffectiveRole, isAdminRole, isAdminOrManagerRole } from '@/lib/rbac/get-role'
import { resolvePermissions } from '@/lib/rbac/resolve-permissions'

// ============================================
// DECIMAL SERIALIZATION HELPER
// ============================================

/**
 * Recursively convert Prisma Decimal objects to numbers and Date objects to ISO strings
 */
export function serializeDecimals<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  
  // Check if it's a Date object - convert to ISO string
  if (obj instanceof Date) {
    return obj.toISOString() as unknown as T;
  }
  
  // Check if it's a Decimal-like object (has toNumber method)
  if (typeof obj === 'object' && obj !== null && 'toNumber' in obj && typeof (obj as { toNumber: () => number }).toNumber === 'function') {
    return (obj as { toNumber: () => number }).toNumber() as unknown as T;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => serializeDecimals(item)) as unknown as T;
  }
  
  // Handle objects
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = serializeDecimals((obj as Record<string, unknown>)[key]);
      }
    }
    return result as T;
  }
  
  return obj;
}

// ============================================
// SESSION FROM COOKIE (Next.js 16 workaround)
// ============================================

/**
 * Get session by reading the JWT cookie directly and decoding it.
 * 
 * Workaround for next-auth v5 `auth()` not working in Next.js 16
 * server actions and route handlers. The `auth()` function uses
 * `headers()` → `createActionURL()` → `Auth()` which breaks in
 * Next.js 16's async context.
 * 
 * @see https://github.com/nextauthjs/next-auth/issues/13388
 */
export async function getSessionFromCookie(): Promise<ApiSession | null> {
  try {
    const cookieStore = await cookies()

    // NextAuth v5 chia nhỏ cookie khi JWT > ~4KB (thường xảy ra với admin có nhiều permissions).
    // Khi đó browser giữ các cookie `authjs.session-token.0`, `authjs.session-token.1`,...
    // thay vì cookie `authjs.session-token` đơn lẻ. Cần ghép lại đúng thứ tự rồi mới decode.
    const readToken = (baseName: string): { name: string; value: string } | null => {
      const single = cookieStore.get(baseName)
      if (single?.value) return { name: baseName, value: single.value }

      const chunks: { index: number; value: string }[] = []
      for (const c of cookieStore.getAll()) {
        if (!c.name.startsWith(`${baseName}.`)) continue
        const suffix = c.name.slice(baseName.length + 1)
        const index = Number(suffix)
        if (!Number.isInteger(index) || index < 0) continue
        chunks.push({ index, value: c.value })
      }
      if (chunks.length === 0) return null
      chunks.sort((a, b) => a.index - b.index)
      return { name: baseName, value: chunks.map(c => c.value).join('') }
    }

    // Try non-secure cookie first (HTTP / localhost), then secure (HTTPS)
    const tokenCookie =
      readToken('authjs.session-token') ??
      readToken('__Secure-authjs.session-token')

    if (!tokenCookie?.value) {
      return null
    }

    // Salt must match cookie name for decryption
    const decoded = await decode({
      token: tokenCookie.value,
      secret: process.env.AUTH_SECRET!,
      salt: tokenCookie.name,
    })

    if (!decoded) return null

    // Map decoded JWT token fields to our session shape.
    // Fields come from the `jwt` callback in auth.config.ts.
    return {
      user: {
        id: (decoded.id ?? decoded.sub) as string,
        email: decoded.email as string,
        name: decoded.name as string,
        role: decoded.role as string,
        employeeId: decoded.employeeId as string | undefined,
        employee: decoded.employee as ApiSession['user']['employee'],
      }
    }
  } catch (error) {
    // Re-throw Next.js internal errors (DYNAMIC_SERVER_USAGE, NEXT_REDIRECT, etc.)
    // so the framework can properly detect dynamic routes during static generation
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error
    }
    logError('[getSessionFromCookie] JWT decode error', error)
    return null
  }
}

// ============================================
// TYPES
// ============================================

export interface ApiSession {
  user: {
    id: string
    email: string
    name: string
    role: string
    employeeId?: string
    employee?: {
      systemId: string
      name: string
      fullName: string
      role?: string | null
      workEmail?: string | null
      departmentName: string | null
      branchName: string | null
      jobTitleName: string | null
    } | null
  }
}

export type ValidationSuccess<T> = {
  success: true
  data: T
}

export type ValidationError = {
  success: false
  error: string
  details?: z.ZodIssue[]
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationError

/**
 * Type guard to check if validation failed
 */
export function isValidationError<T>(
  result: ValidationResult<T>
): result is ValidationError {
  return !result.success
}

export { API_MAX_PAGE_LIMIT } from '@/lib/pagination-constants'

export interface PaginationParams {
  page: number
  limit: number
  skip: number
  /**
   * limit=0 trên query: một truy vấn với `limit` tối đa API_MAX_PAGE_LIMIT (không phải toàn bộ DB).
   */
  noPagination?: boolean
}

// ============================================
// AUTH MIDDLEWARE
// ============================================

/**
 * Require authentication for API routes
 * Returns session if authenticated, null otherwise
 * 
 * Uses direct cookie JWT decode as workaround for Next.js 16 + next-auth v5 issue.
 * @see https://github.com/nextauthjs/next-auth/issues/13388
 * 
 * @example
 * const session = await requireAuth()
 * if (!session) return apiError('Unauthorized', 401)
 */
export async function requireAuth(): Promise<ApiSession | null> {
  try {
    const session = await getSessionFromCookie()
    if (!session?.user) {
      return null
    }
    return session
  } catch (error) {
    logError('Auth check error', error)
    return null
  }
}

/**
 * Get optional auth - doesn't require but returns if present
 */
export async function optionalAuth(): Promise<ApiSession | null> {
  try {
    const session = await getSessionFromCookie()
    return session?.user ? (session as ApiSession) : null
  } catch {
    return null
  }
}

// ============================================
// PERMISSION MIDDLEWARE
// ============================================

/**
 * Require authentication AND a specific permission.
 * Returns session if authorized, or a 403 NextResponse if not.
 * 
 * @example
 * const result = await requirePermission('create_tasks')
 * if (result instanceof NextResponse) return result  // 401 or 403
 * const session = result  // ApiSession
 */
export async function requirePermission(
  permission: Permission
): Promise<ApiSession | NextResponse> {
  const session = await requireAuth()
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized', message: 'Chưa đăng nhập' },
      { status: 401 }
    )
  }

  const role = getEffectiveRole(session.user) ?? session.user.role
  const resolved = await resolvePermissions(role)
  if (!resolved.includes(permission)) {
    return NextResponse.json(
      { success: false, error: 'Forbidden', message: 'Bạn không có quyền thực hiện thao tác này' },
      { status: 403 }
    )
  }

  return session
}

/**
 * Require authentication AND all of the specified permissions.
 * Use for operations that need multiple permissions (e.g., edit + approve).
 */
export async function requireAllPermissions(
  permissions: Permission[]
): Promise<ApiSession | NextResponse> {
  const session = await requireAuth()
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized', message: 'Chưa đăng nhập' },
      { status: 401 }
    )
  }

  const role = getEffectiveRole(session.user) ?? session.user.role
  const resolved = await resolvePermissions(role)
  if (!permissions.every(p => resolved.includes(p))) {
    return NextResponse.json(
      { success: false, error: 'Forbidden', message: 'Bạn không có quyền thực hiện thao tác này' },
      { status: 403 }
    )
  }

  return session
}

/**
 * Check permission in server actions (returns error result instead of NextResponse).
 * 
 * Uses direct cookie JWT decode as workaround for Next.js 16 + next-auth v5 issue.
 * @see https://github.com/nextauthjs/next-auth/issues/13388
 * 
 * @example
 * const authResult = await requireActionPermission('create_tasks')
 * if (!authResult.success) return authResult
 * const { session } = authResult
 */
export async function requireActionPermission(
  permission: Permission
): Promise<
  | { success: true; session: ApiSession }
  | { success: false; error: string }
> {
  try {
    const session = await getSessionFromCookie()
    if (!session?.user) {
      return { success: false, error: 'Phiên đăng nhập hết hạn. Vui lòng tải lại trang (F5) hoặc đăng nhập lại.' }
    }

    const role = getEffectiveRole(session.user) ?? session.user.role
    const resolved = await resolvePermissions(role)
    if (!resolved.includes(permission)) {
      return { success: false, error: 'Bạn không có quyền thực hiện thao tác này' }
    }

    return { success: true, session }
  } catch (error) {
    logError('Permission check error', error)
    return { success: false, error: 'Lỗi kiểm tra quyền hạn' }
  }
}

/**
 * Helper: check if session user is admin
 */
export function isAdmin(session: ApiSession): boolean {
  return isAdminRole(session.user)
}

/**
 * Helper: check if session user is admin or manager
 */
export function isAdminOrManager(session: ApiSession): boolean {
  return isAdminOrManagerRole(session.user)
}

// ============================================
// VALIDATION MIDDLEWARE
// ============================================

/**
 * Validate request body against Zod schema
 * 
 * @example
 * const result = await validateBody(request, createCustomerSchema)
 * if (!result.success) return apiError(result.error, 400)
 * const { name, email } = result.data
 */
export async function validateBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<ValidationResult<T>> {
  try {
    const body = await request.json()
    
    // Try direct parse instead of safeParse
    try {
      const data = schema.parse(body)
      return {
        success: true,
        data,
      }
    } catch (parseError) {
      logError('[validateBody] Parse error', parseError)
      if (parseError instanceof z.ZodError) {
        const errorMessages = parseError.issues
          .map(issue => `${issue.path.join('.')}: ${issue.message}`)
          .join(', ')
        return {
          success: false,
          error: errorMessages,
          details: parseError.issues,
        }
      }
      throw parseError
    }
  } catch (error) {
    logError('[validateBody] JSON parse error', error)
    return {
      success: false,
      error: 'Invalid JSON body',
    }
  }
}

/**
 * Validate query parameters against Zod schema
 */
export function validateQuery<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): ValidationResult<T> {
  try {
    const params: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    
    const result = schema.safeParse(params)
    
    if (!result.success) {
      const errorMessages = result.error.issues
        .map(issue => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ')
      
      return {
        success: false,
        error: errorMessages,
        details: result.error.issues,
      }
    }
    
    return {
      success: true,
      data: result.data,
    }
  } catch {
    return {
      success: false,
      error: 'Invalid query parameters',
    }
  }
}

// ============================================
// RESPONSE HELPERS
// ============================================

/**
 * Return successful API response (auto-converts Prisma Decimals to numbers)
 */
export function apiSuccess<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(serializeDecimals(data), { status })
}

/**
 * Create a JSON response with Cache-Control headers for semi-static GET endpoints
 * Useful for settings, filter options, templates, and other rarely-changing data
 */
export function apiSuccessCached(data: unknown, maxAge: number = 60) {
  return NextResponse.json(serializeDecimals(data), {
    headers: {
      'Cache-Control': `private, max-age=${maxAge}, stale-while-revalidate=${maxAge * 5}`,
    },
  })
}

/**
 * Return paginated API response (auto-converts Prisma Decimals to numbers)
 */
export function apiPaginated<T>(
  data: T[],
  pagination: {
    page: number
    limit: number
    total: number
  }
): NextResponse {
  const effectiveLimit = pagination.limit > 0 ? pagination.limit : data.length || 1
  return NextResponse.json({
    data: serializeDecimals(data),
    pagination: {
      ...pagination,
      totalPages: Math.ceil(pagination.total / effectiveLimit),
    },
  })
}

/**
 * Return error API response
 */
export function apiError(
  message: string,
  status = 500,
  details?: unknown
): NextResponse {
  const response: { success: false; error: string; message: string; details?: unknown } = { 
    success: false,
    error: message,
    message: message 
  }
  if (details && process.env.NODE_ENV === 'development') {
    response.details = details
  }
  return NextResponse.json(response, { status })
}

/**
 * Return not found API response
 */
export function apiNotFound(resource = 'Resource'): NextResponse {
  return apiError(`${resource} not found`, 404)
}

// ============================================
// PAGINATION HELPERS
// ============================================

/**
 * Parse pagination from query params
 */
export function parsePagination(searchParams: URLSearchParams): PaginationParams {
  const rawLimit = parseInt(searchParams.get('limit') || '100')
  
  // limit=0: một trang với trần API_MAX_PAGE_LIMIT (legacy); client nên dùng fetchAllPages
  if (rawLimit === 0) {
    return { page: 1, limit: API_MAX_PAGE_LIMIT, skip: 0, noPagination: true }
  }

  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(API_MAX_PAGE_LIMIT, Math.max(1, rawLimit))
  const skip = (page - 1) * limit
  
  return { page, limit, skip }
}

// ============================================
// COMMON SCHEMAS
// ============================================

/**
 * Common pagination query schema
 */
export const paginationSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '100')),
  search: z.string().optional(),
})

/**
 * Common ID param schema
 */
export const systemIdSchema = z.object({
  systemId: z.string().min(1, 'systemId is required'),
})

/**
 * Date range filter schema
 */
export const dateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
}).refine(
  data => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate)
    }
    return true
  },
  { message: 'startDate must be before endDate' }
)
