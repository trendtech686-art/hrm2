import type { Metadata } from 'next'
import { Suspense } from 'react'
import { DeliveryCustomerReportPage } from '@/features/reports/business-activity/pages/delivery-customer-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo giao hàng theo khách hàng',
  description: 'Báo cáo tình hình giao hàng theo khách hàng',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <DeliveryCustomerReportPage />
    </Suspense>
  )
}
