import type { Metadata } from 'next'
import { InventoryReceiptDetailPage } from '@/features/inventory-receipts/detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết nhập kho',
  description: 'Xem thông tin phiếu nhập kho',
}

export default function Page() {
  return <InventoryReceiptDetailPage />
}
