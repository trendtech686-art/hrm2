import type { Metadata } from 'next'
import { SupplierFormPage } from '@/features/suppliers/form-page'

export const metadata: Metadata = {
  title: 'Chỉnh sửa nhà cung cấp',
  description: 'Chỉnh sửa thông tin nhà cung cấp',
}

export default function Page() {
  return <SupplierFormPage />
}
