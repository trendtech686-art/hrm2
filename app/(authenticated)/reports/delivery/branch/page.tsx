import type { Metadata } from 'next'
import { Suspense } from 'react'
import { DeliveryBranchReportPage } from '@/features/reports/business-activity/pages/delivery-branch-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo giao hàng theo chi nhánh',
  description: 'Báo cáo tình hình giao hàng theo chi nhánh',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <DeliveryBranchReportPage />
    </Suspense>
  )
}
