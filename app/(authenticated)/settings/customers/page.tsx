import type { Metadata } from 'next'
import CustomerSettingsPage from '@/features/settings/customers/page'

export const metadata: Metadata = {
  title: 'Cài đặt khách hàng',
  description: 'Quản lý loại khách hàng và cài đặt',
}

export default function Page() {
  return <CustomerSettingsPage />
}
