import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ShipmentsPage } from '@/features/shipments/page'
import { getShipmentStats } from '@/lib/data/shipments'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Vận chuyển',
  description: 'Quản lý đơn vận chuyển',
}

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic'

// Server Component - prefetch stats
async function ShipmentsPageWithData() {
  const stats = await getShipmentStats()
  return <ShipmentsPage initialStats={stats} />
}

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <ShipmentsPageWithData />
    </Suspense>
  )
}
