import type { Metadata } from 'next'
import { InventoryCheckFormPage } from '@/features/inventory-checks/form-page'

export const metadata: Metadata = {
  title: 'Tạo phiếu kiểm kê mới',
  description: 'Tạo phiếu kiểm kê kho',
}

export default function Page() {
  return <InventoryCheckFormPage />
}
