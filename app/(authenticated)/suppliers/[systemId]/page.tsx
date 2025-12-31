import type { Metadata } from 'next'
import { SupplierDetailPage } from '@/features/suppliers/detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết nhà cung cấp',
  description: 'Xem thông tin nhà cung cấp',
}

export default function Page() {
  return <SupplierDetailPage />
}
