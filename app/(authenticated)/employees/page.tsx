import type { Metadata } from 'next'
import { Suspense } from 'react'
import { EmployeesPage } from '@/features/employees/page'
import { getEmployeeStats } from '@/lib/data/employees'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Nhân viên',
  description: 'Quản lý thông tin nhân viên',
}

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic'

// Server Component - prefetch stats
async function EmployeesPageWithData() {
  const stats = await getEmployeeStats()
  return <EmployeesPage initialStats={stats} />
}

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <EmployeesPageWithData />
    </Suspense>
  )
}
