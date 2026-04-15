import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PaymentBranchReportPage } from '@/features/reports/business-activity/pages/payment-branch-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo thanh toán theo chi nhánh',
  description: 'Báo cáo thanh toán theo chi nhánh',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <PaymentBranchReportPage />
    </Suspense>
  )
}
