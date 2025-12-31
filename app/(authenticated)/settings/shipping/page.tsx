import type { Metadata } from 'next'
import { ShippingPartnersPage } from '@/features/settings/shipping/page'

export const metadata: Metadata = {
  title: 'Cài đặt vận chuyển',
  description: 'Quản lý đối tác vận chuyển',
}

export default function Page() {
  return <ShippingPartnersPage />
}
