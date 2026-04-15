import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SalesCustomerGroupReportPage } from '@/features/reports/business-activity/pages/sales-customer-group-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo bán hàng theo nhóm khách hàng',
  description: 'Báo cáo hoạt động kinh doanh theo nhóm khách hàng',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <SalesCustomerGroupReportPage />
    </Suspense>
  )
}
