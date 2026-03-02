import type { Metadata } from 'next'
import { Suspense } from 'react'
import { StockTransfersPage } from '@/features/stock-transfers/page'
import { getStockTransferStats } from '@/lib/data/stock-transfers'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Chuyển kho',
  description: 'Quản lý phiếu chuyển kho',
}

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic'

// Server Component - prefetch stats
async function StockTransfersPageWithData() {
  const stats = await getStockTransferStats()
  return <StockTransfersPage initialStats={stats} />
}

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <StockTransfersPageWithData />
    </Suspense>
  )
}
