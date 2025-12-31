import type { Metadata } from 'next'
import { ProductsTrashPage } from '@/features/products/trash-page'

export const metadata: Metadata = {
  title: 'Thùng rác sản phẩm',
  description: 'Quản lý sản phẩm đã xóa',
}

export default function Page() {
  return <ProductsTrashPage />
}
