import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SalesCustomerReportPage } from '@/features/reports/business-activity/pages/sales-customer-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo bán hàng theo khách hàng',
  description: 'Báo cáo hoạt động kinh doanh theo khách hàng',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <SalesCustomerReportPage />
    </Suspense>
  )
}
