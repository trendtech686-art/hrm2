import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'Lịch công việc',
  description: 'Xem lịch biểu công việc',
}

// FullCalendar + its plugins weigh ~350 KB gzipped. Load only when the user
// actually navigates to the calendar page so the rest of the app stays lean.
const TaskCalendarView = dynamic(
  () => import('@/features/tasks/components/calendar-view').then((m) => ({ default: m.TaskCalendarView })),
  { ssr: false, loading: () => <div className="p-8 text-sm text-muted-foreground">Đang tải lịch…</div> },
)

export default function Page() {
  return <TaskCalendarView />
}
