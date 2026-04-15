import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ReportsOverviewPage } from '@/features/reports/overview-page'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Tổng quan Báo cáo',
  description: 'Tổng quan các chỉ số kinh doanh',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <ReportsOverviewPage />
    </Suspense>
  )
}
