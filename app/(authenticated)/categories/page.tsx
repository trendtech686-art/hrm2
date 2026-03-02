import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ProductCategoriesPage } from '@/features/categories/page'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Danh mục',
  description: 'Quản lý danh mục sản phẩm',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <ProductCategoriesPage />
    </Suspense>
  )
}
