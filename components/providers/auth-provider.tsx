"use client"

import { SessionProvider } from "next-auth/react"

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider
      // Disable automatic session refetch on window focus to reduce API calls
      refetchOnWindowFocus={false}
      // Refetch session every 5 minutes instead of default (which is more aggressive)
      refetchInterval={5 * 60}
    >
      {children}
    </SessionProvider>
  )
}
