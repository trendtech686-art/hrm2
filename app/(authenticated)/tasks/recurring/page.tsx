import type { Metadata } from 'next'
import { RecurringTasksPage } from '@/features/tasks/components/recurring-page'

export const metadata: Metadata = {
  title: 'Công việc lặp lại',
  description: 'Quản lý công việc lặp lại',
}

export default function Page() {
  return <RecurringTasksPage />
}
