import type { Metadata } from 'next'
import { Suspense } from 'react'
import { DeliveryTimeReportPage } from '@/features/reports/business-activity/pages/delivery-time-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo giao hàng theo thời gian',
  description: 'Báo cáo tình hình giao hàng theo thời gian',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <DeliveryTimeReportPage />
    </Suspense>
  )
}
