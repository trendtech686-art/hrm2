import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ReportsIndexPage } from '@/features/reports/index-page'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo',
  description: 'Xem các báo cáo kinh doanh',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <ReportsIndexPage />
    </Suspense>
  )
}
