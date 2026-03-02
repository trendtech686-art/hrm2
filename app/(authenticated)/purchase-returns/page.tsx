import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PurchaseReturnsPage } from '@/features/purchase-returns/page'
import { getPurchaseReturnStats } from '@/lib/data/purchase-returns'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Phiếu trả hàng nhập',
  description: 'Quản lý các phiếu trả hàng nhập',
}

export const dynamic = 'force-dynamic'

async function PurchaseReturnsPageWithData() {
  const stats = await getPurchaseReturnStats()
  return <PurchaseReturnsPage initialStats={stats} />
}

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <PurchaseReturnsPageWithData />
    </Suspense>
  )
}
