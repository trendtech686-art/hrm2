import type { Metadata } from 'next'
import { PackagingPage } from '@/features/packaging/page'

export const metadata: Metadata = {
  title: 'Đóng gói',
  description: 'Quản lý đơn hàng cần đóng gói',
}

export default function Page() {
  return <PackagingPage />
}
