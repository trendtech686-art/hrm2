import type { Metadata } from 'next'
import { Suspense } from 'react'
import { InventoryPage } from '@/features/inventory/page'
import { getInventorySummary } from '@/lib/data/inventory'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Tồn kho',
  description: 'Quản lý tồn kho theo sản phẩm và chi nhánh',
}

export const dynamic = 'force-dynamic'

async function InventoryPageWithData() {
  const summary = await getInventorySummary()
  return <InventoryPage initialSummary={summary} />
}

export default function Page() {
  return (
    <Suspense fallback={<InventorySkeleton />}>
      <InventoryPageWithData />
    </Suspense>
  )
}

function InventorySkeleton() {
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
