import type { Metadata } from 'next'
import { BrandNewPage } from '@/features/brands/brand-new'

export const metadata: Metadata = {
  title: 'Thêm thương hiệu mới',
  description: 'Tạo thương hiệu mới',
}

export default function Page() {
  return <BrandNewPage />
}
