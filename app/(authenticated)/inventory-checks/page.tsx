import type { Metadata } from 'next'
import { InventoryChecksPage } from '@/features/inventory-checks/page'

export const metadata: Metadata = {
  title: 'Kiểm kê kho',
  description: 'Quản lý phiếu kiểm kê kho hàng',
}

export default function Page() {
  return <InventoryChecksPage />
}
