import type { Metadata } from 'next'
import { Suspense } from 'react'
import { BrandsPage } from '@/features/brands/page'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Thương hiệu',
  description: 'Quản lý thương hiệu sản phẩm',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <BrandsPage />
    </Suspense>
  )
}
