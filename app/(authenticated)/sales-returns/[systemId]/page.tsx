import type { Metadata } from 'next'
import { SalesReturnDetailPage } from '@/features/sales-returns/detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết trả hàng',
  description: 'Xem thông tin phiếu trả hàng',
}

export default function Page() {
  return <SalesReturnDetailPage />
}
