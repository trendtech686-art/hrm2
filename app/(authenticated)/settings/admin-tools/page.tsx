import type { Metadata } from 'next'
import { AdminToolsPage } from '@/features/settings/admin-tools/admin-tools-page'

export const metadata: Metadata = {
  title: 'Công cụ quản trị',
  description: 'Công cụ quản trị dành cho Admin',
}

export default function Page() {
  return <AdminToolsPage />
}
