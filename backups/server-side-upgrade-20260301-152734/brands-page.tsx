import type { Metadata } from 'next'
import { BrandsPage } from '@/features/brands/page'

export const metadata: Metadata = {
  title: 'Thương hiệu',
  description: 'Quản lý thương hiệu sản phẩm',
}

export default function Page() {
  return <BrandsPage />
}
