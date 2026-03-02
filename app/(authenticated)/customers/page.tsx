import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CustomersPage } from '@/features/customers/page'
import { getCustomerStats, getCustomerGroups } from '@/lib/data/customers'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Khách hàng',
  description: 'Quản lý thông tin khách hàng',
}

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic'

// Server Component - prefetch stats and groups
async function CustomersPageWithData() {
  // Parallel fetch on server - data will be cached
  const [stats, groups] = await Promise.all([
    getCustomerStats(),
    getCustomerGroups(),
  ])
  
  return (
    <CustomersPage 
      initialStats={stats}
      initialGroups={groups}
    />
  )
}

export default function Page() {
  return (
    <Suspense fallback={<CustomersSkeleton />}>
      <CustomersPageWithData />
    </Suspense>
  )
}

function CustomersSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats cards skeleton */}
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-muted/50 animate-pulse rounded-lg" />
        ))}
      </div>
      {/* Toolbar skeleton */}
      <div className="h-10 bg-muted/50 animate-pulse rounded" />
      {/* Table skeleton */}
      <TableSkeleton rows={10} columns={7} />
    </div>
  )
}
