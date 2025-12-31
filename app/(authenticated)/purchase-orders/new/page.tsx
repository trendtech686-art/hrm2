import type { Metadata } from 'next'
import { PurchaseOrderFormPage } from '@/features/purchase-orders/form-page'

export const metadata: Metadata = {
  title: 'Tạo đơn mua hàng mới',
  description: 'Tạo đơn mua hàng từ NCC',
}

export default function Page() {
  return <PurchaseOrderFormPage />
}
