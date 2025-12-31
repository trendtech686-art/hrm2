import type { Metadata } from 'next'
import { OrdersPage } from '@/features/orders/page'

export const metadata: Metadata = {
  title: 'Đơn hàng',
  description: 'Quản lý đơn hàng bán hàng',
}

export default function Page() {
  return <OrdersPage />
}
