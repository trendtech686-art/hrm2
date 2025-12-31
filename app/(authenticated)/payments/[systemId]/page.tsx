import type { Metadata } from 'next'
import { PaymentDetailPage } from '@/features/payments/detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết thanh toán',
  description: 'Xem thông tin phiếu thanh toán',
}

export default function Page() {
  return <PaymentDetailPage />
}
