import type { Metadata } from 'next'
import { ShippingHubPage } from '@/features/shipments/components/shipping-hub-page'

export const metadata: Metadata = {
  title: 'Vận chuyển',
  description: 'Quản lý vận chuyển, đóng gói, đối soát',
}

export default function Page() {
  return <ShippingHubPage />
}
