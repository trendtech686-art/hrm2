import type { Metadata } from 'next'
import { Suspense } from 'react'
import PurchaseOrdersPage from '@/features/purchase-orders/page'
import { getPurchaseOrderStats, getPOItemStats } from '@/lib/data/purchase-orders'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Đơn mua hàng',
  description: 'Quản lý đơn mua hàng từ nhà cung cấp',
}

export const dynamic = 'force-dynamic'

async function PurchaseOrdersPageWithData() {
  const [stats, itemStats] = await Promise.all([
    getPurchaseOrderStats(),
    getPOItemStats(),
  ])
  return <PurchaseOrdersPage initialStats={stats} initialItemStats={itemStats} />
}

export default function Page() {
  return (
    <Suspense fallback={<PurchaseOrdersSkeleton />}>
      <PurchaseOrdersPageWithData />
    </Suspense>
  )
}

function PurchaseOrdersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-muted/50 animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="h-10 bg-muted/50 animate-pulse rounded" />
      <TableSkeleton rows={10} columns={8} />
    </div>
  )
}
