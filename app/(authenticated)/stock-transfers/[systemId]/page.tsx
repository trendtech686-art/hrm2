import type { Metadata } from 'next'
import { StockTransferDetailPage } from '@/features/stock-transfers/components/detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết chuyển kho',
  description: 'Xem thông tin phiếu chuyển kho',
}

export default function Page() {
  return <StockTransferDetailPage />
}
