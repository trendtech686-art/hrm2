import type { Metadata } from 'next'
import { ProductsPage } from '@/features/products/page'

export const metadata: Metadata = {
  title: 'Sản phẩm',
  description: 'Quản lý danh mục sản phẩm',
}

export default function Page() {
  return <ProductsPage />
}
