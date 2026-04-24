import type { Metadata } from 'next'
import { ActivityLogDashboard } from '@/features/activity-logs/components/activity-log-dashboard'

export const metadata: Metadata = {
  title: 'Nhật ký hoạt động',
  description: 'Xem lịch sử hoạt động trong hệ thống',
}

export default function ActivityLogsPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-semibold mb-6">Nhật ký hoạt động</h1>
      <ActivityLogDashboard />
    </div>
  )
}
