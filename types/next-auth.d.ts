import "next-auth"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      employeeId?: string
      employee?: {
        id: string
        fullName: string
        avatar?: string
        department?: {
          id: string
          name: string
        }
        branch?: {
          id: string
          name: string
        }
        jobTitle?: {
          id: string
          name: string
        }
      }
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    employeeId?: string
    employee?: any
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    employeeId?: string
    employee?: any
  }
}
