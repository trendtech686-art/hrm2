import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SupplierWarrantyPage } from '@/features/supplier-warranty/page'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'BH Nhà cung cấp',
  description: 'Quản lý phiếu bảo hành nhà cung cấp',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <SupplierWarrantyPage />
    </Suspense>
  )
}
