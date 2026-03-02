import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ReceiptsPage } from '@/features/receipts/page'
import { getReceiptStats } from '@/lib/data/receipts'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Phiếu thu',
  description: 'Quản lý phiếu thu tiền',
}

export const dynamic = 'force-dynamic'

async function ReceiptsPageWithData() {
  const stats = await getReceiptStats()
  return <ReceiptsPage initialStats={stats} />
}

export default function Page() {
  return (
    <Suspense fallback={<ReceiptsSkeleton />}>
      <ReceiptsPageWithData />
    </Suspense>
  )
}

function ReceiptsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-muted/50 animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="h-10 bg-muted/50 animate-pulse rounded" />
      <TableSkeleton rows={10} columns={7} />
    </div>
  )
}
