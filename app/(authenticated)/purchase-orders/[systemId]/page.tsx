import type { Metadata } from 'next'
import { PurchaseOrderDetailPage } from '@/features/purchase-orders/detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết đơn mua hàng',
  description: 'Xem thông tin đơn mua hàng',
}

export default function Page() {
  return <PurchaseOrderDetailPage />
}
