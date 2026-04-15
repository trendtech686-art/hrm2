import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ReturnProductReportPage } from '@/features/reports/business-activity/pages/return-product-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo trả hàng theo sản phẩm',
  description: 'Báo cáo trả hàng theo sản phẩm',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <ReturnProductReportPage />
    </Suspense>
  )
}
