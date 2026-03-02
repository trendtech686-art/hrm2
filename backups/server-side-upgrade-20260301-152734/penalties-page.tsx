import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PenaltiesPage } from '@/features/settings/penalties/page'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Quản lý phạt',
  description: 'Quản lý các loại phạt và phiếu phạt',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <PenaltiesPage />
    </Suspense>
  )
}
