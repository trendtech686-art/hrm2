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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        try {
          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              employee: {
                include: {
                  department: true,
                  branch: true,
                  jobTitle: true,
                },
              },
            },
          })

          if (!user || !user.isActive) {
            return null
          }

          const isValidPassword = await bcrypt.compare(password, user.password)
          if (!isValidPassword) {
            return null
          }

          // Update last login
          await prisma.user.update({
            where: { systemId: user.systemId },
            data: { lastLogin: new Date() },
          })

          return {
            id: user.systemId,
            email: user.email,
            name: user.employee?.fullName || user.email,
            role: user.role,
            employeeId: user.employeeId,
            employee: user.employee,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
})
