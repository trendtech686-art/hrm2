import type { Metadata } from 'next'
import { ComplaintsSettingsPage } from '@/features/settings/complaints/complaints-settings-page'

export const metadata: Metadata = {
  title: 'Cài đặt khiếu nại',
  description: 'Quản lý cài đặt khiếu nại',
}

export default function Page() {
  return <ComplaintsSettingsPage />
}
