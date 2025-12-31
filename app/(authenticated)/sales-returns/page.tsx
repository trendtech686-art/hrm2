import type { Metadata } from 'next'
import { SalesReturnsPage } from '@/features/sales-returns/page'

export const metadata: Metadata = {
  title: 'Phiếu trả hàng bán',
  description: 'Quản lý các phiếu trả hàng bán',
}

export default function Page() {
  return <SalesReturnsPage />
}
