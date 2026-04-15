import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SupplierWarrantyFormPage } from '@/features/supplier-warranty/form-page'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Tạo phiếu BH NCC',
  description: 'Tạo phiếu bảo hành nhà cung cấp mới',
}

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <SupplierWarrantyFormPage />
    </Suspense>
  )
}
