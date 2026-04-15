import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSessionFromCookie } from '@/lib/api-utils'
import { hasPermission } from '@/features/employees/permissions'
import { TaskFormPage } from '@/features/tasks/components/task-form-page'

export const metadata: Metadata = {
  title: 'Chỉnh sửa công việc',
  description: 'Chỉnh sửa thông tin công việc',
}

export default async function Page() {
  const session = await getSessionFromCookie()
  if (!session?.user || (session.user.role !== 'Admin' && !hasPermission(session.user.role, 'edit_tasks'))) {
    redirect('/tasks')
  }
  return <TaskFormPage />
}
