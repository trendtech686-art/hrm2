import type { Metadata } from 'next'
import { ProductCategoriesPage } from '@/features/categories/page'

export const metadata: Metadata = {
  title: 'Danh mục',
  description: 'Quản lý danh mục sản phẩm',
}

export default function Page() {
  return <ProductCategoriesPage />
}
