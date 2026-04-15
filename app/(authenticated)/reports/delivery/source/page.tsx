import type { Metadata } from 'next'
import { Suspense } from 'react'
import { DeliverySourceReportPage } from '@/features/reports/business-activity/pages/delivery-source-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo giao hàng theo nguồn bán hàng',
  description: 'Báo cáo tình hình giao hàng theo nguồn đơn hàng',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <DeliverySourceReportPage />
    </Suspense>
  )
}
