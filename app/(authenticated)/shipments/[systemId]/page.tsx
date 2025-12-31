import type { Metadata } from 'next'
import { ShipmentDetailPage } from '@/features/shipments/detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết vận chuyển',
  description: 'Xem thông tin đơn vận chuyển',
}

export default function Page() {
  return <ShipmentDetailPage />
}
