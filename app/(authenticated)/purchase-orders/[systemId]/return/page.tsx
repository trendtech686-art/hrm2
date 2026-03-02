import type { Metadata } from 'next'
import { PurchaseReturnForOrderPage } from '@/features/purchase-returns/return-for-order-page'

export const metadata: Metadata = {
  title: 'Hoàn trả hàng nhập',
  description: 'Tạo phiếu hoàn trả cho đơn nhập hàng',
}

export default function Page() {
  return <PurchaseReturnForOrderPage />
}
