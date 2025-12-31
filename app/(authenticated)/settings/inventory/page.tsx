import type { Metadata } from 'next'
import { InventorySettingsPage } from '@/features/settings/inventory/page'

export const metadata: Metadata = {
  title: 'Cài đặt kho hàng',
  description: 'Quản lý cài đặt kho hàng, thương hiệu, danh mục',
}

export default function Page() {
  return <InventorySettingsPage />
}
