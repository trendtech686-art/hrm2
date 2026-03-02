import type { Metadata } from 'next'
import { PurchaseReturnsPage } from '@/features/purchase-returns/page'

export const metadata: Metadata = {
  title: 'Phiếu trả hàng nhập',
  description: 'Quản lý các phiếu trả hàng nhập',
}

export default function Page() {
  return <PurchaseReturnsPage />
}
