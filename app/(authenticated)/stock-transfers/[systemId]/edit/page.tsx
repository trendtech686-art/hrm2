import type { Metadata } from 'next'
import { StockTransferEditPage } from '@/features/stock-transfers/components/edit-page'

export const metadata: Metadata = {
  title: 'Chỉnh sửa phiếu chuyển kho',
  description: 'Chỉnh sửa thông tin phiếu chuyển kho',
}

export default function Page() {
  return <StockTransferEditPage />
}
