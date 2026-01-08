import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"

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
        console.log("[Auth] authorize called with:", { email: credentials?.email });
        
        if (!credentials?.email || !credentials?.password) {
          console.log("[Auth] Missing credentials");
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        try {
          console.log("[Auth] Looking up user:", email);
          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              employee: {
                select: {
                  systemId: true,
                  fullName: true,
                  department: { select: { systemId: true, name: true } },
                  branch: { select: { systemId: true, name: true } },
                  jobTitle: { select: { systemId: true, name: true } },
                },
              },
            },
          })

          console.log("[Auth] User found:", user ? { email: user.email, isActive: user.isActive } : null);

          if (!user || !user.isActive) {
            console.log("[Auth] User not found or inactive");
            return null
          }

          const isValidPassword = await bcrypt.compare(password, user.password)
          console.log("[Auth] Password valid:", isValidPassword);
          
          if (!isValidPassword) {
            console.log("[Auth] Invalid password");
            return null
          }

          // Update last login
          await prisma.user.update({
            where: { systemId: user.systemId },
            data: { lastLogin: new Date() },
          })

          // Return only serializable data (no Decimal, Date objects etc.)
          const returnUser = {
            id: user.systemId,
            email: user.email,
            name: user.employee?.fullName || user.email,
            role: user.role as string,
            employeeId: user.employeeId ?? undefined,
            employee: user.employee ? {
              systemId: user.employee.systemId,
              name: user.employee.fullName,
              fullName: user.employee.fullName,
              departmentName: user.employee.department?.name ?? null,
              branchName: user.employee.branch?.name ?? null,
              jobTitleName: user.employee.jobTitle?.name ?? null,
            } : undefined,
          }
          console.log("[Auth] Returning user:", { id: returnUser.id, email: returnUser.email, role: returnUser.role });
          return returnUser
        } catch (error) {
          console.error("[Auth] Auth error:", error)
          return null
        }
      },
    }),
  ],
})
