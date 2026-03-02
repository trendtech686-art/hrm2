import type { Metadata } from 'next'
import { Suspense } from 'react'
import { WikiPage } from '@/features/wiki/page'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Wiki',
  description: 'Quản lý tài liệu nội bộ',
}

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <WikiPage />
    </Suspense>
  )
}
