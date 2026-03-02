import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PayrollListPage } from '@/features/payroll/list-page'
import { getPayrollStats } from '@/lib/data/payroll'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Bảng lương',
  description: 'Quản lý bảng lương nhân viên',
}

export const dynamic = 'force-dynamic'

async function PayrollListPageWithData() {
  const stats = await getPayrollStats()
  return <PayrollListPage initialStats={stats} />
}

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <PayrollListPageWithData />
    </Suspense>
  )
}
