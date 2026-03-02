import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LeavesPage } from '@/features/leaves/page'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Nghỉ phép',
  description: 'Quản lý đơn nghỉ phép',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <LeavesPage />
    </Suspense>
  )
}
