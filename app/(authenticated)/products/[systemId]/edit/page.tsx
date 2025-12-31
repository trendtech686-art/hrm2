import type { Metadata } from 'next'
import { ProductFormPage } from '@/features/products/form-page'

export const metadata: Metadata = {
  title: 'Chỉnh sửa sản phẩm',
  description: 'Chỉnh sửa thông tin sản phẩm',
}

export default function Page() {
  return <ProductFormPage />
}
