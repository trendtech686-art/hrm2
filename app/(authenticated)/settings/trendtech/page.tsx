import type { Metadata } from 'next'
import { TrendtechSettingsPage } from '@/features/settings/trendtech/trendtech-settings-page'

export const metadata: Metadata = {
  title: 'Trendtech',
  description: 'Đồng bộ với Trendtech',
}

export default function Page() {
  return <TrendtechSettingsPage />
}
