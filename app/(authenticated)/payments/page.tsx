import type { Metadata } from 'next'
import { PaymentsPage } from '@/features/payments/page'

export const metadata: Metadata = {
  title: 'Thanh toán',
  description: 'Quản lý phiếu thanh toán',
}

export default function Page() {
  return <PaymentsPage />
}
