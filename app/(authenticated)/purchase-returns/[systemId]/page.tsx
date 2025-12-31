import type { Metadata } from 'next'
import { PurchaseReturnDetailPage } from '@/features/purchase-returns/detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết trả hàng NCC',
  description: 'Xem thông tin phiếu trả hàng nhà cung cấp',
}

export default function Page() {
  return <PurchaseReturnDetailPage />
}
