import type { Metadata } from 'next'
import { UserTasksPage } from '@/features/tasks/components/user-tasks-page'

export const metadata: Metadata = {
  title: 'Công việc của tôi',
  description: 'Danh sách công việc được giao cho bạn',
}

export default function Page() {
  return <UserTasksPage />
}
