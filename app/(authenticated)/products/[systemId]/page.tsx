import type { Metadata } from 'next'
import { ProductDetailPage } from '@/features/products/detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết sản phẩm',
  description: 'Xem chi tiết sản phẩm',
}

export default function Page() {
  return <ProductDetailPage />
}
