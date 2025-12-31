import type { Metadata } from 'next'
import { InventoryReceiptsPage } from '@/features/inventory-receipts/page'

export const metadata: Metadata = {
  title: 'Phiếu nhập kho',
  description: 'Quản lý các phiếu nhập kho',
}

export default function Page() {
  return <InventoryReceiptsPage />
}
