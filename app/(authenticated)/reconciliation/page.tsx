import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ReconciliationPage } from '@/features/reconciliation/page'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Đối soát COD',
  description: 'Quản lý đối soát COD và phí vận chuyển',
}

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <ReconciliationPage />
    </Suspense>
  )
}
