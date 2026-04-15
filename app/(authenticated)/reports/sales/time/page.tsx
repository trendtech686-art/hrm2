import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SalesTimeReportPage } from '@/features/reports/business-activity/pages/sales-time-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo bán hàng theo thời gian',
  description: 'Báo cáo hoạt động kinh doanh theo thời gian',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <SalesTimeReportPage />
    </Suspense>
  )
}
