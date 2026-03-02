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
        nextUrl.pathname.startsWith("/api/auth") ||
        nextUrl.pathname.startsWith("/api/health") ||
        nextUrl.pathname.startsWith("/api/public/") ||
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
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  trustHost: true,
}
