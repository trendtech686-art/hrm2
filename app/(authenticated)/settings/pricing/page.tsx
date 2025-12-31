import type { Metadata } from 'next'
import { PricingSettingsPage } from '@/features/settings/pricing/page'

export const metadata: Metadata = {
  title: 'Cài đặt giá',
  description: 'Quản lý cài đặt giá bán',
}

export default function Page() {
  return <PricingSettingsPage />
}
