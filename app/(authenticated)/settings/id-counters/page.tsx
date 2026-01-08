import type { Metadata } from 'next'
import { IDCounterSettingsPage } from '@/features/settings/system/id-counter-settings-page'

export const metadata: Metadata = {
  title: 'Quản lý ID & Prefix',
  description: 'Cấu hình prefix, counter và số thứ tự cho tất cả entities',
}

export default function Page() {
  return <IDCounterSettingsPage />
}
