import type { Metadata } from 'next'
import { InventoryCheckFormPage } from '@/features/inventory-checks/form-page'

export const metadata: Metadata = {
  title: 'Chỉnh sửa phiếu kiểm kê',
  description: 'Chỉnh sửa thông tin phiếu kiểm kê',
}

export default function Page() {
  return <InventoryCheckFormPage />
}
