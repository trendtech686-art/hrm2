import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ProductsPage } from '@/features/products/page'
import { getProductStats } from '@/lib/data/products'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Sản phẩm',
  description: 'Quản lý danh mục sản phẩm',
}

export const dynamic = 'force-dynamic'

async function ProductsPageWithData() {
  const stats = await getProductStats()
  
  return (
    <ProductsPage 
      initialStats={stats}
    />
  )
}

export default function Page() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsPageWithData />
    </Suspense>
  )
}

function ProductsSkeleton() {
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
