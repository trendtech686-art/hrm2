import type { Metadata } from 'next'
import { OrderFormPage } from '@/features/orders/components/order-form-page'

export const metadata: Metadata = {
  title: 'Chỉnh sửa đơn hàng',
  description: 'Chỉnh sửa thông tin đơn hàng',
}

export default function Page() {
  return <OrderFormPage />
}
