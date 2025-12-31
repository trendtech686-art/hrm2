import type { Metadata } from 'next'
import { SalesConfigPage } from '@/features/settings/sales/sales-config-page'

export const metadata: Metadata = {
  title: 'Cài đặt bán hàng',
  description: 'Quản lý cài đặt bán hàng',
}

export default function Page() {
  return <SalesConfigPage />
}
