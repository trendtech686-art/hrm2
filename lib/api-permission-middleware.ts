/**
 * API Permission Middleware
 * 
 * Centralized permission enforcement for ALL API routes.
 * Uses the route→permission map to check permissions without
 * modifying individual route files.
 * 
 * This is imported in the Next.js API middleware chain.
 */

import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/auth'
import { hasPermission } from '@/features/employees/permissions'
import { getRequiredPermission } from '@/lib/api-permission-map'

/**
 * Check permissions for API routes.
 * Returns null if allowed, NextResponse if denied.
 */
export async function checkApiPermission(
  request: NextRequest
): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl
  
  // Only handle /api/ routes
  if (!pathname.startsWith('/api/')) return null
  
  // Extract the path after /api/
  const apiPath = pathname.replace(/^\/api\//, '')
  const method = request.method
  
  // Look up required permission
  const requiredPermission = getRequiredPermission(apiPath, method)
  
  // No permission required — let the route handle its own auth
  if (!requiredPermission) return null
  
  // Get session
  const session = await auth()
  
  // Not authenticated
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized', message: 'Chưa đăng nhập' },
      { status: 401 }
    )
  }
  
  // Check permission
  const role = (session.user as { role?: string }).role
  if (!role || !hasPermission(role, requiredPermission)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Forbidden',
        message: 'Bạn không có quyền thực hiện thao tác này',
        requiredPermission,
      },
      { status: 403 }
    )
  }
  
  // Allowed
  return null
}
