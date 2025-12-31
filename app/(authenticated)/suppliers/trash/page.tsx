import type { Metadata } from 'next'
import { SuppliersTrashPage } from '@/features/suppliers/trash-page'

export const metadata: Metadata = {
  title: 'Thùng rác nhà cung cấp',
  description: 'Quản lý nhà cung cấp đã xóa',
}

export default function Page() {
  return <SuppliersTrashPage />
}
