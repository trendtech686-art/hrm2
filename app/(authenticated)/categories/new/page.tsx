import type { Metadata } from 'next'
import { CategoryNewPage } from '@/features/categories/category-new'

export const metadata: Metadata = {
  title: 'Thêm danh mục mới',
  description: 'Tạo danh mục sản phẩm mới',
}

export default function Page() {
  return <CategoryNewPage />
}
