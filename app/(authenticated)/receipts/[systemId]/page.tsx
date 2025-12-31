import type { Metadata } from 'next'
import { ReceiptDetailPage } from '@/features/receipts/detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết phiếu thu',
  description: 'Xem thông tin phiếu thu',
}

export default function Page() {
  return <ReceiptDetailPage />
}
