import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SalesProductReportPage } from '@/features/reports/business-activity/pages/sales-product-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo bán hàng theo sản phẩm',
  description: 'Báo cáo hoạt động kinh doanh theo sản phẩm',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <SalesProductReportPage />
    </Suspense>
  )
}
