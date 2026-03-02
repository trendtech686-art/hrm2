import type { Metadata } from 'next'
import { Suspense } from 'react'
import { WarrantyListPage } from '@/features/warranty/warranty-list-page'
import { getWarrantyStats } from '@/lib/data/warranty'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Bảo hành',
  description: 'Quản lý phiếu bảo hành sản phẩm',
}

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic'

// Server Component - prefetch stats
async function WarrantyPageWithData() {
  const stats = await getWarrantyStats()
  return <WarrantyListPage initialStats={stats} />
}

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <WarrantyPageWithData />
    </Suspense>
  )
}
