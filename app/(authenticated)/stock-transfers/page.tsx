import type { Metadata } from 'next'
import { StockTransfersPage } from '@/features/stock-transfers/page'

export const metadata: Metadata = {
  title: 'Chuyển kho',
  description: 'Quản lý phiếu chuyển kho',
}

export default function Page() {
  return <StockTransfersPage />
}
