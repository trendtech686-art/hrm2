import type { Metadata } from 'next'
import { WarrantyDetailPage } from '@/features/warranty/warranty-detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết bảo hành',
  description: 'Xem thông tin phiếu bảo hành',
}

export default function Page() {
  return <WarrantyDetailPage />
}
