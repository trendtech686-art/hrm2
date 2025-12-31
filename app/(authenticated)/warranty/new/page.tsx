import type { Metadata } from 'next'
import { WarrantyFormPage } from '@/features/warranty/warranty-form-page'

export const metadata: Metadata = {
  title: 'Tạo phiếu bảo hành mới',
  description: 'Tạo phiếu bảo hành sản phẩm',
}

export default function Page() {
  return <WarrantyFormPage />
}
