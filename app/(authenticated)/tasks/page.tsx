import type { Metadata } from 'next'
import { TasksPage } from '@/features/tasks/page'

export const metadata: Metadata = {
  title: 'Công việc',
  description: 'Quản lý công việc và nhiệm vụ',
}

export default function Page() {
  return <TasksPage />
}
