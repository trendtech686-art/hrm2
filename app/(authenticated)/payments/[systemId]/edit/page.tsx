import type { Metadata } from 'next'
import { PaymentFormPage } from '@/features/payments/form-page'

export const metadata: Metadata = {
  title: 'Chỉnh sửa phiếu thanh toán',
  description: 'Chỉnh sửa thông tin phiếu thanh toán',
}

export default function Page() {
  return <PaymentFormPage />
}
