import type { Metadata } from 'next'
import { ReceiptFormPage } from '@/features/receipts/form-page'

export const metadata: Metadata = {
  title: 'Tạo phiếu thu mới',
  description: 'Tạo phiếu thu tiền mới',
}

export default function Page() {
  return <ReceiptFormPage />
}
