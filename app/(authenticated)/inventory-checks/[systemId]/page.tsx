import type { Metadata } from 'next'
import { InventoryCheckDetailPage } from '@/features/inventory-checks/detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết kiểm kê',
  description: 'Xem thông tin phiếu kiểm kê',
}

export default function Page() {
  return <InventoryCheckDetailPage />
}
