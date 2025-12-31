import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LoginPage as OriginalLoginPage } from '@/features/auth/login-page'

export const metadata: Metadata = {
  title: 'Đăng nhập',
  description: 'Đăng nhập vào hệ thống quản lý',
}

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
