import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PaymentTimeReportPage } from '@/features/reports/business-activity/pages/payment-time-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo thanh toán theo thời gian',
  description: 'Báo cáo thanh toán theo thời gian',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <PaymentTimeReportPage />
    </Suspense>
  )
}
