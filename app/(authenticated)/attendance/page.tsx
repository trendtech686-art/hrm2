import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AttendancePage } from '@/features/attendance/page'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Chấm công',
  description: 'Quản lý chấm công nhân viên',
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <AttendancePage />
    </Suspense>
  )
}
