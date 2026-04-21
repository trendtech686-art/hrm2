import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSessionFromCookie } from '@/lib/api-utils'
import { hasPermission } from '@/features/employees/permissions'
import { getEffectiveRole, isAdminRole } from '@/lib/rbac/get-role'
import { TaskFormPage } from '@/features/tasks/components/task-form-page'

export const metadata: Metadata = {
  title: 'Tạo công việc mới',
  description: 'Tạo công việc mới',
}

export default async function Page() {
  const session = await getSessionFromCookie()
  if (!session?.user) {
    redirect('/tasks')
  }
  const role = getEffectiveRole(session.user) ?? session.user.role
  if (!isAdminRole(session.user) && !hasPermission(role, 'create_tasks')) {
    redirect('/tasks')
  }
  return <TaskFormPage />
}
