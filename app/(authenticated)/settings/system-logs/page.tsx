import type { Metadata } from 'next'
import { SystemLogsPage } from '@/features/settings/system/system-logs-page'

export const metadata: Metadata = {
  title: 'Nhật ký hệ thống',
  description: 'Xem nhật ký hoạt động',
}

export default function Page() {
  return <SystemLogsPage />
}
