import type { Metadata } from 'next'
import { TaskDetailPage } from '@/features/tasks/components/detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết công việc',
  description: 'Xem thông tin công việc',
}

export default function Page() {
  return <TaskDetailPage />
}
