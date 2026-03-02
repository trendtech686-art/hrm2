import type { Metadata } from 'next'
import { Suspense } from 'react'
import { StockLocationsPage } from '@/features/stock-locations/page'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Vị trí kho',
  description: 'Quản lý các vị trí trong kho',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <StockLocationsPage />
    </Suspense>
  )
}
