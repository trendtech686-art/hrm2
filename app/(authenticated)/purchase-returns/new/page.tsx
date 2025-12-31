import type { Metadata } from 'next'
import { PurchaseReturnFormPage } from '@/features/purchase-returns/form-page'

export const metadata: Metadata = {
  title: 'Tạo phiếu trả hàng NCC',
  description: 'Tạo phiếu trả hàng nhà cung cấp',
}

export default function Page() {
  return <PurchaseReturnFormPage />
}
