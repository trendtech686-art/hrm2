import type { Metadata } from 'next'
import { WarrantyFormPage } from '@/features/warranty/warranty-form-page'

export const metadata: Metadata = {
  title: 'Cập nhật phiếu bảo hành',
  description: 'Cập nhật trạng thái phiếu bảo hành',
}

export default function Page() {
  return <WarrantyFormPage />
}
