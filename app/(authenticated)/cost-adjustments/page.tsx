import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CostAdjustmentListPage } from '@/features/cost-adjustments/page'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Điều chỉnh chi phí',
  description: 'Quản lý và theo dõi các phiếu điều chỉnh chi phí',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <CostAdjustmentListPage />
    </Suspense>
  )
}
