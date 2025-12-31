import type { Metadata } from 'next'
import { PackagingDetailPage } from '@/features/packaging/detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết đóng gói',
  description: 'Xem thông tin phiếu đóng gói',
}

export default function Page() {
  return <PackagingDetailPage />
}
