import type { Metadata } from 'next'
import { TaskCalendarView } from '@/features/tasks/components/calendar-view'

export const metadata: Metadata = {
  title: 'Lịch công việc',
  description: 'Xem lịch biểu công việc',
}

export default function Page() {
  return <TaskCalendarView />
}
