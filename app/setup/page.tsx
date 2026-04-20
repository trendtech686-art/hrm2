import type { Metadata } from 'next'
import { SetupPage } from './setup-client'

export const metadata: Metadata = {
  title: 'Khởi tạo hệ thống',
  description: 'Tạo tài khoản quản trị viên đầu tiên',
}

export default function Page() {
  return <SetupPage />
}
