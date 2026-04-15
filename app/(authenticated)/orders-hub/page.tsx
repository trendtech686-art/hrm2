import type { Metadata } from 'next'
import { OrdersHubPage } from '@/features/orders/components/orders-hub-page'

export const metadata: Metadata = {
  title: 'Đơn hàng',
  description: 'Quản lý đơn hàng, đóng gói, trả hàng',
}

export default function Page() {
  return <OrdersHubPage />
}
