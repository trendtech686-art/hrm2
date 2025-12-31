import type { Metadata } from 'next'
import { ReceiptsPage } from '@/features/receipts/page'

export const metadata: Metadata = {
  title: 'Phiếu thu',
  description: 'Quản lý phiếu thu tiền',
}

export default function Page() {
  return <ReceiptsPage />
}
