import type { Metadata } from 'next'
import { ForgotPasswordPage } from '@/features/auth/forgot-password-page'

export const metadata: Metadata = {
  title: 'Quên mật khẩu',
  description: 'Đặt lại mật khẩu qua email',
}

export default function Page() {
  return <ForgotPasswordPage />
}
