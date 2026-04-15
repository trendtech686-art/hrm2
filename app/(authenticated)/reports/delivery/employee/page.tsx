import type { Metadata } from 'next'
import { Suspense } from 'react'
import { DeliveryEmployeeReportPage } from '@/features/reports/business-activity/pages/delivery-employee-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo giao hàng theo nhân viên',
  description: 'Báo cáo tình hình giao hàng theo nhân viên',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <DeliveryEmployeeReportPage />
    </Suspense>
  )
}
