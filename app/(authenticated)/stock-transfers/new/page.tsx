import type { Metadata } from 'next'
import { StockTransferFormPage } from '@/features/stock-transfers/components/form-page'

export const metadata: Metadata = {
  title: 'Tạo phiếu chuyển kho mới',
  description: 'Tạo phiếu chuyển kho hàng',
}

export default function Page() {
  return <StockTransferFormPage />
}
