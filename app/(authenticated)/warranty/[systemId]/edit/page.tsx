import type { Metadata } from 'next'
import { WarrantyFormPage } from '@/features/warranty/warranty-form-page'

export const metadata: Metadata = {
  title: 'Chỉnh sửa phiếu bảo hành',
  description: 'Chỉnh sửa thông tin phiếu bảo hành',
}

export default function Page() {
  return <WarrantyFormPage />
}
