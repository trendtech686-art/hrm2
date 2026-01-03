import type { Metadata } from 'next'
import { OtherSettingsPage } from '@/features/settings/other'

export const metadata: Metadata = {
  title: 'Cài đặt khác',
  description: 'Các cài đặt hệ thống khác',
}

export default function Page() {
  return <OtherSettingsPage />
}
