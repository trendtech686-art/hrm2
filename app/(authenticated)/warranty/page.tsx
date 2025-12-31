import type { Metadata } from 'next'
import { WarrantyListPage } from '@/features/warranty/warranty-list-page'

export const metadata: Metadata = {
  title: 'Bảo hành',
  description: 'Quản lý phiếu bảo hành sản phẩm',
}

export default function Page() {
  return <WarrantyListPage />
}
