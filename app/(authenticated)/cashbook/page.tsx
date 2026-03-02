import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CashbookPage } from '@/features/cashbook/page'
import { getCashbookStats } from '@/lib/data/cashbook'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Sổ quỹ',
  description: 'Quản lý sổ quỹ tiền mặt',
}

export const dynamic = 'force-dynamic'

async function CashbookPageWithData() {
  const stats = await getCashbookStats()
  return <CashbookPage initialStats={stats} />
}

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <CashbookPageWithData />
    </Suspense>
  )
}
