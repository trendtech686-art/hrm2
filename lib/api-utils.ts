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

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { z } from 'zod'

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

export interface PaginationParams {
  page: number
  limit: number
  skip: number
}

// ============================================
// AUTH MIDDLEWARE
// ============================================

/**
 * Require authentication for API routes
 * Returns session if authenticated, null otherwise
 * 
 * @example
 * const session = await requireAuth()
 * if (!session) return apiError('Unauthorized', 401)
 */
export async function requireAuth(): Promise<ApiSession | null> {
  try {
    const session = await auth()
    if (!session?.user) {
      return null
    }
    return session as ApiSession
  } catch (error) {
    console.error('Auth check error:', error)
    return null
  }
}

/**
 * Get optional auth - doesn't require but returns if present
 */
export async function optionalAuth(): Promise<ApiSession | null> {
  try {
    const session = await auth()
    return session?.user ? (session as ApiSession) : null
  } catch {
    return null
  }
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
    console.log('[validateBody] Body:', JSON.stringify(body).substring(0, 500))
    
    // Try direct parse instead of safeParse
    try {
      const data = schema.parse(body)
      return {
        success: true,
        data,
      }
    } catch (parseError) {
      console.error('[validateBody] Parse error:', parseError)
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
    console.error('[validateBody] JSON parse error:', error)
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
  return NextResponse.json({
    data: serializeDecimals(data),
    pagination: {
      ...pagination,
      totalPages: Math.ceil(pagination.total / pagination.limit),
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
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  // Tăng limit max lên 10000 để hỗ trợ load tất cả sản phẩm
  const limit = Math.min(10000, Math.max(1, parseInt(searchParams.get('limit') || '100')))
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
