import type { Metadata } from 'next'
import { ReceiptFormPage } from '@/features/receipts/form-page'

export const metadata: Metadata = {
  title: 'Chỉnh sửa phiếu thu',
  description: 'Chỉnh sửa thông tin phiếu thu',
}

export default function Page() {
  return <ReceiptFormPage />
}
