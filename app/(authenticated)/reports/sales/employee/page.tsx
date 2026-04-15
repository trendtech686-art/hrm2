import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SalesEmployeeReportPage } from '@/features/reports/business-activity/pages/sales-employee-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo bán hàng theo nhân viên',
  description: 'Báo cáo hoạt động kinh doanh theo nhân viên',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <SalesEmployeeReportPage />
    </Suspense>
  )
}
