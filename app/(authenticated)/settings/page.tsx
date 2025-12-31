import type { Metadata } from 'next'
import { SettingsPage } from '@/features/settings/page'

export const metadata: Metadata = {
  title: 'Cài đặt',
  description: 'Cài đặt hệ thống',
}

export default function Page() {
  return <SettingsPage />
}
