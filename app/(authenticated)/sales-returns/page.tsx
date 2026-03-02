import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SalesReturnsPage } from '@/features/sales-returns/page'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Phiếu trả hàng bán',
  description: 'Quản lý các phiếu trả hàng bán',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <SalesReturnsPage />
    </Suspense>
  )
}
