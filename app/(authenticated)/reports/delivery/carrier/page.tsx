import type { Metadata } from 'next'
import { Suspense } from 'react'
import { DeliveryCarrierReportPage } from '@/features/reports/business-activity/pages/delivery-carrier-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo giao hàng theo hãng vận chuyển',
  description: 'Báo cáo tình hình giao hàng theo hãng vận chuyển',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <DeliveryCarrierReportPage />
    </Suspense>
  )
}
