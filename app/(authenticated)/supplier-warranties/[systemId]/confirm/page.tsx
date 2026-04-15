import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SupplierWarrantyConfirmPage } from '@/features/supplier-warranty/components/confirm-page'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Xác nhận BH NCC',
  description: 'Xác nhận kết quả bảo hành nhà cung cấp',
}

export default async function Page({ params }: { params: Promise<{ systemId: string }> }) {
  const { systemId } = await params
  return (
    <Suspense fallback={<TableSkeleton />}>
      <SupplierWarrantyConfirmPage systemId={systemId} />
    </Suspense>
  )
}
