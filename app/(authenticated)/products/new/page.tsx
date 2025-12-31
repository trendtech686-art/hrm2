import type { Metadata } from 'next'
import { ProductFormPage } from '@/features/products/form-page'

export const metadata: Metadata = {
  title: 'Thêm sản phẩm mới',
  description: 'Tạo sản phẩm mới',
}

export default function Page() {
  return <ProductFormPage />
}
