import type { Metadata } from 'next'
import { Suspense } from 'react'
import { InventoryProductReportPage } from '@/features/reports/business-activity/pages/inventory-product-report'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Báo cáo tồn kho theo sản phẩm',
  description: 'Báo cáo tồn kho hiện tại theo sản phẩm',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <InventoryProductReportPage />
    </Suspense>
  )
}
