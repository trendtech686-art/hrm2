import type { Metadata } from 'next'
import { PurchaseOrderFormPage } from '@/features/purchase-orders/form-page'

export const metadata: Metadata = {
  title: 'Chỉnh sửa đơn nhập hàng',
  description: 'Chỉnh sửa thông tin đơn nhập hàng',
}

export default function Page() {
  return <PurchaseOrderFormPage />
}
