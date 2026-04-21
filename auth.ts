import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"
import { resolvePermissions } from "@/lib/rbac/resolve-permissions"

const debugAuth = process.env.NEXTAUTH_DEBUG === 'true'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _request) {
        if (debugAuth) console.warn("[Auth] authorize called with:", { email: credentials?.email });
        
        if (!credentials?.email || !credentials?.password) {
          if (debugAuth) console.warn("[Auth] Missing credentials");
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Retry logic: Turbopack compile can block event loop for 10-20s,
        // causing transient DB connection timeouts. Retry up to 2 times.
        const MAX_RETRIES = 2
        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
          try {
            if (debugAuth) console.warn(`[Auth] Looking up user: ${email} (attempt ${attempt + 1})`);
            const user = await prisma.user.findUnique({
              where: { email },
              include: {
                employee: {
                  select: {
                    systemId: true,
                    fullName: true,
                    workEmail: true,
                    role: true,
                    department: { select: { systemId: true, name: true } },
                    branch: { select: { systemId: true, name: true } },
                    jobTitle: { select: { systemId: true, name: true } },
                  },
                },
              },
            })

            if (debugAuth) console.warn("[Auth] User found:", user ? { email: user.email, isActive: user.isActive } : null);

            if (!user || !user.isActive) {
              if (debugAuth) console.warn("[Auth] User not found or inactive");
              return null
            }

            const isValidPassword = await bcrypt.compare(password, user.password)
            if (debugAuth) console.warn("[Auth] Password valid:", isValidPassword);
            
            if (!isValidPassword) {
              if (debugAuth) console.warn("[Auth] Invalid password");
              return null
            }

            // Update last login (non-critical, don't fail auth if this errors)
            prisma.user.update({
              where: { systemId: user.systemId },
              data: { lastLogin: new Date() },
            }).catch(e => console.warn('[Auth] Failed to update lastLogin:', e.message))

            // Resolve permissions (custom from DB > default from code)
            // Ưu tiên employee.role (business role) → fallback user.role (enum UserRole)
            const effectiveRole = user.employee?.role || (user.role as string)
            const permissions = await resolvePermissions(effectiveRole)

            // Return only serializable data (no Decimal, Date objects etc.)
            const returnUser = {
              id: user.systemId,
              email: user.email,
              name: user.employee?.fullName || user.email,
              role: user.role as string,
              employeeId: user.employeeId ?? undefined,
              permissions,
              employee: user.employee ? {
                systemId: user.employee.systemId,
                name: user.employee.fullName,
                fullName: user.employee.fullName,
                workEmail: user.employee.workEmail,
                role: user.employee.role,
                departmentName: user.employee.department?.name ?? null,
                branchName: user.employee.branch?.name ?? null,
                jobTitleName: user.employee.jobTitle?.name ?? null,
              } : undefined,
            }
            if (debugAuth) console.warn("[Auth] Returning user:", { id: returnUser.id, email: returnUser.email, role: returnUser.role });
            return returnUser
          } catch (error) {
            const isTimeout = error instanceof Error &&
              (error.message.includes('timeout') || error.message.includes('terminated'))
            
            if (isTimeout && attempt < MAX_RETRIES) {
              console.warn(`[Auth] Connection timeout, retrying (${attempt + 1}/${MAX_RETRIES})...`)
              // Brief pause before retry to let the event loop breathe
              await new Promise(r => setTimeout(r, 1000))
              continue
            }
            
            console.error("[Auth] Auth error:", error)
            return null
          }
        }
        return null
      },
    }),
  ],
})
