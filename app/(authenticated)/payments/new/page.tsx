import type { Metadata } from 'next'
import { PaymentFormPage } from '@/features/payments/form-page'

export const metadata: Metadata = {
  title: 'Tạo phiếu thanh toán mới',
  description: 'Tạo phiếu thanh toán mới',
}

export default function Page() {
  return <PaymentFormPage />
}
