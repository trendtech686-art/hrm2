import type { Metadata } from 'next'
import { PrintTemplatesPage } from '@/features/settings/printer/print-templates-page'

export const metadata: Metadata = {
  title: 'Mẫu in',
  description: 'Quản lý mẫu in hóa đơn',
}

export default function Page() {
  return <PrintTemplatesPage />
}
