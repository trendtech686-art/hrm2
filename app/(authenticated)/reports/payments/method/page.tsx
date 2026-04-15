import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PaymentMethodReportPage } from '@/features/reports/business-activity/pages/payment-method-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo thanh toán theo phương thức',
  description: 'Báo cáo thanh toán theo phương thức thanh toán',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <PaymentMethodReportPage />
    </Suspense>
  )
}
