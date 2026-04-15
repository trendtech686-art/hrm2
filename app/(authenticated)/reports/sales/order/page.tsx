import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SalesOrderReportPage } from '@/features/reports/business-activity/pages/sales-order-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo bán hàng theo đơn hàng',
  description: 'Báo cáo hoạt động kinh doanh theo đơn hàng',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <SalesOrderReportPage />
    </Suspense>
  )
}
