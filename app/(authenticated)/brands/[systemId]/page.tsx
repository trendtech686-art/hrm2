import type { Metadata } from 'next'
import { BrandDetailPage } from '@/features/brands/brand-detail'

export const metadata: Metadata = {
  title: 'Chi tiết thương hiệu',
  description: 'Xem thông tin thương hiệu',
}

export default function Page() {
  return <BrandDetailPage />
}
