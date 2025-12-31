import type { Metadata } from 'next'
import { CategoryDetailPage } from '@/features/categories/category-detail'

export const metadata: Metadata = {
  title: 'Chỉnh sửa danh mục',
  description: 'Chỉnh sửa thông tin danh mục',
}

export default function Page() {
  return <CategoryDetailPage />
}
