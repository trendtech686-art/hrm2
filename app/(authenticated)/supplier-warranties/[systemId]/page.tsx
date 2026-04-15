import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SupplierWarrantyDetailPage } from '@/features/supplier-warranty/detail-page'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Chi tiết BH NCC',
  description: 'Chi tiết phiếu bảo hành nhà cung cấp',
}

export default async function Page({ params }: { params: Promise<{ systemId: string }> }) {
  const { systemId } = await params
  return (
    <Suspense fallback={<TableSkeleton />}>
      <SupplierWarrantyDetailPage systemId={systemId} />
    </Suspense>
  )
}
