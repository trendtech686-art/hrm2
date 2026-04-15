import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SalesTaxReportPage } from '@/features/reports/business-activity/pages/sales-tax-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo bán hàng theo thuế',
  description: 'Phân tích doanh thu và thuế theo mức thuế suất',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <SalesTaxReportPage />
    </Suspense>
  )
}
