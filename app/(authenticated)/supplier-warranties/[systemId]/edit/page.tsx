import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SupplierWarrantyFormPage } from '@/features/supplier-warranty/form-page'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Sửa phiếu BH NCC',
  description: 'Sửa phiếu bảo hành nhà cung cấp',
}

export default async function Page({ params }: { params: Promise<{ systemId: string }> }) {
  const { systemId } = await params
  return (
    <Suspense fallback={<TableSkeleton />}>
      <SupplierWarrantyFormPage systemId={systemId} />
    </Suspense>
  )
}
