import type { Metadata } from 'next'
import { ShippingPartnerDetailPage } from '@/features/settings/shipping/partner-detail-page'

export const metadata: Metadata = {
  title: 'Quản lý đối tác vận chuyển',
  description: 'Quản lý tài khoản và cấu hình đối tác vận chuyển',
}

export default function Page() {
  return <ShippingPartnerDetailPage />
}
