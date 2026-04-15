import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ReturnOrderReportPage } from '@/features/reports/business-activity/pages/return-order-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo trả hàng theo đơn',
  description: 'Báo cáo trả hàng theo đơn hàng',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <ReturnOrderReportPage />
    </Suspense>
  )
}
