import type { Metadata } from 'next'
import { ProductsHubPage } from '@/features/inventory/components/products-hub-page'

export const metadata: Metadata = {
  title: 'Sản phẩm',
  description: 'Quản lý sản phẩm, kho hàng, nhà cung cấp',
}

export default function Page() {
  return <ProductsHubPage />
}
