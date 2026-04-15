import type { Metadata } from 'next'
import { TasksDashboardPage } from '@/features/tasks/components/dashboard-page'

export const metadata: Metadata = {
  title: 'Dashboard công việc',
  description: 'Thống kê và phân tích công việc',
}

export default function Page() {
  return <TasksDashboardPage />
}
