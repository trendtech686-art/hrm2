import type { Metadata } from 'next'
import { Suspense } from 'react'
import { OrderedProductsPage } from '@/features/ordered-products/page'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Quản lý hàng đặt',
  description: 'Danh sách tất cả sản phẩm đã đặt từ nhà cung cấp',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<OrderedProductsSkeleton />}>
      <OrderedProductsPage />
    </Suspense>
  )
}

function OrderedProductsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 bg-muted/50 animate-pulse rounded" />
      <TableSkeleton rows={10} columns={7} />
    </div>
  )
}
