import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ComplaintsPage } from '@/features/complaints/page'
import { getComplaintStats } from '@/lib/data/complaints'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Khiếu nại',
  description: 'Quản lý khiếu nại khách hàng',
}

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic'

// Server Component - prefetch stats
async function ComplaintsPageWithData() {
  const stats = await getComplaintStats()
  return <ComplaintsPage initialStats={stats} />
}

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <ComplaintsPageWithData />
    </Suspense>
  )
}
