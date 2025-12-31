import type { Metadata } from 'next'
import { OrderFormPage } from '@/features/orders/components/order-form-page'

export const metadata: Metadata = {
  title: 'Tạo đơn hàng mới',
  description: 'Tạo đơn hàng bán hàng',
}

export default function Page() {
  return <OrderFormPage />
}
