import type { Metadata } from 'next'
import { Suspense } from 'react'
import { DeliveryChannelReportPage } from '@/features/reports/business-activity/pages/delivery-channel-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo giao hàng theo kênh bán hàng',
  description: 'Báo cáo tình hình giao hàng theo kênh bán hàng',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <DeliveryChannelReportPage />
    </Suspense>
  )
}
