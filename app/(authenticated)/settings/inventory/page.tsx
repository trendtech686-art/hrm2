import type { Metadata } from 'next'
import { InventorySettingsPage } from '@/features/settings/inventory/page'

export const metadata: Metadata = {
  title: 'Cài đặt kho hàng',
  description: 'Quản lý danh mục, thương hiệu và cài đặt kho',
}

export default function Page() {
  return <InventorySettingsPage />
}
