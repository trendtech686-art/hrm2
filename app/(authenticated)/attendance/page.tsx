import type { Metadata } from 'next'
import { AttendancePage } from '@/features/attendance/page'

export const metadata: Metadata = {
  title: 'Chấm công',
  description: 'Quản lý chấm công nhân viên',
}

export default function Page() {
  return <AttendancePage />
}
