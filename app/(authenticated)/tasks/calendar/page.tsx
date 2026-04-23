import type { Metadata } from 'next'
import { TaskCalendarView } from '@/features/tasks/components/calendar-view'

export const metadata: Metadata = {
  title: 'Lịch công việc',
  description: 'Xem lịch biểu công việc',
}

/**
 * Server page shell: metadata stays on the server.
 * TaskCalendarView is a Client Component; FullCalendar is lazy-loaded inside it (ssr: false there is valid).
 */
export default function Page() {
  return <TaskCalendarView />
}
