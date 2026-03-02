import type { Metadata } from 'next'
import { Suspense } from 'react'
import { InventoryChecksPage } from '@/features/inventory-checks/page'
import { getInventoryCheckStats } from '@/lib/data/inventory-checks'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Kiểm kê kho',
  description: 'Quản lý phiếu kiểm kê kho hàng',
}

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic'

// Server Component - prefetch stats
async function InventoryChecksPageWithData() {
  const stats = await getInventoryCheckStats()
  return <InventoryChecksPage initialStats={stats} />
}

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <InventoryChecksPageWithData />
    </Suspense>
  )
}
