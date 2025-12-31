import type { Metadata } from 'next'
import { TaskFormPage } from '@/features/tasks/components/task-form-page'

export const metadata: Metadata = {
  title: 'Tạo công việc mới',
  description: 'Tạo công việc mới',
}

export default function Page() {
  return <TaskFormPage />
}
