import type { Metadata } from 'next'
import { ImportExportLogsPage } from '@/features/settings/system/import-export-logs-page'

export const metadata: Metadata = {
  title: 'Lịch sử Import/Export',
  description: 'Xem lịch sử nhập xuất dữ liệu',
}

export default function Page() {
  return <ImportExportLogsPage />
}
