import type { Metadata } from 'next'
import { Suspense } from 'react'
import { DeliveryShipmentReportPage } from '@/features/reports/business-activity/pages/delivery-shipment-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo chi tiết vận đơn',
  description: 'Danh sách chi tiết các vận đơn giao hàng',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <DeliveryShipmentReportPage />
    </Suspense>
  )
}
