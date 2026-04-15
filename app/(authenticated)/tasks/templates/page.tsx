import type { Metadata } from 'next'
import { TaskTemplatesPage } from '@/features/tasks/components/templates-page'

export const metadata: Metadata = {
  title: 'Mẫu công việc',
  description: 'Quản lý mẫu công việc',
}

export default function Page() {
  return <TaskTemplatesPage />
}
