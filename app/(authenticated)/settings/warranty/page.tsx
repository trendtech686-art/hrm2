import type { Metadata } from 'next'
import { WarrantySettingsPage } from '@/features/settings/warranty/warranty-settings-page'

export const metadata: Metadata = {
  title: 'Cài đặt bảo hành',
  description: 'Quản lý cài đặt bảo hành',
}

export default function Page() {
  return <WarrantySettingsPage />
}
