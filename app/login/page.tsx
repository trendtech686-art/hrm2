"use client"

import { Suspense } from 'react'
// Re-export existing login page with Next.js wrapper
import { LoginPage as OriginalLoginPage } from '@/features/auth/login-page'

// Loading fallback for Suspense
function LoginLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <OriginalLoginPage />
    </Suspense>
  )
}
