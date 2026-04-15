import type { Metadata } from 'next'
import { Suspense } from 'react'
import { InventoryCategoryReportPage } from '@/features/reports/business-activity/pages/inventory-category-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo tồn kho theo danh mục',
  description: 'Báo cáo tồn kho hiện tại theo danh mục sản phẩm',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <InventoryCategoryReportPage />
    </Suspense>
  )
}
