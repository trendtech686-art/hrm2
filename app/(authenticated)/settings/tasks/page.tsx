import type { Metadata } from 'next'
import { TasksSettingsPage } from '@/features/settings/tasks/tasks-settings-page'

export const metadata: Metadata = {
  title: 'Cài đặt công việc',
  description: 'Quản lý cài đặt công việc',
}

export default function Page() {
  return <TasksSettingsPage />
}
