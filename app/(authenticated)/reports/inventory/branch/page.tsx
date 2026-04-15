import type { Metadata } from 'next'
import { Suspense } from 'react'
import { InventoryBranchReportPage } from '@/features/reports/business-activity/pages/inventory-branch-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo tồn kho theo chi nhánh',
  description: 'Báo cáo tồn kho hiện tại theo chi nhánh',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <InventoryBranchReportPage />
    </Suspense>
  )
}
