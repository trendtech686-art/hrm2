import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PriceAdjustmentListPage } from '@/features/price-adjustments/page'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Điều chỉnh giá',
  description: 'Quản lý điều chỉnh giá sản phẩm',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <PriceAdjustmentListPage />
    </Suspense>
  )
}
