import type { Metadata } from 'next'
import { BrandDetailPage } from '@/features/brands/brand-detail'

export const metadata: Metadata = {
  title: 'Chỉnh sửa thương hiệu',
  description: 'Chỉnh sửa thông tin thương hiệu',
}

export default function Page() {
  return <BrandDetailPage />
}
