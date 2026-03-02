import type { Metadata } from 'next'
import { Suspense } from 'react'
import { TasksPage } from '@/features/tasks/page'
import { getTaskStats } from '@/lib/data/tasks'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Công việc',
  description: 'Quản lý công việc và nhiệm vụ',
}

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic'

// Server Component - prefetch stats
async function TasksPageWithData() {
  const stats = await getTaskStats()
  return <TasksPage initialStats={stats} />
}

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <TasksPageWithData />
    </Suspense>
  )
}
