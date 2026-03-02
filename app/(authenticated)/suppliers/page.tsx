import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SuppliersPage } from '@/features/suppliers/page'
import { getSupplierStats } from '@/lib/data/suppliers'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Nhà cung cấp',
  description: 'Quản lý thông tin nhà cung cấp',
}

export const dynamic = 'force-dynamic'

async function SuppliersPageWithData() {
  const stats = await getSupplierStats()
  return <SuppliersPage initialStats={stats} />
}

export default function Page() {
  return (
    <Suspense fallback={<SuppliersSkeleton />}>
      <SuppliersPageWithData />
    </Suspense>
  )
}

function SuppliersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-muted/50 animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="h-10 bg-muted/50 animate-pulse rounded" />
      <TableSkeleton rows={10} columns={6} />
    </div>
  )
}
