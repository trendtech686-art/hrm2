import type { NextAuthConfig, Session } from "next-auth"

// NOTE: We can't import prisma here because this file is used by middleware (Edge runtime)
// The actual database check happens in auth.ts

export const authConfig: NextAuthConfig = {
  providers: [], // Providers are defined in auth.ts (not here, because Edge runtime can't use Prisma)
  callbacks: {
    async jwt({ token, user }) {
      const debugAuth = process.env.NEXTAUTH_DEBUG === 'true' || process.env.NEXTAUTH_DEBUG === '1';
      if (debugAuth) console.warn("[Auth Config] jwt callback - user:", user ? { id: user.id, role: user.role } : "no user");
      if (user) {
        token.id = user.id
        token.name = user.name // Store employee fullName in token
        token.role = user.role
        token.employeeId = user.employeeId
        token.employee = user.employee
      }
      if (debugAuth) console.warn("[Auth Config] jwt callback - token:", { id: token.id, role: token.role });
      return token
    },
    async session({ session, token }) {
      const debugAuth = process.env.NEXTAUTH_DEBUG === 'true' || process.env.NEXTAUTH_DEBUG === '1';
      if (debugAuth) console.warn("[Auth Config] session callback - token:", { id: token.id, role: token.role });
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string // Restore name from token
        session.user.role = token.role as string
        session.user.employeeId = token.employeeId as string | undefined
        session.user.employee = token.employee as Session['user']['employee']
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isPublicPage = 
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/setup") ||
        nextUrl.pathname.startsWith("/api/") || // All API routes handled by middleware with JSON responses
        nextUrl.pathname.startsWith("/complaint-tracking") ||
        nextUrl.pathname.startsWith("/warranty-tracking") ||
        nextUrl.pathname.startsWith("/warranty/tracking")
      
      if (isPublicPage) return true
      if (isLoggedIn) return true
      
      return false // Redirect to login
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day (reduced from 7 days)
    updateAge: 60 * 60, // Rotate token every 1 hour of activity
  },
  trustHost: true,
}
