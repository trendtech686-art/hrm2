import type { Metadata } from 'next'
import { ShipmentsPage } from '@/features/shipments/page'

export const metadata: Metadata = {
  title: 'Vận chuyển',
  description: 'Quản lý đơn vận chuyển',
}

export default function Page() {
  return <ShipmentsPage />
}
