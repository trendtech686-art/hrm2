import type { Metadata } from 'next'
import { TaskFormPage } from '@/features/tasks/components/task-form-page'

export const metadata: Metadata = {
  title: 'Chỉnh sửa công việc',
  description: 'Chỉnh sửa thông tin công việc',
}

export default function Page() {
  return <TaskFormPage />
}
