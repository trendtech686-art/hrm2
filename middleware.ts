import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"
import { hasPermission } from "./features/employees/permissions"
import { getRequiredPermission } from "./lib/api-permission-map"

/**
 * Combined middleware:
 * 1. API routes → Permission enforcement via centralized permission map
 * 2. Non-API routes → NextAuth redirect-to-login (existing behavior)
 * 
 * Uses JWT-based auth only (no DB calls) — safe for Edge runtime.
 */
export default NextAuth(authConfig).auth((request) => {
  const { pathname } = request.nextUrl

  // ── API routes: enforce permissions ──────────────────────────
  if (pathname.startsWith('/api/')) {
    const apiPath = pathname.replace(/^\/api\//, '')
    const requiredPermission = getRequiredPermission(apiPath, request.method)

    // No permission required for this route — pass through
    if (!requiredPermission) return NextResponse.next()

    // Session comes from NextAuth JWT (no DB call)
    const session = request.auth

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'Chưa đăng nhập' },
        { status: 401 }
      )
    }

    const role = (session.user as { role?: string; employee?: { role?: string } }).employee?.role
      || (session.user as { role?: string }).role

    if (!role || !hasPermission(role, requiredPermission)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden', message: 'Bạn không có quyền thực hiện thao tác này' },
        { status: 403 }
      )
    }

    return NextResponse.next()
  }

  // ── Non-API routes: NextAuth handles redirect automatically ──
  // The `authorized` callback in authConfig handles the redirect logic
})

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - monitoring (Sentry tunnel - must be unauthenticated)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!monitoring|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
