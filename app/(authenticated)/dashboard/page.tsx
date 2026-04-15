import type { Metadata } from 'next'
import { Suspense } from 'react'
import { DashboardPageLite } from '@/features/dashboard/page-lite'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Tổng quan hoạt động kinh doanh và các chỉ số quan trọng',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <DashboardPageLite />
    </Suspense>
  )
}
