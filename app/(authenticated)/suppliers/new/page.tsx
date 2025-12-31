import type { Metadata } from 'next'
import { SupplierFormPage } from '@/features/suppliers/form-page'

export const metadata: Metadata = {
  title: 'Thêm nhà cung cấp mới',
  description: 'Tạo nhà cung cấp mới',
}

export default function Page() {
  return <SupplierFormPage />
}
