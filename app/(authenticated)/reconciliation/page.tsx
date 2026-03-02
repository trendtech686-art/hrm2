import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ReconciliationPage } from '@/features/reconciliation/page'
import { getReconciliationStats } from '@/lib/data/reconciliation'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Đối chiếu công nợ',
  description: 'Quản lý đối chiếu công nợ khách hàng',
}

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic'

// Server Component - prefetch stats
async function ReconciliationPageWithData() {
  const initialStats = await getReconciliationStats()
  return <ReconciliationPage initialStats={initialStats} />
}

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <ReconciliationPageWithData />
    </Suspense>
  )
}
