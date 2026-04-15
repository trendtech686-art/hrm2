import type { Metadata } from 'next'
import { NotificationSettingsPage } from '@/features/settings/notifications/notification-settings-page'

export const metadata: Metadata = {
  title: 'Cài đặt thông báo',
  description: 'Quản lý cài đặt thông báo hệ thống',
}

export default function Page() {
  return <NotificationSettingsPage />
}
