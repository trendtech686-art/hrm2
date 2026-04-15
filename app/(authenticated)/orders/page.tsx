import type { Metadata } from 'next'
import { Suspense } from 'react'
import { OrdersPage } from '@/features/orders/page'
import { getOrderStats } from '@/lib/data/orders'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Đơn hàng',
  description: 'Quản lý đơn hàng bán hàng',
}

export const dynamic = 'force-dynamic'

// Server Component - prefetch stats
async function OrdersPageWithData() {
  const stats = await getOrderStats()
  
  return (
    <OrdersPage 
      initialStats={stats}
    />
  )
}

export default function Page() {
  return (
    <Suspense fallback={<OrdersSkeleton />}>
      <OrdersPageWithData />
    </Suspense>
  )
}

function OrdersSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats cards skeleton */}
      <div className="grid gap-4 md:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 bg-muted/50 animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="h-10 bg-muted/50 animate-pulse rounded" />
      <TableSkeleton rows={10} columns={8} />
    </div>
  )
}
