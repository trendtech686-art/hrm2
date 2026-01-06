import type { Metadata } from 'next'
import PurchaseOrdersPage from '@/features/purchase-orders/page'

export const metadata: Metadata = {
  title: 'Đơn mua hàng',
  description: 'Quản lý đơn mua hàng từ nhà cung cấp',
}

export default function Page() {
  return <PurchaseOrdersPage />
}
