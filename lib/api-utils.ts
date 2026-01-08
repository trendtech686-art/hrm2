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
    const result = schema.safeParse(body)
    
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
  } catch (_error) {
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
 * Return successful API response
 */
export function apiSuccess<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status })
}

/**
 * Return paginated API response
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
    data,
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
  const response: { error: string; details?: unknown } = { error: message }
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
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
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
  limit: z.string().optional().transform(v => parseInt(v || '20')),
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
