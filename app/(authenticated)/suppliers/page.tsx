import type { Metadata } from 'next'
import { SuppliersPage } from '@/features/suppliers/page'

export const metadata: Metadata = {
  title: 'Nhà cung cấp',
  description: 'Quản lý thông tin nhà cung cấp',
}

export default function Page() {
  return <SuppliersPage />
}
