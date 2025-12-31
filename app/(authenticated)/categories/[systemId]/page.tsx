import type { Metadata } from 'next'
import { CategoryDetailPage } from '@/features/categories/category-detail'

export const metadata: Metadata = {
  title: 'Chi tiết danh mục',
  description: 'Xem thông tin danh mục',
}

export default function Page() {
  return <CategoryDetailPage />
}
